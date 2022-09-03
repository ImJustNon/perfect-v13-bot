const { MessageEmbed } = require("discord.js");
const { Command } = require("../../utils/command/command");
const setting = require("../../settings/config.js");
const emoji = require("../../settings/config.js").emoji;
const econfig = require("../../settings/embed.js");
const manager = require("../../music/manager.js");

module.exports = new Command({
    name: "connect",
    description: `เข้าช่องเสียง`,
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
        else if(player || player.state == "CONNECTED") return interaction.followUp('⚠ | ตอนนี้กำลังเชื่อมต่ออยู่น่ะ');
        else{
            player = manager.create({
                guild: interaction.guildId,
                voiceChannel: member.voice.channel.id,
                textChannel: interaction.channelId,
                selfDeafen: false,
                selfMute: false,
                volume: 80,
            });
            player.connect();
            message.channel.send(`:white_check_mark: เข้าช่อง ${channel.name} มาเเล้วน่ะ`);
        }
    },
});