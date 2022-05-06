const User = require("../model/user");

const gethistory = async (req, res) => {
  const user = await User.findById(req.user.id).populate(req.historyType);
  let data = user[req.historyType].map((details) => {
    return {
      name: details.name,
      amount: details.basePrice,
      date: details.startDate,
      status: details.status,
      image: details.images[0],
      id: details._id,
      sellerId: details.sellerId,
    };
  });
  res.send(data);
};

module.exports = gethistory;
