const { Client } = require("discord.js");
const fs = require("fs");
const chalk = require('chalk');
/**
 *
 * @param {Client} client
 */

module.exports = (client) => {
  try {
    fs.readdirSync("./events/").forEach((file) =>{
      const events = fs.readdirSync("./events/").filter((file) => file.endsWith(".js"));
      for (let file of events) {
        let pull = require(`../events/${file}`);
        if (pull) {
          client.events.set(file, pull);
        }
      }
      console.log(chalk.hex('#81ff3d').bold(`[Events] `) + chalk.whiteBright.bold(`Loading event : `) + chalk.hex('#81ff3d').bold(file));
    });
    console.log(chalk.hex('#81ff3d').bold(`[Events] `) + chalk.whiteBright.bold(`Total loaded : `) + chalk.hex('#81ff3d').bold(client.events.size));
  } catch (e) {
    console.log(e);
  }
};
