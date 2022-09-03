const { MessageEmbed } = require("discord.js");
const { Command } = require("../../utils/command/command");
const setting = require("../../settings/config.js");
const emoji = require("../../settings/config.js").emoji;
const econfig = require("../../settings/embed.js");
const manager = require("../../music/manager.js");
const { convertTime } = require("../../music/utils/convertTime.js");

module.exports = new Command({
    name: "queue",
    description: `รายการคิวเพลง`,
    userPermissions: ['SEND_MESSAGES', 'READ_MESSAGES', 'CONNECT'],
    botPermissions: ['SEND_MESSAGES', 'READ_MESSAGES', 'CONNECT', 'ATTACH_FILES'],
    category: "music",
    cooldown: 10,
    run: async ({ client, interaction, args, prefix }) =>{
        const guild = client.guilds.cache.get(interaction.guildId)
        const member = guild.members.cache.get(interaction.member.user.id);
        const channel = member.voice.channel;

        const me = guild.members.cache.get(client.user.id);

        let player = manager.players.get(interaction.guildId);

        if(!channel) return interaction.followUp('⚠ | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
        else if(me.voice.channel && !channel.equals(me.voice.channel)) return interaction.followUp('⚠ | ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
        else if(!player || !player.queue.current) return interaction.followUp('⚠ | ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ');
        else if(!player.queue.size || player.queue.size === 0 || !player.queue || player.queue.length === 0) return interaction.followUp('⚠ | คุณยังไม่มีคิวการเล่นน่ะ');
        else{
            let queueMsg = "";
            let qlnwza;
            let member;
            for(let i = 0; i < player.queue.length; i++){
                member = guild.members.cache.get(player.queue[i].requester)
                queueMsg += `\`${i + 1})\` [${await convertTime(player.queue[i].duration)}] - ${player.queue[i].title}\n╰  **เพิ่มโดย** : \`${member.user.username}\`\n`;
                if(queueMsg.length > 4096) break;
                qlnwza = queueMsg;
            }

            const qEmbed = new MessageEmbed()
                .setColor(setting.music.embed.color)
                .setTitle(`รายการคิวเพลงทั้งหมด`)
                .setDescription(await qlnwza)
                .setFooter({text: setting.music.embed.footer})
                .setTimestamp()
            interaction.followUp({embeds: [qEmbed]}); 
        }
    },
});