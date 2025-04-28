const { initializeTransaction } = require('../../lib/paystack');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, bankDetails } = req.body;
    
    // Generate unique reference
    const reference = `AIREF-${Date.now()}`;
    
    // Initialize payment (₦1050)
    const paymentData = await initializeTransaction(
      email,
      1050, // ₦1050 verification fee
      reference,
      { bankDetails }
    );

    // In a real app, you'd save this to a database
    // For demo, we'll just return the payment data
    res.status(200).json({
      success: true,
      message: 'Payment initialized',
      data: paymentData
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize payment'
    });
  }
};