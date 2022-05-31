const Discord = require('discord.js');
const setting = require('../settings/config.js');
const chalk = require('chalk');

module.exports = async (client) =>{
    const errChannel = setting.config.errorlogChannel;

    process.on('unhandledRejection', async(reason, p) =>{
        console.log(chalk.red.bold("[Anti-crash] ") + chalk.white.bold("Unhandled Rejection/Catch"));
        console.log(reason, p);

        const errEmbed = new Discord.MessageEmbed()
            .setColor('#fe0000')
            .setAuthor({
                name: `${client.user.tag} Error Logging`,
                iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(`An error just occurred in the bot console!**\n\nERROR:\n\n** \`\`\`${reason}\n\n${p}\`\`\``)
            .setTimestamp()
            .setFooter({
                text: client.user.username,
            })

        const CHANNEL = client.channels.cache.get(errChannel);
        await CHANNEL.send({embeds: [errEmbed]});
    });

    process.on('uncaughtException', async(err, origin) =>{
        console.log(chalk.red.bold("[Anti-crash] ") + chalk.white.bold("Uncaught Exception/Catch"));
        console.log(err, origin);

        const errEmbed = new Discord.MessageEmbed()
            .setColor('#fe0000')
            .setAuthor({
                name: `${client.user.tag} Error Logging`,
                iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(`An error just occurred in the bot console!**\n\nERROR:\n\n** \`\`\`${err}\n\n${origin}\`\`\``)
            .setTimestamp()
            .setFooter({
                text: client.user.username,
            })

        const CHANNEL = client.channels.cache.get(errChannel);
        await CHANNEL.send({embeds: [errEmbed]});
    });

    process.on('uncaughtExceptionMonitor', async(err, origin) =>{
        console.log(chalk.red.bold("[Anti-crash] ") + chalk.white.bold("Uncaught Exception/Catch (MONITOR)"));
        console.log(err, origin);

        const errEmbed = new Discord.MessageEmbed()
            .setColor('#fe0000')
            .setAuthor({
                name: `${client.user.tag} Error Logging`,
                iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(`An error just occurred in the bot console!**\n\nERROR:\n\n** \`\`\`${err}\n\n${origin}\`\`\``)
            .setTimestamp()
            .setFooter({
                text: client.user.username,
            })

        const CHANNEL = client.channels.cache.get(errChannel);
        await CHANNEL.send({embeds: [errEmbed]});    
    });
}