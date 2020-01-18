const axios = require("axios");
const Dev = require("../models/Dev");
const {
  parseStringAsArray,
  formatedTech
} = require("../utils/parseStringAsArray");

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();
    const formattedDevs = devs.map(dev => {
      return {
        _id: dev._id,
        bio: dev.bio,
        github_username: dev.github_username,
        avatar_url: dev.avatar_url,
        techs: dev.techs.map(tech => formatedTech(tech)),
        location: dev.location
      };
    });
    return response.json(formattedDevs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (dev) {
      return response.json(dev);
    }

    const apiresponse = await axios.get(
      `https://api.github.com/users/${github_username}`
    );

    const { name = login, avatar_url, bio } = apiresponse.data;

    const techArray = parseStringAsArray(techs);

    const location = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    dev = await Dev.create({
      github_username,
      name,
      avatar_url,
      bio,
      techs: techArray,
      location
    });

    return response.json(dev);
  },

  async update(require, response) {
    const { id } = require.params;
    const { name, bio, techs, longitude, latitude } = require.body;

    const dev = await Dev.findById(id);

    const techArray = techs ? parseStringAsArray(techs) : dev.techs;

    const location =
      longitude && latitude
        ? {
            type: "Point",
            coordinates: [longitude, latitude]
          }
        : dev.location;

    await dev.update({
      name: name || dev.name,
      bio: bio || dev.bio,
      location,
      techs: techArray
    });

    const updatedDev = await Dev.findById(id);

    response.json({ updatedDev });
  },

  async destroy(require, response) {
    const { id } = require.params;

    const dev = await Dev.findById(id);

    if (dev === null) {
      return response
        .status(401)
        .json({ message: "The Dev was deleted or He was not created!" });
    }

    try {
      await dev.remove();
      return response
        .status(200)
        .json({ message: "The Dev was deleted with success!" });
    } catch (error) {
      console.log(error);
    }
  }
};
