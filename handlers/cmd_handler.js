const { Client } = require("discord.js");
const fs = require("fs");
const chalk = require("chalk");

/**
 *
 * @param {Client} client
 */

module.exports = (client) => {
  try {
    fs.readdirSync("./msgcommands").forEach((cmd) => {
      let commands = fs.readdirSync(`./msgcommands/${cmd}/`).filter((file) => file.endsWith(".js"));

      for (let cmds of commands) {
        let pull = require(`../msgcommands/${cmd}/${cmds}`);
        if (pull.name) {
          client.mcommands.set(pull.name, pull);
        } else {
          console.log(chalk.redBright.bold('[Message-Commands] ') + chalk.whiteBright.bold("Can't load command : ") + chalk.redBright.bold(cmds));
          continue;
        }
        console.log(chalk.hex('#ffbe3d').bold(`[Message-Commands] `) + chalk.whiteBright.bold(`Loading command : `) + chalk.hex('#ffbe3d').bold(cmds));
        if (pull.aliases && Array.isArray(pull.aliases))
          pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
      }
    });
    console.log(chalk.hex('#ffbe3d').bold(`[Message-Commands] `) + chalk.whiteBright.bold(`Total loaded : `) + chalk.hex('#ffbe3d').bold(client.mcommands.size));
  } catch (err) {
    console.log(err);
  }
};
