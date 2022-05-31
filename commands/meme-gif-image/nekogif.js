const { MessageEmbed } = require("discord.js");
const { Command } = require("../../utils/command/command");
const setting = require("../../settings/config.js");
const emoji = require("../../settings/config.js").emoji;
const econfig = require("../../settings/embed.js");
const nekolife = require('nekos.life');
const neko = new nekolife();

module.exports = new Command({
    name: "nekogif",
    description: "send cute neko image",
    userPermissions: ['SEND_MESSAGES'],
    botPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: "meme-gif-image",
    cooldown: 10,
    run: async ({ client, interaction, args, prefix }) =>{
        const image = await neko.sfw.nekoGif();
        const embed = new MessageEmbed()
            .setColor(econfig.color.radom)
            .setImage(image.url)
            .setFooter({
                text: client.user.username,
            })
            .setTimestamp();
        await interaction.followUp({
            embeds: [embed],
        });
    },
});