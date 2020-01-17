const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();
        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude} = request.body;
    
        let dev = await Dev.findOne({ github_username});

        if  (!dev) {
            const apiresponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
        const {name = login, avatar_url,bio } = apiresponse.data;
    
        const techArray = parseStringAsArray(techs);     
        
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        };
    
         dev = await Dev.create({
            github_username,
            name,
            avatar_url,
            bio,
            techs: techArray,
            location,
        }) 
        }

        return response.json(dev);
},

    async update(require, response) {
        const { id } = require.params;
        const { name, bio, techs, longitude, latitude } = require.body;
        
        const dev = await Dev.findById(id);

        const techArray = techs ? parseStringAsArray(techs) : dev.techs;
                        
        const location = longitude && latitude ? {
            type: 'Point',
            coordinates: [longitude, latitude],
        } : dev.location;

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
            return response.status(401).json({ message: 'The Dev was deleted or He was not created!' });
        }

        try {
            await dev.remove();
            return response.status(200).json({ message: 'The Dev was deleted with success!' });
        } catch(error) {
            console.log(error);
        }

        
    }
};
