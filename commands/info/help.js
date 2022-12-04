const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton, Interaction } = require('discord.js');
const { MessageMenuOption, MessageMenu } = require("discord.js");
const { Command } = require("../../utils/command/command");
const setting = require("../../settings/config.js");
const emoji = require("../../settings/config.js").emoji;
const econfig = require("../../settings/embed.js");
const db = require("../../database/quick_mongo.js");

const slash_Command = "/";

module.exports = new Command({
    name: "help",
    description: `คำสั่งบอททั้งหมด`,
    userPermissions: ["SEND_MESSAGES"],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS"],
    category: "info",
    cooldown: 10,
    options: [
        {
            name: "ประเภทคำสั่ง",
            description: `[เลือกประเภทคำสั่งที่ต้องการ]`,
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "📗 | Info",
                    value: "information",
                },
                {
                    name: "🎶 | Music",
                    value: "music",
                },
                {
                    name: "🎶 | Music-Filters",
                    value: "music-filters",
                },
                {
                    name: "🎭 | Meme & Gif",
                    value: "meme&gif",
                },
                {
                    name: "⛔ | NSFW",
                    value: "nsfw",
                },
                {
                    name: "⚙ | Setting & Setup",
                    value: "setting&setup",
                },
            ],
        },
    ],
    run: async ({ client, interaction, args, prefix }) => {
        const command_category = interaction.options.getString("ประเภทคำสั่ง");
        const custom_Prefix = await db.get(`prefix_${client.user.id}_${interaction.guildId}`);


        const info_Command = new MessageEmbed()
            .setColor(setting.embed.color)
            .setFooter({
                text: setting.embed.footertext,
            })
            .setTimestamp()
        
        const music_Command = new MessageEmbed()
            .setColor(setting.embed.color)
            .setTitle('คำสั่งเกี่ยวกับเพลง')
            .addField(`${setting.emoji.music}  |  **\` ${slash_Command}clearqueue \`**`,`ล้างคิว`, true)
            .addField(`${setting.emoji.music}  |  **\` ${slash_Command}connect \`**`,`เชื่อมต่อช่องเสียง`, true)
            .addField(`${setting.emoji.music}  |  **\` ${slash_Command}loop \`**`,`วนซ้ำ`, true)
            .addField(`${setting.emoji.music}  |  **\` ${slash_Command}music-setup \`**`,`ตั้งค่าช่องเปิดเพลง`, true)
            .addField(`${setting.emoji.music}  |  **\` ${slash_Command}music-remove \`**`,`ลบตั้งค่าช่องเปิดเพลง`, true)
            .addField(`${setting.emoji.music}  |  **\` ${slash_Command}nowplaying \`**`,`เพลงที่เล่นอยู่`, true)
            .addField(`${setting.emoji.music}  |  **\` ${slash_Command}pause \`**`,`หยุดชั่วคราว`, true)
            .addField(`${setting.emoji.music}  |  **\` ${slash_Command}resume \`**`,`ดำเนิดเพลงต่อ`, true)
            .addField(`${setting.emoji.music}  |  **\` ${slash_Command}play \`**`,`เล่น`, true)
            .addField(`${setting.emoji.music}  |  **\` ${slash_Command}queue \`**`,`เเสดงรายการคิว`, true)
            .addField(`${setting.emoji.music}  |  **\` ${slash_Command}shuffle \`**`,`สลับ`, true)
            .addField(`${setting.emoji.music}  |  **\` ${slash_Command}skip \`**`,`ข้ามเพลงปัจจุบัน`, true)
            .addField(`${setting.emoji.music}  |  **\` ${slash_Command}stop \`**`,`หยุด`, true)
            .addField(`${setting.emoji.music}  |  **\` ${slash_Command}volume \`**`,`ความดังเสียง`, true)
            .addField(`${setting.emoji.music}  |  **\` ${slash_Command}radio \`**`,`เปิดเพลงวิทยุ`, true)
            .setFooter({
                text: setting.embed.footertext,
            })
            .setTimestamp()
        
        const filters_Command = new MessageEmbed()
            .setColor(setting.embed.color)
            .addField(`${setting.emoji.music_filter}  |  **\` ${slash_Command}filter \`**`, `เปิด / ปิดฟิลเตอร์เพลง`, false)
            .addField(`${setting.emoji.music_filter} ฟิลเตอร์ทั้งหมด`,`\` Nightcore / Vaporwave / BassBoost / Pop / Soft / Treblebass /\n Eight Dimension / Karaoke / Vibrato / Tremolo \``, false)
            .addField(`${setting.emoji.reset} รีเซ็ตฟิลเตอร์`,`**\` ${slash_Command}filter Reset \`**`, false)
            .setFooter({
                text: setting.embed.footertext,
            })
            .setTimestamp()

        const meme_gif_Command = new MessageEmbed()
            .setColor(setting.embed.color)
            .setFooter({
                text: setting.embed.footertext,
            })
            .setTimestamp()

        const nsfw_Command = new MessageEmbed()
            .setColor(setting.embed.color)
            .setFooter({
                text: setting.embed.footertext,
            })
            .setTimestamp()

        const setting_setup_Command = new MessageEmbed()
            .setColor(setting.embed.color)
            .addField(`${setting.emoji.setting}  |  **\` ${slash_Command}config-prefix \`**`,`ตั้งค่า Prefix บอท`, true)
            .setFooter({
                text: setting.embed.footertext,
            })
            .setTimestamp()


        if(command_category === "information"){
            await interaction.followUp({
                embeds: [info_Command],
            });
        }
        else if(command_category === "music"){
            await interaction.followUp({
                embeds: [music_Command],
            });
        }
        else if(command_category === "music-filters"){
            await interaction.followUp({
                embeds: [filters_Command],
            });
        }
        else if(command_category === "meme&gif"){
            await interaction.followUp({
                embeds: [meme_gif_Command],
            });
        }
        else if(command_category === "nsfw"){
            await interaction.followUp({
                embeds: [nsfw_Command],
            });
        }
        else if(command_category === "setting&setup"){
            await interaction.followUp({
                embeds: [setting_setup_Command],
            });
        }
    },
});