const { convertTime } = require('./convertTime.js');

module.exports = {
    queue_msg: async(client, player) =>{
        let Queue_message = `**คิวเพลง: [${player.queue.length}]**\n`;
        let return_Queue_message;
        let i;
            for(i = 0; i < player.queue.length; i++) {
                Queue_message += `> \`${i + 1})\` [${await convertTime(player.queue[i].duration)}] - ${player.queue[i].title}\n`;
                if(Queue_message.length >= 2000){
                    break;
                }
                return_Queue_message = Queue_message;
            }
        if(return_Queue_message == undefined || !return_Queue_message){
            return return_Queue_message = Queue_message + "ยังไม่รายการคิว";
        }
        else{
            return return_Queue_message;
        }
    }
};