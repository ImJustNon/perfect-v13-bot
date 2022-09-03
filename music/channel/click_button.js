const manager = require('../manager.js');
const db = require('../../database/quick_mongo.js');
const { MessageActionRow, MessageButton, Interaction } = require('discord.js');
const { MessageMenuOption, MessageMenu } = require("discord.js");
const { MessageEmbed } = require('discord.js');
const setting = require('../../settings/config.js');
const { youtubeThumbnail } = require('../utils/youtube_thumbnail.js');
const { convertTime } = require('../utils/convertTime.js');
const { Player } = require('discord-player');
const { queue_msg } = require('../utils/queue_message.js');
const { track_msg_Embed_loop } = require('../utils/track_msg_embed_loop.js');
const { track_msg_Embed} = require('../utils/track_start_embed.js');

module.exports = async(client) =>{
    client.on('interactionCreate', async(interaction) =>{
        if(!interaction.isButton()) return;

        let musicChannelID = await db.get(`music_${client.user.id}_${interaction.guildId}_channel`);
        if(interaction.channelId !== musicChannelID) return;

        let player = await manager.players.get(interaction.guildId);
        let guild = await client.guilds.cache.get(interaction.guildId);
        
        if(player){
            let trackEmbedID = await db.get(`music_${client.user.id}_${interaction.guildId}_track_message`);
            let queueMessageID = await db.get(`music_${client.user.id}_${interaction.guildId}_queue_message`);

            let musicChannel = client.channels.cache.get(musicChannelID);
            if(!musicChannel) return;
            let trackEmbed = await musicChannel.messages.cache.get(trackEmbedID);
            let queueMessage = await musicChannel.messages.cache.get(queueMessageID);

            const member = guild.members.cache.get(interaction.user.id);
            const channel = member.voice.channel;
            const me = guild.members.cache.get(client.user.id);

            if(!member) return; // if user not found
            const private_msg = new MessageEmbed()
                .setTitle('💢 ตอนนี้มีคนกำลังใช้งานอยู่น่ะ ลองเข้าช่องเดียวกันเพื่อเปิดเพลงสิ')
                .setColor(setting.music.embed.color)
                .setFooter({text: setting.music.embed.footer})
                .setTimestamp()
            if(me.voice.channel && !channel.equals(me.voice.channel)) return await member.send({embeds: private_msg}).then(async(msg) =>{
                await msg.react('🚫').catch(err => console.log(err));
                setTimeout(async() =>{
                    await msg.delete();
                }, 15000);
            });

                //if(b.guild.me.voice.channel && !b.member.voice.channel.equals(b.guild.me.voice.channel)) return musicChannel.send(`:warning: <@${b.clicker.user.id}> ดูเหมือนว่าคุณจะไม่ได้อยู่ในช่องเสียงเดียวกันน่ะคะ`);
            if(interaction.customId == 'pause'){
                if(!player.paused){
                    player.pause(true);
                    await interaction.reply(':white_check_mark: ทำการหยุดเพลงชั่วคราวเรียบร้อยเเล้วค่ะ').then(async() =>{ 
                        setTimeout(async() =>{
                            await interaction.deleteReply();
                        }, 5000); 
                    });
                }
                else if(player.paused){
                    player.pause(false);
                    await interaction.reply(':white_check_mark: ทำการเล่นเพลงต่อเเล้วค่ะ').then(async() =>{ 
                        setTimeout(async() =>{
                            await interaction.deleteReply();
                        }, 5000); 
                    });
                } 
            }
            else if(interaction.customId == 'skip'){
                player.stop();
                await interaction.reply(':white_check_mark: ทำการข้ามเพลงให้เรียบร้อยเเล้วค่ะ').then(async() =>{ 
                    setTimeout(async() =>{
                        await interaction.deleteReply();
                    }, 5000); 
                });
            }
            else if(interaction.customId == 'stop'){
                if(player.playing){
                    player.destroy();
                    await interaction.reply(':white_check_mark: ทำการปิดเพลงเรียบร้อยเเล้วค่ะ').then(async() =>{ 
                        setTimeout(async() =>{
                            await interaction.deleteReply();
                        }, 5000); 
                    });
                }
            }
            else if(interaction.customId == 'loop'){
                if(!player.trackRepeat && !player.queueRepeat){
                    player.setTrackRepeat(false);
                    player.setQueueRepeat(true);
                    await interaction.reply(`:white_check_mark: ทำการเปิดการวนซ้ำเพลงเเบบ \`ทั้งหมด\` เรียบร้อยเเล้วค่ะ`).then(async() =>{ 
                        await trackEmbed.edit({ embeds: [await track_msg_Embed_loop(client, player, "queue")]});
                        setTimeout(async() =>{
                            await interaction.deleteReply();
                        }, 5000); 
                    });
                }
                else if(player.queueRepeat && !player.trackRepeat){
                    player.setQueueRepeat(false);
                    player.setTrackRepeat(true);
                    await interaction.reply(`:white_check_mark: ทำการเปิดการวนซ้ำเพลงเเบบ \`เพลงเดียว\` เรียบร้อยเเล้วค่ะ`).then(async() =>{ 
                        await trackEmbed.edit({ embeds: [await track_msg_Embed_loop(client, player, "track")]});
                        setTimeout(async() =>{
                        await interaction.deleteReply();
                        }, 5000); 
                    });
                }
                else if(!player.queueRepeat && player.trackRepeat){
                    player.setQueueRepeat(false);
                    player.setTrackRepeat(false);
                    await interaction.reply(`:white_check_mark: ทำการปิดวนซ้ำเพลงเรียบร้อยเเล้วค่ะ`).then(async() =>{ 
                        await trackEmbed.edit({ embeds: [await track_msg_Embed_loop(client, player, "stop")]});
                        setTimeout(async() =>{
                            await interaction.deleteReply();
                        }, 5000); 
                    });
                }
            }
            else if(interaction.customId == 'shuffle'){
                if(!player.queue || !player.queue.length || player.queue.length == 0){
                    await interaction.reply(':warning: เอ๊ะ! ดูเหมือนว่าคิวของคุณจะไม่มีความยาวมากพอน่ะคะ').then(async() =>{ 
                        setTimeout(async() =>{
                            await interaction.deleteReply();
                        }, 5000); 
                    });
                }
                else{
                    await player.queue.shuffle();
                    await interaction.reply(':white_check_mark: ทำการสุ่มเรียงรายการคิวใหม่เรียบร้อยเเล้วค่ะ').then(async() =>{ 
                        await queueMessage.edit(await queue_msg(client, player));
                        setTimeout(async() =>{
                            await interaction.deleteReply();
                        }, 5000); 
                    });
                }
            }
            else if(interaction.customId == 'volup'){
                let newVol = player.volume + 10;
                if(newVol < 110){
                    player.setVolume(newVol);
                    await interaction.reply(`:white_check_mark: ทำการปรับความดังเสียงเป็น \`${newVol}\` เรียบร้อยเเล้วค่ะ`).then(async() =>{ 
                        await trackEmbed.edit(await track_msg_Embed(client, player));
                        setTimeout(async() =>{
                            await interaction.deleteReply();
                        }, 5000); 
                    });
                }
                else if(newVol >= 110){
                    await interaction.reply(`:white_check_mark: ไม่สามารถปรับความดังเสียงได้มากกว่านี้เเล้วค่ะ`).then(async() =>{ 
                        setTimeout(async() =>{
                            await interaction.deleteReply();
                        }, 5000); 
                    });
                }
            }
            else if(interaction.customId == 'voldown'){
                let newVol = player.volume - 10;
                if(newVol > 0){
                    player.setVolume(newVol);
                    await interaction.reply(`:white_check_mark: ทำการปรับความดังเสียงเป็น \`${newVol}\` เรียบร้อยเเล้วค่ะ`).then(async() =>{ 
                        await trackEmbed.edit(await track_msg_Embed(client, player));
                        setTimeout(async() =>{
                            await interaction.deleteReply();
                        }, 5000); 
                    });
                }   
                else if(newVol < 0){
                    await interaction.reply(`:white_check_mark: ไม่สามารถปรับความดังเสียงได้น้อยกว่านี้เเล้วค่ะ`).then(async() =>{ 
                        setTimeout(async() =>{
                            await interaction.deleteReply();
                        }, 5000); 
                    });
                }  
            }
            else if(interaction.customId == 'mute'){
                if(player.volume > 0){
                    player.setVolume(0);
                    await interaction.reply(`:white_check_mark: ทำการปิดเสียงเรียบร้อยเเล้วค่ะ`).then(async() =>{ 
                        await trackEmbed.edit(await track_msg_Embed(client, player));
                        setTimeout(async() =>{
                            await interaction.deleteReply();
                        }, 5000); 
                    });
                }
                else if(player.volume == 0){
                    player.setVolume(player.options.volume);
                    await interaction.reply(`:white_check_mark: ทำการเปิดเสียงเรียบร้อยเเล้วค่ะ`).then(async() =>{ 
                        await trackEmbed.edit(await track_msg_Embed(client, player));
                        setTimeout(async() =>{
                            await interaction.deleteReply();
                        }, 5000); 
                    });
                }
            }
        }
        else {
            interaction.reply({ content: '⚠️ คุณไม่สามารถใช้คำสั่งได้ใน ขณะนี้น่ะคะ', ephemeral: true });
        }
    });
}


    
/*
    if(player){
        let musicChannelID = await db.get(`music_${client.user.id}_${player.guild}_channel`);
        let trackEmbedID = await db.get(`music_${client.user.id}_${player.guild}_track_message`);
        let queueMessageID = await db.get(`music_${client.user.id}_${message.guild.id}_queue_message`);

        let musicChannel = client.channels.cache.get(musicChannelID);
        let trackEmbed = await musicChannel.messages.cache.get(trackEmbedID);
        let queueMessage = await musicChannel.messages.cache.get(queueMessageID);


        let Queue_message = `**คิวเพลง:**\n`;
        for(let i = 0; i < player.queue.length; i++) {
            Queue_message += `\`${i + 1})\` [${convertTime(player.queue[i].duration)}] - ${player.queue[i].title}\n`;
        }

        
        client.on("clickMenu", async(b) =>{
            if(b.values[0] == "radio") {
                chooseRadio()
            }
            await b.reply.defer();
        });

        async function chooseRadio(){
            let b18k = new MessageMenu()
                .setLabel('18K-Radio')
                .setEmoji('👑') 
                .setValue('18k')
                .setDescription('[เปิดเพลงจากสถานีวิทยุ 18k]')
            let select = new MessageMenu()
                .setID('selector')
                .setPlaceholder('กดเลือกตรงนี้ได้เลยน่ะ')
                .setMaxValues(1)
                .setMinValues(1)
                .addOptions(b18k)

            const Sendmenu = await musicChannel.send(':radio: โปรดเลือกสถานีวิทยุ จากด้านล่างนี้ได้เลยค่ะ :arrow_down:', select, true);
            const filter = ( button ) => button.clicker.id === button.clicker.id;
            let collector = Sendmenu.createMenuCollector(filter, { time : 15000 });
            collector.on("collect", (b) =>{
                if(b.values[0] == "18k"){
                    RadioStation(radioStation.ecq_18k,b);
                }
                else if(b.values[0] == "radio"){

                }
            });


            async function RadioStation(url,b){
                if(!channel){  
                    return musicChannel.send(':warning: โปรดเข้าช่องเสียงก่อนเปิดเพลงน่ะคะ').then((msg) => msg.delete({timeout: 5000 })); 
                }
                if(player.playing){
                    let res = await manager.search(url, b.clicker.user);
                    player.queue.add(res.tracks[0]);
                }
                else{
                    if(!player){
                        player = await manager.create({
                            guild : b.guild.id,
                            textChannel : b.channel.id, 
                            selfDeafen : false,
                            selfMute : false,
                            voiceChannel : b.member.voice.channel.id,
                            volume : 80,
                        });
                        if(player.state !== "CONNECTED") await player.connect();
                        let res = await manager.search(url, message.author);
                        player.queue.add(res.tracks[0]);

                    }
                }
                await queueMessage.edit(Queue_message);
            }
        }
        
    }
}*/