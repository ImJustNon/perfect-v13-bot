const { MessageEmbed } = require("discord.js");
const { Command } = require("../../utils/command/command");
const setting = require("../../settings/config.js");
const emoji = require("../../settings/config.js").emoji;
const econfig = require("../../settings/embed.js");
const manager = require("../../music/manager.js");

module.exports = new Command({
    name: "play",
    description: `เล่นเพลงจากลิ้ง หรือ ชื่อเพลงที่ต้องการ`,
    userPermissions: ['SEND_MESSAGES', 'READ_MESSAGES', 'CONNECT'],
    botPermissions: ['SEND_MESSAGES', 'READ_MESSAGES', 'CONNECT', 'ATTACH_FILES'],
    category: "music",
    cooldown: 10,
    options: [
      {
        name: "เพลง",
        description: `URL หรือ ชื่อเพลงก็ได้น่ะ`,
        type: "STRING",
        required: true,
      },
    ],
    run: async ({ client, interaction, args, prefix }) => {
      const guild = client.guilds.cache.get(interaction.guildId)
      const member = guild.members.cache.get(interaction.member.user.id);
      const channel = member.voice.channel;

      const queary = interaction.options.getString("เพลง");

      const me = guild.members.cache.get(client.user.id);

      if(!channel) return interaction.followUp('⚠ | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
      else if(me.voice.channel && !channel.equals(me.voice.channel)) return interaction.followUp('⚠ | ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
	    else if(!queary) return interaction.followUp('⚠ | โปรดระบุเพลงที่ต้องการด้วยน่ะ');
      else {
        let player = manager.players.get(interaction.guildId);
        if(!player){
          player = manager.create({
            guild: interaction.guildId,
            voiceChannel: member.voice.channel.id,
            textChannel: interaction.channelId,
            selfDeafen: false,
            selfMute: false,
            volume: 80,
          });
        }
        if(player.state !== 'CONNECTED') player.connect();
        let res = await manager.search(queary, interaction.member.user.id);

        switch(res.loadType){
          case "LOAD_FAILED":
          {
            if(!player.queue.current) player.destroy();
            let result_embed = new MessageEmbed()
              .setColor(setting.music.embed.color)
              .setDescription('⚠ | ไม่สามารถโหลดผลการค้นหาได้')
            await interaction.followUp({embeds: [result_embed]});
          }
          break;
          case "NO_MATCHES":
          {
            if(!player.queue.current) player.destroy();
            let result_embed = new MessageEmbed()
              .setColor(setting.music.embed.color)
              .setDescription(`❌ | ไม่พบผลการค้นหาสำหรับ ${queary}`)
            await interaction.followUp({embeds: [result_embed]});
          }
          break;
          case "PLAYLIST_LOADED":
          {
            await player.queue.add(res.tracks);
            let result_embed = new MessageEmbed()
              .setColor(setting.music.embed.color)
              .setDescription(`✅ | เพิ่ม Playlist: \`${res.playlist.name}\` เรียบร้อยเเล้ว`)
            interaction.followUp({embeds: [result_embed]});
            if(!player.playing){
              player.play();
            }
          }
          break;
          case "SEARCH_RESULT":
          {
            await player.queue.add(res.tracks[0]);
            let result_embed = new MessageEmbed()
              .setColor(setting.music.embed.color)
              .setDescription(`✅ | เพิ่มเพลง \`${res.tracks[0].title}\` เรียบร้อยเเล้ว`)
            interaction.followUp({embeds: [result_embed]});
            if(!player.playing){
              player.play();
            }
          }
          break;
          case "TRACK_LOADED":
          {
            await player.queue.add(res.tracks[0]);
            let result_embed = new MessageEmbed()
              .setColor(setting.music.embed.color)
              .setDescription(`✅ เพิ่มเพลง \`${res.tracks[0].title}\` เรียบร้อยเเล้ว`)
            interaction.followUp({embeds: [result_embed]});
            if(!player.playing){
              player.play();
            }
          }
          break;
        }
      }
    },
});