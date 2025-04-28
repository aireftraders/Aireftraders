const { listBanks } = require('../../lib/paystack');

module.exports = async (req, res) => {
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
