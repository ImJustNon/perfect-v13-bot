const { MessageEmbed } = require("discord.js");
const { Command } = require("../../utils/command/command");
const setting = require("../../settings/config.js");
const emoji = require("../../settings/config.js").emoji;
const econfig = require("../../settings/embed.js");

module.exports = new Command({
    name: "",
    description: ``,
    userPermissions: [],
    botPermissions: [],
    category: "",
    cooldown: 10,
    options: [
      {
        name: "option_name",
        description: `description`,
        type: "STRING",
        required: false,
      },
      {
        name: "choice",
        description: `description`,
        type: "STRING",
        required: false,
        choices: [
          {
            name: "choice_name",
            value: 'value',
          },
          {
            name: "choice_name2",
            value: 'value2',
          },
        ],
      },
    ],
    run: async ({ client, interaction, args, prefix }) => {

    },
});

// message command aka prefix cmd
const { Message, Client } = require("discord.js");
const ee = require("../../settings/config").embed
const emoji = require("../../settings/config").emoji

module.exports = {
  name: "",
  aliases: [""],
  description: ``,
  userPermissions: [],
  botPermissions: [],
  category: "",
  cooldown: 10,

  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, prefix) => {
    // code
  },
};
