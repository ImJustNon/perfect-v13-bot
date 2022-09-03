const manager = require("../manager");
const db = require("../../database/quick_mongo.js");
const { track_msg_Embed } = require("../utils/track_start_embed.js");
const { queue_msg } = require("../utils/queue_message.js");
const { default_track_embed } = require("../utils/default_track_embed.js");
const setting = require("../../settings/config.js");
const emoji = require("../../settings/config.js").emoji;
const { MessageEmbed, Integration } = require("discord.js");
const { convertTime } = require("../utils/convertTime.js");

module.exports = async(client) =>{
    manager.on('trackStart', async(player, track) =>{
        const channel = client.channels.cache.get(player.textChannel);
        const voice = client.channels.cache.get(player.voiceChannel); 

        let musicChannelID = await db.get(`music_${client.user.id}_${player.guild}_channel`);
        if(player.textChannel == musicChannelID){
            let trackEmbedID = await db.get(`music_${client.user.id}_${player.guild}_track_message`);
            let queueMessageID = await db.get(`music_${client.user.id}_${player.guild}_queue_message`);

            //get data
            let musicChannel = await client.channels.cache.get(musicChannelID);
            let trackEmbed = await musicChannel.messages.cache.get(trackEmbedID);
            let queueMessage = await musicChannel.messages.fetch(queueMessageID);

            await trackEmbed.edit({embeds: [(await track_msg_Embed(client, player))]});
            await queueMessage.edit(queue_msg(client, player));
        }
        else {
            const embed = new MessageEmbed()
                .setColor(setting.music.embed.color)
                .setThumbnail(track.thumbnail)
                .addFields(
                    [
                        {
                            name: `${emoji.playing} | กำลังเล่นเพลง`,
                            value: `[${track.title}](${track.uri})`, 
                            inline: false,
                        },
                        {
                            name: `${emoji.room} | ในห้อง`,
                            value: `<#${voice.id}>`, 
                            inline: true,
                        },
                        {
                            name: `${emoji.time} | ความยาว`,
                            value: `\`${await convertTime(track.duration)}\``, 
                            inline: true,
                        },
                        {
                            name: `${emoji.inbox} | ขอเพลงโดย`,
                            value: `<@${track.requester}>`, 
                            inline: true,
                        },
                    ],
                )
                .setFooter({text: setting.music.embed.footer})
                .setTimestamp()
		    channel.send({embeds: [embed]});
        }
    });
    manager.on('queueEnd', async(player) =>{
        const channel = client.channels.cache.get(player.textChannel);
        const musicChannelID = await db.get(`music_${client.user.id}_${player.guild}_channel`);
        
        
        const msg = await channel.send('❗ | คิวหมดเเล้วน่ะ');
        if(player.textChannel == musicChannelID){
            setTimeout(() => {
                msg.delete();
            }, 5000);
        }
        player.destroy();
    });
    manager.on('playerDestroy', async(player) =>{
        const channel = client.channels.cache.get(player.textChannel);
        const musicChannelID = await db.get(`music_${client.user.id}_${player.guild}_channel`);
    
        if(player.textChannel == musicChannelID){
            //import data
            let trackEmbedID = await db.get(`music_${client.user.id}_${player.guild}_track_message`);
            let queueMessageID = await db.get(`music_${client.user.id}_${player.guild}_queue_message`);
            //get data
            let musicChannel = client.channels.cache.get(musicChannelID);
            let trackEmbed = await musicChannel.messages.cache.get(trackEmbedID);
            let queueMessage = await musicChannel.messages.fetch(queueMessageID);

    
            await queueMessage.edit('**คิวเพลง:**\nเข้าช่องเสียง และพิมพ์ชื่อเพลงหรือลิงก์ของเพลง เพื่อเปิดเพลงน่ะ');
            await trackEmbed.edit({embeds: [await default_track_embed(client, player)]});	
        }
    });
};