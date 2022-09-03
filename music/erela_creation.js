const manager = require('./manager.js');
const db = require('../database/quick_mongo.js');
const { MessageEmbed } = require('discord.js');
var fs = require('fs');

const setting = require('../settings/config.js');
/**
 * 
 * @param {Client} client 
 */
module.exports = async(client) =>{
    require('./handlers/erela_handler.js')(client);
    require('./events/node_event.js')(client);
}