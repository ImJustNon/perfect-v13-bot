const { MessageEmbed } = require("discord.js");
const { Command } = require("../../utils/command/command");
const setting = require("../../settings/config.js");
const emoji = require("../../settings/config.js").emoji;
const econfig = require("../../settings/embed.js");
const manager = require("../../music/manager.js");

module.exports = new Command({
    name: "volume",
    description: `ปรับระดับความดังของเสียง`,
    userPermissions: ['SEND_MESSAGES', 'READ_MESSAGES', 'CONNECT'],
    botPermissions: ['SEND_MESSAGES', 'READ_MESSAGES', 'CONNECT', 'ATTACH_FILES'],
    category: "music",
    cooldown: 10,
    options: [
        {
            name: "ระดับเสียง",
            description: `สามารถปรับระดับความดังของเสียงได้ตั้งเเต่ 0 - 100 %`,
            type: "STRING",
            required: true,
        },
    ],
    run: async ({ client, interaction, args, prefix }) =>{
        const guild = client.guilds.cache.get(interaction.guildId)
        const member = guild.members.cache.get(interaction.member.user.id);
        const channel = member.voice.channel;

        const me = guild.members.cache.get(client.user.id);

        let player = manager.players.get(interaction.guildId);

        if(!channel) return interaction.followUp('⚠ | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
        else if(me.voice.channel && !channel.equals(me.voice.channel)) return interaction.followUp('⚠ | ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
        else if(!player || !player.queue.current) return interaction.followUp('⚠ | ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ');
        else{
            let new_volume = interaction.options.getString("ระดับเสียง");
            if(isNaN(new_volume)) return interaction.followUp(`⚠ | โปรดระบุระดับความดังเป็นตัวเลขเท่านั้นน่ะ`);
            if(parseInt(new_volume) > 100) return interaction.followUp(`⚠ | ไม่สามารถเพิ่มเสียงมากกว่า \`100\` ได้น่ะ`);
            else if(parseInt(new_volume) < 0) return interaction.followUp('⚠ | ไม่สามารถลดเสียงน้อยกว่า \`0\` ได้น่ะ');
            else{
                player.setVolume(parseInt(new_volume));
                interaction.followUp(`:white_check_mark: ทำการตั้งค่าความดังเสียงเป็น \`${new_volume}\` เรียบร้อยเเล้ว`);
            }
        }
    },
});