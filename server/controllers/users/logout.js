const { deleteClient } = require("../../models/crud/crud");

exports.logoutUser = async (req, res) => {
  const { cid } = req.user;
  try {
    const response = await deleteClient(cid);
    if (!response.success) return res.status(500).json({ status: 500, error: response.error });
    return res.status(200).json({ status: 200, success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, error: err });
  }
};