const { MessageEmbed } = require("discord.js");
const { Command } = require("../../utils/command/command");
const setting = require("../../settings/config.js");
const emoji = require("../../settings/config.js").emoji;
const econfig = require("../../settings/embed.js");
const manager = require("../../music/manager.js");
const { convertTime } = require("../../music/utils/convertTime.js");

module.exports = new Command({
    name: "loop",
    description: `วนเพลงซ้ำ`,
    userPermissions: ['SEND_MESSAGES', 'READ_MESSAGES', 'CONNECT'],
    botPermissions: ['SEND_MESSAGES', 'READ_MESSAGES', 'CONNECT', 'ATTACH_FILES'],
    category: "music",
    cooldown: 10,
    options: [
        {
            name: "ตัวเลือกการวนซ้ำ",
            description: `เลือกการเล่นวนเพลง หรือ ปิดการใช้งาน`,
            type: "STRING",
            required: true,
            choices: [
              {
                name: "เพลงเดียว",
                value: 'track',
              },
              {
                name: "ทั้งหมด",
                value: 'queue',
              },
              {
                name: "ปิดการใช้งาน",
                value: 'disable',
              },
            ],
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
            const loop_type = interaction.options.getString('ตัวเลือกการวนซ้ำ');
            if(loop_type === 'track'){
                if(player.trackRepeat){
                    return interaction.followUp(`⚠ | ทำการเปิดการวนซ้ำเเบบ \`เพลงเดียว\` อยู่น่ะ`);
                }
                if(player.queueRepeat){
                    player.setQueueRepeat(false);
                }
                player.setTrackRepeat(true); 
                interaction.followUp(`:white_check_mark: ทำการเปิดการวนซ้ำเเบบ \`เพลงเดียว\` เรียบร้อยเเล้ว`);
            }
            else if(loop_type === 'queue'){
                if(player.queueRepeat){
                    return interaction.followUp(`⚠ | ทำการเปิดการวนซ้ำเเบบ \`ทั้งหมด\` อยู่นะ`);
                }
                if(player.trackRepeat){
                    player.setTrackRepeat(false);
                }
                player.setQueueRepeat(true);
                interaction.followUp(`:white_check_mark: ทำการเปิดการวนซ้ำเเบบ \`ทั้งหมด\` เรียบร้อยเเล้ว`);
            }
            else if(loop_type === 'disable'){
                if(!player.queueRepeat && !player.trackRepeat){
                    return interaction.followUp('⚠ | ยังไม่มีการเปิดใช้งานการวนซ้ำเลยน่ะ');
                }
                if(player.queueRepeat){
                    player.setQueueRepeat(false);
                }
                if(player.trackRepeat){
                    player.setTrackRepeat(false);
                }
                interaction.followUp(`:white_check_mark: ทำการ \`ปิด\` การใช้งานวนซ้ำ เรียบร้อยเเล้ว`);
            }
        }
    },
});