const {Router} = require('express');
const axios = require('axios');
const Dev = require('./models/Dev');

const routes = Router();

routes.post('/devs', async (request, response) => {
    const { github_username, techs, latitude, longitude} = request.body;

    const apiresponse = await axios.get(`https://api.github.com/users/${github_username}`);

    const {name = login, avatar_url,bio } = apiresponse.data;

    const techArray = techs.split(',').map(tech => tech.trim());
    
    const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
    }

    const dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techArray,
        location
    })
    console.log(name, avatar_url, bio, github_username);

return response.json(dev); 
});
   

module.exports = routes;
