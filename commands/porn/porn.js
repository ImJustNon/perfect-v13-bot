const { MessageEmbed } = require("discord.js");
const { Command } = require("../../utils/command/command");
const setting = require("../../settings/config.js");
const emoji = require("../../settings/config.js").emoji;
const econfig = require("../../settings/embed.js");
const { RandomPHUB } = require('discord-phub');
const pornhub = new RandomPHUB(unique = true);

module.exports = new Command({
    name: "porn",
    description: `select pornhub media`,
    userPermissions: ['SEND_MESSAGES'],
    botPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: "porn",
    cooldown: 10,
    options: [
        {
            name: "หมวดหมู่",
            description: `เลือกหมวดหมู่สิ่งที่ต้องการจะส่ง`,
            type: "STRING",
            required: true,
        },
        {
            name: "นามสกุลไฟล์",
            description: `เลือกนามสกุลไฟล์ เช่น (jpeg / jpg / png / gif / mp4)`,
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "JPEG",
                    value: 'jpeg',
                },
                {
                    name: "JPG",
                    value: 'jpg',
                },
                {
                    name: "PNG",
                    value: 'png',
                },
                {
                    name: "GIF",
                    value: 'gif',
                },
                {
                    name: "MP4",
                    value: 'mp4',
                },
            ],
        },
    ],
    run: async ({ client, interaction, args, prefix }) => {
        const channel = client.channels.cache.get(interaction.channelId)
        if(!channel.nsfw) return interaction.followUp({
            content: '⚠ | คุณสามารถใช้คำสั่งนี้ได้เฉพาะในช่อง NSFW เท่านั้นน่ะคะ',
        }).then((msg) =>{
            setTimeout(() => msg.delete(), 5000);
        });

        let category = interaction.options.getString("ประเภท");
        let format = interaction.options.getString("นามสกุลไฟล์");

        try{
            const res = pornhub.getRandomInCategory(category , format);
            await interaction.followUp({
                content: res.url,
            });
        }
        catch(err){
            await interaction.followUp({
                content: '⚠ | โปรดตรวจสอบข้อมูลให้ถูกต้อง เเล้วลองใหม่น่ะคะ',
            });
        }
    },
});