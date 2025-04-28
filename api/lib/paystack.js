const axios = require('axios');

// Initialize with environment variables
const paystack = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Initialize transaction
exports.initializeTransaction = async (email, amount, reference, metadata) => {
  try {
    const response = await paystack.post('/transaction/initialize', {
      email,
      amount: amount * 100, // Convert to kobo
      reference,
      metadata
    });
    return response.data;
  } catch (error) {
    console.error('Paystack error:', error.response?.data || error.message);
    throw error;
  }
};

// Verify transaction
exports.verifyTransaction = async (reference) => {
  try {
    const response = await paystack.get(`/transaction/verify/${reference}`);
    return response.data;
  } catch (error) {
    console.error('Paystack error:', error.response?.data || error.message);
    throw error;
  }
};

// List banks
exports.listBanks = async () => {
  try {
    const response = await paystack.get('/bank');
    return response.data;
  } catch (error) {
    console.error('Paystack error:', error.response?.data || error.message);
    throw error;
  }
};

// Resolve account
exports.resolveAccount = async (accountNumber, bankCode) => {
  try {
    const response = await paystack.get(`/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`);
    return response.data;
  } catch (error) {
    console.error('Paystack error:', error.response?.data || error.message);
    throw error;
  }
};