const manager = require("../manager");
const db = require("../../database/quick_mongo.js");

module.exports = async(client) =>{
    manager.on('trackError', async(player, track) =>{
        const channel = client.channels.cache.get(player.textChannel);
        const voice = client.channels.cache.get(player.voiceChannel);
    });
    manager.on('trackStuck', async(player, track) =>{
        const channel = client.channels.cache.get(player.textChannel);
        const voice = client.channels.cache.get(player.voiceChannel);
    });
};