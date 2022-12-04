const { MessageEmbed } = require('discord.js');
const setting = require('../../settings/config.js');
const { youtubeThumbnail } = require('./youtube_thumbnail.js');

module.exports = {
    track_msg_Embed: async(client, player) =>{
        let loopType = 'ปิด';
        if(player.trackRepeat) loopType = 'เพลงเดียว';
        else if(player.queueRepeat) loopType = 'ทั้งหมด'; 
        let vol = await player.volume;
        if(player.volume <= 0) vol = 'ปิดเสียง';

        const embed = new MessageEmbed()
            .setColor(setting.music.embed.color)
            .setTitle(player.queue.current.title)
            .setURL(player.queue.current.uri)
            .setImage(await youtubeThumbnail(player.queue.current.uri, 'high'))
            .setFooter({ text: `เปิดโดย : ${player.queue.current.requester.username} | Loop : ${loopType} | Volume : ${String(vol)}`})
        return embed;
    }
};