const setting = require('../../../settings/config.js');
const db = require("../../../database/quick_mongo.js");

module.exports = async(client) =>{
    client.on('messageCreate', async(message) =>{
        if(message.author.bot || !message.guild) return;
        const musicChannelID = await db.get(`music_${client.user.id}_${message.guild.id}_channel`);
        if(message.channel.id === musicChannelID) {
            require('../receive_request.js')(client, message);
        }
    });
}