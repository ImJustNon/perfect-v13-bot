const { MessageEmbed } = require('discord.js');
const setting = require('../../settings/config.js');

module.exports = {
    default_track_embed: (client, player) =>{
        const defaultTrackEmbed = new MessageEmbed()
			.setColor(setting.music.embed.color)
			.setTitle('ยังไม่มีเพลงเล่นอยู่ ณ ตอนนี้')
			.setImage(setting.music.embed.defaultimage)
			.setFooter({ text: `ใช้ /help สำหรับคำสั่งเพิ่มเติม` })
			.setTimestamp()
        return defaultTrackEmbed;
    }
};