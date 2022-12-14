const client = require("..");
const { cooldown } = require("../handlers/functions");
const { prefix } = require("../settings/config");
const db = require("../database/quick_mongo.js");
const { getPrefix } = require('../utils/getprefix.js');

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  if (message.channel.partial) await message.channel.fetch();
  if (message.partial) await message.fetch();

  // music Channels Checker
  // if message in music channel will return 
  const musicChannel = await db.get(`music_${client.user.id}_${message.guild.id}_channel`)
  if(musicChannel !== null && message.channel.id === musicChannel) return;

  let mentionprefix = new RegExp(
    `^(<@!?${client.user?.id}>|${mentionprefixnew(await getPrefix(message.guild.id))})`
  );
  if (!mentionprefix.test(message.content)) return;
  const [, nprefix] = message.content.match(mentionprefix);
  if (nprefix.includes(client.user.id)) {
    message.reply(`**ดูคำสั่งทั้งหมดใช้ **\`/help\``);
  }

  const args = message.content.slice(nprefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  const command = client.mcommands.get(cmd) || client.mcommands.find((cmds) => cmds.aliases && cmds.aliases.includes(cmd));
  if (!command) return;
  if (command) {
    if (!message.member.permissions.has(command.userPermissions || [])) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setDescription(
              `** ❌ You don't Have ${command.userPermissions} To Run Command.. **`
            ),
        ],
      });
    } else if (!message.member.permissions.has(command.botPermissions || [])) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setDescription(
              `** ❌ I don't Have ${command.botPermissions} To Run Command.. **`
            ),
        ],
      });
    } else if (cooldown(message, command)) {
      return message.channel.send(
        `*You are On Cooldown , wait \`${cooldown(
          message,
          command
        ).toFixed()}\` Seconds*`
      );
    } else {
      command.run(client, message, args, nprefix);
    }
  }
});

function mentionprefixnew(newprefix) {
  return newprefix.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
