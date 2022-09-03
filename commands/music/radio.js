const { MessageEmbed } = require("discord.js");
const { Command } = require("../../utils/command/command");
const setting = require("../../settings/config.js");
const emoji = require("../../settings/config.js").emoji;
const econfig = require("../../settings/embed.js");
const manager = require("../../music/manager.js");
const db = require("../../database/quick_mongo.js");
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');


module.exports = new Command({
    name: "radio",
    description: `เลือกสถานีวิทยุ`,
    userPermissions: ['SEND_MESSAGES', 'READ_MESSAGES', 'CONNECT'],
    botPermissions: ['SEND_MESSAGES', 'READ_MESSAGES', 'CONNECT', 'ATTACH_FILES'],
    category: "music",
    cooldown: 10,
    run: async ({ client, interaction, args, prefix }) =>{
        let player = await manager.players.get(interaction.guildId);
        let guild = await client.guilds.cache.get(interaction.guildId);
        let member = await guild.members.cache.get(interaction.member.user.id);
        let me = await guild.members.cache.get(client.user.id);
        let channel = await member.voice.channel;

        if(!channel) return interaction.followUp('⚠ | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
	    else if(me.voice.channel && !channel.equals(me.voice.channel)) return interaction.followUp('⚠ | ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
	    else if(player) return interaction.followUp('⚠ | โปรดปิดเพลงทำกำลังเปิด ก่อนใช้คำสั่งนี้น่ะ');
        else{
            let embed = new MessageEmbed()
                .setColor(setting.music.radio_assets.color)
                .setImage(setting.music.radio_assets.banner)
                .setTitle(`คุณสามารถเลือกเปิดเพลงจากสถานีวิทยุได้จากตัวเลือกด้านล่างได้เลยน่ะ`)
                .setFooter({ text: setting.embed.footertext })
                .setTimestamp()

            const row = new MessageActionRow()
			    .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('select')
                        .setPlaceholder('กดเพื่อดูสถานีวิทยุทั้งหมด')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .addOptions([
                            {
                                label: '18k-RADIO',
                                description: '[เปิดเพลงจากสถานี 18K-RADIO]',
                                value: '18k',
                                emoji: '👑',
                            },
                            {
                                label: 'LISTEN.moe (JPOP)',
                                description: '[เปิดเพลงจากสถานี LISTEN.moe]',
                                value: 'listen(jpop)',
                                emoji: '📻',
                            },
                            {
                                label: 'LISTEN.moe (KPOP)',
                                description: '[เปิดเพลงจากสถานี LISTEN.moe]',
                                value: 'listen(kpop)',
                                emoji: '📻',
                            },
                            {
                                label: 'Random',
                                description: '[สูุ่มเลือกสถานีวิทยุ]',
                                value: 'random',
                                emoji: '🎊',
                            },
                        ]),
			    );

            await interaction.followUp({ embeds: [embed], components: [row] });
            const filter = i => i.user.id === interaction.member.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 30000 });
            
            collector.on('collect', async i =>{
                const value = i.values[0];
                if (value === '18k'){
                    play_Radio(setting.music.radioStation[0], i);
                }
                else if(value === 'listen(jpop)'){
                    play_Radio(setting.music.radioStation[1], i);
                }
                else if(value === 'listen(kpop)'){
                    play_Radio(setting.music.radioStation[2], i);
                }
                else if(value === 'random'){
                    const ran_Num = Math.floor(Math.random() * setting.music.radioStation.length);
                    play_Radio(setting.music.radioStation[ran_Num], i);
                }
            });


            async function play_Radio(radio, i){
                if(!player){
                    player = manager.create({
                        guild: i.guildId,
                        voiceChannel: member.voice.channel.id,
                        textChannel: i.channelId,
                        selfDeafen: false,
                        selfMute: false,
                        volume: 80,
                    });
                }
                if(player.state !== 'CONNECTED') player.connect();
		        let res = await manager.search(radio.url, i.member.user);

                let res_Embed = new MessageEmbed();
                switch(res.loadType){
                    case "LOAD_FAILED": {
                        if(!player.queue.current) player.destroy();
                        await i.update({ content: '⚠ | เกิดข้อผิดพลาด โปรดลองอีกครั้งในภายหลังน่ะ', components: [], embeds: [] });
                    }
                    break;
                    case "SEARCH_RESULT": {
                        await player.queue.add(res.tracks[0]);
                        res_Embed.setColor(radio.config.color).setDescription(`:white_check_mark: | กำลังเล่นเพลง [จากสถานีวิทยุ ${radio.name}](${radio.page})`);
                        await i.update({ components: [], embeds: [res_Embed] });
                        if(!player.playing){
                            player.play();
                        }
                    }
                    break;
                    case "TRACK_LOADED": {
                        await player.queue.add(res.tracks[0]);
                        res_Embed.setColor(radio.config.color).setDescription(`:white_check_mark: | กำลังเล่นเพลง [จากสถานีวิทยุ ${radio.name}](${radio.page})`);
                        await i.update({ components: [], embeds: [res_Embed] });
                        if(!player.playing){
                            player.play();
                        }
                    }
                    break;
                }
            }
        }
    },
});