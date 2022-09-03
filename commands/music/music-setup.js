const { MessageEmbed } = require("discord.js");
const { Command } = require("../../utils/command/command");
const setting = require("../../settings/config.js");
const emoji = require("../../settings/config.js").emoji;
const econfig = require("../../settings/embed.js");
const manager = require("../../music/manager.js");
const db = require("../../database/quick_mongo.js");
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = new Command({
    name: "music-setup",
    description: `สร้างห้องสำหรับเปิดเพลงเเบบไม่ใช้ Prefix`,
    userPermissions: ['ADMINISTRATOR'],
    botPermissions: ['MANAGE_MESSAGES', 'READ_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES', 'MANAGE_CHANNELS', 'MANAGE_GUILD'],
    category: "music",
    cooldown: 10,
    run: async ({ client, interaction, args, prefix }) =>{
        const guild = client.guilds.cache.get(interaction.guildId)

        const getChannel = await db.get(`music_${client.user.id}_${interaction.guildId}_channel`);
	    const channel = guild.channels.cache.get(getChannel);
        if(channel) return interaction.followUp('⚠ | คุณได้ทำการตั้งค่าช่องสำหรับขอเพลงเอาไว้เรียบร้อยเเล้วน่ะ');

        try{
            await guild.channels.create(`${client.user.username}-Music`,{
                type: 'GUILD_TEXT',
            }).then(async(channel) =>{
                await db.set(`music_${client.user.id}_${interaction.guildId}_channel`,channel.id);
                const trackEmbed = new MessageEmbed()
                    .setColor(setting.music.embed.color)
                    .setTitle('ยังไม่มีเพลงเล่นอยู่ ณ ตอนนี้')
                    .setImage(setting.music.embed.defaultimage)
                    .setFooter({text: setting.music.embed.footer})
                    .setTimestamp()
                let bpause = new MessageButton()
                    .setCustomId(`pause`)
                    .setStyle(`SUCCESS`)
                    .setEmoji(`⏯`)
                let bskip = new MessageButton()
                    .setCustomId(`skip`)
                    .setStyle(`SECONDARY`)
                    .setEmoji(`⏭`)
                let bstop = new MessageButton()
                    .setCustomId(`stop`)
                    .setStyle(`DANGER`)
                    .setEmoji(`⏹`)
                let bloop = new MessageButton()
                    .setCustomId(`loop`)
                    .setStyle(`SECONDARY`)
                    .setEmoji(`🔁`)
                let bshuffle = new MessageButton()
                    .setCustomId(`shuffle`)
                    .setStyle(`SUCCESS`)
                    .setEmoji(`🔀`)
                let bvolumeup = new MessageButton()
                    .setCustomId(`volup`)
                    .setLabel(`เพิ่มเสียง`)
                    .setStyle(`PRIMARY`)
                    .setEmoji(`🔊`)
                let bvolumedown = new MessageButton()
                    .setCustomId(`voldown`)
                    .setLabel(`ลดเสียง`)
                    .setStyle(`PRIMARY`)
                    .setEmoji(`🔉`)
                let bmute = new MessageButton()
                    .setCustomId(`mute`)
                    .setLabel(`ปิด/เปิดเสียง`)
                    .setStyle(`PRIMARY`)
                    .setEmoji(`🔈`)
                let row = new MessageActionRow()
                    .addComponents(bpause,bskip,bstop,bloop,bshuffle)
                let row2 = new MessageActionRow()
                    .addComponents(bvolumedown,bvolumeup,bmute)

                await channel.send(setting.music.embed.banner);
                await channel.send('**คิวเพลง:**\nเข้าช่องเสียง และพิมพ์ชื่อเพลงหรือลิงก์ของเพลง เพื่อเปิดเพลงน่ะ').then(async(msg) => {
                    await db.set(`music_${client.user.id}_${interaction.guildId}_queue_message`, msg.id);
                });
                await channel.send({ embeds: [trackEmbed], components: [row, row2] }).then(async(msg) =>{
                    await db.set(`music_${client.user.id}_${interaction.guildId}_track_message`, msg.id);
                });
                await channel.setTopic(`
⏯ | หยุดเพลง หรือ เล่นเพลงต่อ
⏭ | ข้ามเพลง
⏹ | ปิดเพลง
🔁 | เปิด/ปิด การใช้งานวนซ้ำ
🔀 | สลับคิวเพลง
🔉 | ลดเสียง
🔊 | เพิ่มเสียง
🔈 | ปิด/เปิดเสียง
`);
                await interaction.followUp(':white_check_mark: | ทำการตั้งค่าระบบเพลงเรียบร้อยเเล้ว');
            });
        }
        catch(error){
            console.log(error);
        }
    },
});