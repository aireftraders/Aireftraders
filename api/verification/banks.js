const { listBanks } = require('../../lib/paystack');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const banks = await listBanks();
    res.status(200).json({
      success: true,
      data: banks.data
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banks'
    });
  }
};