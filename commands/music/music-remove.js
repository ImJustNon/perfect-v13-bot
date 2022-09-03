const { MessageEmbed } = require("discord.js");
const { Command } = require("../../utils/command/command");
const setting = require("../../settings/config.js");
const emoji = require("../../settings/config.js").emoji;
const econfig = require("../../settings/embed.js");
const manager = require("../../music/manager.js");
const db = require("../../database/quick_mongo.js");
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = new Command({
    name: "music-remove",
    description: `ลบข้อมูลห้องเปิดเพลง ออกจากฐานข้อมูล`,
    userPermissions: ['ADMINISTRATOR'],
    botPermissions: ['MANAGE_MESSAGES', 'READ_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES', 'MANAGE_CHANNELS', 'MANAGE_GUILD'],
    category: "music",
    cooldown: 10,
    run: async ({ client, interaction, args, prefix }) =>{
        const guild = client.guilds.cache.get(interaction.guildId)
        const getChannel = await db.get(`music_${client.user.id}_${interaction.guildId}_channel`);
	    const channel = guild.channels.cache.get(getChannel);
        
        if(getChannel === null) return interaction.followUp('⚠️ เอ๊ะ! ดูเหมือนว่าคุณจะยังไม่มีการตั้งค่าระบบห้องเพลงเลยน่ะคะ');
        
        const embed = new MessageEmbed()
            .setColor(setting.music.embed.color)
            .setTitle(`หากต้องการจะลบระบบห้องเพลงให้กด \`ยืนยัน\` \nหากต้องการยกเลิกให้กด \`ยกเลิก\``)
            .setFooter({text: setting.music.embed.footer})
            .setTimestamp()

        let yes = new MessageButton()
            .setLabel(`ยืนยัน [Accept]`)
            .setCustomId(`yes`)
            .setStyle(`SUCCESS`)
            .setEmoji(`✅`)
        let no = new MessageButton()
            .setLabel(`ยกเลิก [Cancel]`)
            .setCustomId(`no`)
            .setStyle(`DANGER`)
            .setEmoji(`❌`)
        let row = new MessageActionRow()
            .addComponents(yes,no)

        await interaction.followUp({ embeds: [embed], components: [row] });
        const filter = i => i.user.id === interaction.member.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async i => {
            if (i.customId === 'yes'){
                remove_Music(i);
            }
            else if(i.customId === 'no'){
                await i.update({ content: ':white_check_mark: ทำการยกเลิกรายการเรียบร้อยค่ะ', embeds: [], components: [] });
            }
        });

        async function remove_Music(i){
            try{
                await db.delete(`music_${client.user.id}_${interaction.guildId}_channel`);
                await db.delete(`music_${client.user.id}_${interaction.guildId}_track_message`);
                await db.delete(`music_${client.user.id}_${interaction.guildId}_queue_message`);
                await i.update({ content: ':white_check_mark: ทำการลบการตั้งค่าห้องระบบเพลงเรียบร้อยเเล้วค่ะ', embeds: [], components: [] });
            }
            catch(err){
                console.log(err);
            }
        }
    },
});