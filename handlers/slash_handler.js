const { Client, MessageEmbed } = require("discord.js");
const fs = require("fs");
const ee = require(`../settings/config`).embed
const chalk = require("chalk");

/**
 *
 * @param {Client} client
 */

module.exports = async (client) => {
  try {
    client.arrayOfcommands = [];
    fs.readdirSync("./commands").forEach((cmd) => {
      let commands = fs.readdirSync(`./commands/${cmd}/`).filter((file) => file.endsWith(".js"));

      for (let cmds of commands) {
        let pull = require(`../commands/${cmd}/${cmds}`);
        if (pull.options) {
          pull.options.filter((g) => g.type === "SUB_COMMAND").forEach((sub) => {
            client.subcmd.set(sub.name, sub);
          });
        }
        if (pull.name) {
          client.commands.set(pull.name, pull);
          client.arrayOfcommands.push(pull);
        } else {
          console.log(chalk.redBright.bold('[Slash-Commands-Handler] ') + chalk.whiteBright.bold("Can't load command : ") + chalk.redBright.bold(cmds));
          continue;
        }
        console.log(chalk.hex('#ff7926').bold(`[Slash-Commands-Handler] `) + chalk.whiteBright.bold(`Loading command : `) + chalk.hex('#ff7926').bold(cmds));
      }
    });
    client.on("ready", async () => {
      try {
        await client.guilds.fetch().catch((e) => {});
        await client.guilds.cache.forEach(async (guild) => {
          await guild.commands.set(client.arrayOfcommands).catch((e) => {
            console.log(e);
          });
        });
      } catch (e) {
        console.log(e);
      }
    });
    console.log(chalk.hex('#ff7926').bold(`[Slash-Commands-Handler] `) + chalk.whiteBright.bold(`Total loaded : `) + chalk.hex('#ff7926').bold(client.commands.size));
  } catch (e) {
    console.log(e);
  }
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {String} data
   */
  client.embed = (interaction, data) => {
    return interaction.followUp({
      embeds: [
        new MessageEmbed()
          .setColor(ee.color)
          .setDescription(data.substr(0, 2000))
          .setFooter({
            text: ee.footertext,
            iconURL: ee.footericon,
          }),
      ],
    });
  };
};
