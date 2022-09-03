const { MessageEmbed } = require("discord.js");
const { Command } = require("../../utils/command/command");
const setting = require("../../settings/config.js");
const emoji = require("../../settings/config.js").emoji;
const econfig = require("../../settings/embed.js");

module.exports = new Command({
    name: "help",
    description: `ewrt`,
    userPermissions: ["SEND_MESSAGES"],
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS"],
    category: "info",
    cooldown: 10,
    options: [
        {
            name: "หมวดหมู่",
            description: `[เลือกหมวดหมู่คำสั่งที่ต้องการ]`,
            type: "STRING",
            required: false,
        },
    ],
    run: async ({ client, interaction, args, prefix }) => {
        console.log("asda")
    },
});