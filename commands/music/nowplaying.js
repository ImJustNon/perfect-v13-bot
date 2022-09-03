const { MessageEmbed } = require("discord.js");
const { Command } = require("../../utils/command/command");
const setting = require("../../settings/config.js");
const emoji = require("../../settings/config.js").emoji;
const econfig = require("../../settings/embed.js");
const manager = require("../../music/manager.js");
const ytdl = require('ytdl-core');
const { convertTime } = require("../../music/utils/convertTime.js");
const { progressbar } = require("../../music/utils/progressbar.js");

module.exports = new Command({
    name: "nowplaying",
    description: `เเสดงข้อมูลของเพลงที่กำลังเล่นอยู่ ณ ตอนนี้`,
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
        else{
            let Repeat = '❌';
            if(player.queueRepeat || player.trackRepeat){
                Repeat = '✅';
            }
            let Np_embed = new MessageEmbed()
                .setColor(setting.music.embed.color)
                .setThumbnail(player.queue.current.thumbnail)
                .addFields([
                    {
                        name: `🎶 | กำลังเล่นเพลง`,
                        value: `> [${player.queue.current.title}](${player.queue.current.uri})`,
                        inline: false,
                    },
                    {
                        name: `🎧 | ช่องฟังเพลง`,
                        value: `> <#${player.voiceChannel}>`,
                        inline: true,
                    },
                    {
                        name: `📢 | ขอเพลงโดย`,
                        value: `> <@${player.queue.current.requester}>`,
                        inline: true,
                    },
                    {
                        name: `⏱️ | ความยาว`,
                        value: `> \`${await convertTime(player.queue.current.duration)}\``,
                        inline: true,
                    },
                    {
                        name: `🎙 | ศิลปิน`,
                        value: `> \`${player.queue.current.author}\``,
                        inline: true,
                    },
                    {
                        name: `🌀 | คิว`,
                        value: `> \`${player.queue.length}\``,
                        inline: true,
                    },
                    {
                        name: `🔁 | เปิดใช้วนซ้ำ`,
                        value: `> ${Repeat}`,
                        inline: true,
                    },
                    {
                        name: `🔊 | ระดับเสียง`,
                        value: `> \`${player.volume} %\``,
                        inline: true,
                    },
                ])
            .setFooter({text: setting.music.embed.footer})
            .setTimestamp()

            
            if(player.queue.current.uri.includes("youtube.com")){
                const info = await ytdl.getInfo(player.queue.current.identifier);
                const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
                Np_embed.addField(`📥 | ดาวน์โหลดเพลง`, `> [\`คลิ๊กลิ้งนี้เพื่อโหลดเพลง\`](${format.url})`, true);
            }
            Np_embed.addField(`᲼`, `\`${await convertTime(player.position)}\` ${(await progressbar(player.position, player.queue.current.duration, 18)).Bar} \`${await convertTime(player.queue.current.duration)}\``, false);
            
            await interaction.followUp({embeds: [ Np_embed ]});
        }
    },
});