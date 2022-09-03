const manager = require('../manager.js');
const db = require('../../database/quick_mongo.js');
const setting = require('../../settings/config.js');
const { convertTime } = require('../utils/convertTime.js');
const { MessageEmbed } = require('discord.js');
const { queue_msg } = require('../utils/queue_message.js');
const { youtubeThumbnail } = require('../utils/youtube_thumbnail.js');

module.exports = async(client, message) => {
    //delete request message
    setTimeout(() => {
        message.delete();
    }, 800);

	let channel = message.member.voice.channel;

	//import data 
	let musicChannelID = await db.get(`music_${client.user.id}_${message.guild.id}_channel`);
	let trackMessageID = await db.get(`music_${client.user.id}_${message.guild.id}_track_message`);
    let queueMessageID = await db.get(`music_${client.user.id}_${message.guild.id}_queue_message`);
	//check data is valid
	let musicChannel = await message.guild.channels.cache.get(musicChannelID);
	let trackMessage = await musicChannel.messages.fetch(trackMessageID);
    let queueMessage = await musicChannel.messages.fetch(queueMessageID);
	if(!musicChannel) return; //if invalid will return
    if(!trackMessage) return; //
	if(!queueMessage) return; //

    if(!channel){  
        message.channel.send(':warning: โปรดเข้าช่องเสียงก่อนเปิดเพลงน่ะ').then((msg) =>{
            setTimeout(() =>{
                msg.delete();
            }, 5000);
        });
        return;
    }
	if(message.guild.me.voice.channel && !channel.equals(message.guild.me.voice.channel)){
        message.channel.send(':warning: เอ๊ะ! ดูเหมือนว่าคุณจะไม่ได้อยู่ในช่องเสียงเดียวกันน่ะ').then((msg) =>{
            setTimeout(() =>{
                msg.delete();
            }, 5000);
        });
        return;
    }

    let queary = message.content;
    let player = await manager.players.get(message.guild.id);

    if(!player){
        player = await manager.create({
            guild : message.guild.id,
            textChannel : message.channel.id, 
            selfDeafen : false,
            selfMute : false,
            voiceChannel : channel.id,
            volume : 80,
        });
    }

    if(player.state !== "CONNECTED") await player.connect();
    let res = await manager.search(queary, message.author);


    switch (res.loadType) {
        case "LOAD_FAILED": 
        {
            if(player.queue.current) await player.destroy();
            message.channel.send(`:x: ไม่สามารถโหลดการค้นหาได้ โปรดลองอีกครั้งในภายหลังน่ะ`).then((msg) =>{
                setTimeout(() =>{
                    msg.delete();
                }, 5000);
            });
        }
            break;
        case "NO_MATCHES": 
        {
            if(player.queue.current) await player.destroy();
            message.channel.send(`:x: ไม่พบผลการค้นหาของ ${queary} `).then((msg) =>{
                setTimeout(() =>{
                    msg.delete();
                }, 5000);
            });
        }
            break;
        case "PLAYLIST_LOADED": 
        {
            await player.queue.add(res.tracks);
            message.channel.send(`:white_check_mark: ทำการเพิ่ม Playlist : ${res.playlist.name}  เข้าไปในคิวการเล่นเเล้ว`).then((msg) =>{
                setTimeout(() =>{
                    msg.delete();
                }, 5000);
            });
            if(!player.playing){
                await player.play();
            }
			queueMessage.edit(queue_msg(client, player));
        }

            break;
        case "SEARCH_RESULT": 
        {
            await player.queue.add(res.tracks[0]);
            message.channel.send(`:white_check_mark: ได้ทำการเพิ่มเพลง : ${res.tracks[0].title}  เข้าไปในคิวการเล่นเเล้ว`).then((msg) =>{
                setTimeout(() =>{
                    msg.delete();
                }, 5000);
            });
            if(!player.playing){
                await player.play();
            }
			queueMessage.edit(queue_msg(client, player));
        }
            break;
            case "TRACK_LOADED": 
        {
            await player.queue.add(res.tracks[0]);
            message.channel.send(`:white_check_mark: ได้ทำการเพิ่มเพลง : ${res.tracks[0].title}  เข้าไปในคิวการเล่นเเล้ว`).then((msg) =>{
                setTimeout(() =>{
                    msg.delete();
                }, 5000);
            });
            if(!player.playing){
                await player.play(); 
            }
            queueMessage.edit(queue_msg(client, player));
        }
            break;
        default:
            break;
    }
};