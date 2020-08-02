const axios = require('axios');
const dev = require('../models/dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
  async index(request, response) {
    const devs = await dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let devReturn = await dev.findOne({ github_username });

    if (!devReturn) {
      const apiResponse = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const { name = login, avatar_url, bio, blog } = apiResponse.data;

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };

      devReturn = await dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        blog,
        techs: techsArray,
        location,
      });
    }
    return response.json(devReturn);
  },
};
