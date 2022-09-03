const { youtubeThumbnail } = require('../utils/youtube_thumbnail.js');
const { MessageEmbed } = require('discord.js');
const setting = require('../../settings/config.js');

module.exports = {
    track_msg_Embed_loop: async(client, player, loop) =>{
        let embed;
        if(loop.toLowerCase() === "queue"){
            embed = new MessageEmbed()
                .setColor(setting.music.embed.color)
                .setTitle(player.queue.current.title)
                .setURL(player.queue.current.uri)
                .setImage(await youtubeThumbnail(player.queue.current.uri, 'high'))
                .setFooter({text: `เปิดโดย : ${player.queue.current.requester.username }  |  Loop : ทั้งหมด | Volume : ${player.volume}`})
        }
        else if(loop.toLowerCase() === "track"){
            embed = new MessageEmbed()
                .setColor(setting.music.embed.color)
                .setTitle(player.queue.current.title)
                .setURL(player.queue.current.uri)
                .setImage(await youtubeThumbnail(player.queue.current.uri, 'high'))
                .setFooter({text: `เปิดโดย : ${player.queue.current.requester.username }  |  Loop : เพลงเดียว | Volume : ${player.volume}`})
        }
        else if(loop.toLowerCase() === "stop"){
            embed = new MessageEmbed()
                .setColor(setting.music.embed.color)
                .setTitle(player.queue.current.title)
                .setURL(player.queue.current.uri)
                .setImage(await youtubeThumbnail(player.queue.current.uri, 'high'))
                .setFooter({text: `เปิดโดย : ${player.queue.current.requester.username }  |  Loop : ปิด | Volume : ${player.volume}`})
        }
        return embed;
    },
};