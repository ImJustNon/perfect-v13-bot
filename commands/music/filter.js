const { MessageEmbed } = require("discord.js");
const { Command } = require("../../utils/command/command");
const setting = require("../../settings/config.js");
const emoji = require("../../settings/config.js").emoji;
const econfig = require("../../settings/embed.js");
const manager = require("../../music/manager.js");

module.exports = new Command({
    name: "filter",
    description: `ฟิลเตอร์เพลง`,
    userPermissions: ['SEND_MESSAGES', 'READ_MESSAGES', 'CONNECT'],
    botPermissions: ['SEND_MESSAGES', 'READ_MESSAGES', 'CONNECT', 'ATTACH_FILES'],
    category: "music",
    cooldown: 10,
    options: [
        {
            name: "เลือกฟิลเตอร์",
            description: `ตัวเลือกสำหรับปรับฟิลเตอร์เพลง`,
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "Reset",
                    value: "reset",
                },
                {
                    name: "NightCore",
                    value: "nightcore",
                },
                {
                    name: "BassBoost",
                    value: "bassboost",
                },
                {
                    name: "Vaporwave",
                    value: "vaporwave",
                },
                {
                    name: "Pop",
                    value: "pop",
                },
                {
                    name: "Soft",
                    value: "soft",
                },
                {
                    name: "Treblebass",
                    value: "treblebass",
                },
                {
                    name: "Eight Dimension",
                    value: "eightdimension",
                },
                {
                    name: "Karaoke",
                    value: "karaoke",
                },
                {
                    name: "Vibrato",
                    value: "vibrato",
                },
                {
                    name: "Tremolo",
                    value: "tremolo",
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
            const filters = interaction.options.getString('เลือกฟิลเตอร์');
            let filter
            if(filters === 'reset'){
                player.reset();
                interaction.followUp(`:white_check_mark: | ทำการรีเซ็ตฟิลเตอร์เรียบร้อยเเล้ว`);
                return;
            }
            else if(filters === 'nightcore'){
                player.nightcore = true;
                filter = 'NightCore';
            }
            else if(filters === 'bassboost'){
                player.bassboost = true;
                filter = 'BassBoost';
            }
            else if(filters === 'vaporwave'){
                player.bassboost = true;
                filter = 'Vaporwave';
            }
            else if(filters === 'pop'){
                player.bassboost = true;
                filter = 'Pop';
            }
            else if(filters === 'soft'){
                player.bassboost = true;
                filter = 'Soft';
            }
            else if(filters === 'treblebass'){
                player.bassboost = true;
                filter = 'Treblebass';
            }
            else if(filters === 'eightdimension'){
                player.bassboost = true;
                filter = 'Eight Dimension';
            }
            else if(filters === 'karaoke'){
                player.bassboost = true;
                filter = 'Karaoke';
            }
            else if(filters === 'vibrato'){
                player.bassboost = true;
                filter = 'Vibrato';
            }
            else if(filters === 'tremolo'){
                player.bassboost = true;
                filter = 'Tremolo';
            }
            else{
                return interaction.followUp('⚠ | อืมม...ดูเหมือนว่าจะไม่มีฟิลเตอร์นี้น่ะ');
            }
            
            interaction.followUp(`:white_check_mark: | ทำการเพิ่มฟิลเตอร์ ${filter} เรียบร้อยเเล้ว`);
        }
    },
});