const crypto = require('crypto');
const { verifyTransaction, resolveAccount } = require('../../lib/paystack');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    // Verify webhook signature
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET)
                       .update(JSON.stringify(req.body))
                       .digest('hex');
    
    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).send('Unauthorized');
    }

    const event = req.body;
    
    // Handle successful charge
    if (event.event === 'charge.success') {
      const { reference, amount, customer } = event.data;
      
      // Verify transaction with Paystack
      const verification = await verifyTransaction(reference);
      
      if (verification.data.status === 'success') {
        // Get bank details from metadata
        const bankDetails = verification.data.metadata.bankDetails;
        
        // Resolve account details with Paystack
        const accountDetails = await resolveAccount(
          bankDetails.accountNumber,
          bankDetails.bankCode
        );
        
        // In a real app, you would:
        // 1. Save the verification to your database
        // 2. Credit the user's account with ₦500
        // 3. Send confirmation email
        
        console.log('Successful verification:', {
          email: customer.email,
          amount: amount / 100,
          bankDetails: {
            ...bankDetails,
            accountName: accountDetails.data.account_name
          }
        });
      }
    }

    res.status(200).send('Webhook processed');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
};