const api = require("../services/api");
const Dev = require("../model/Dev");

module.exports = {
  async index(req, res) {
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);

    if (!loggedDev) return res.json({ error: "Dev not found" });

    const devs = await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } }
      ]
    });

    return res.json(devs);
  },

  async store(req, res) {
    const { username } = req.body;

    const response = await api.get(`users/${username}`);

    const userExists = await Dev.findOne({ user: username });

    if (userExists) return res.json(userExists);

    const { name, bio, avatar_url: avatar } = response.data;

    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    });

    return res.json(dev);
  }
};