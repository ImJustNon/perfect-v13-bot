const db = require('../database/quick_mongo.js');
const setting = require('../settings/config.js');
const client = require('../index.js');

module.exports = {
    getPrefix: async(guild_id) =>{
        let PREFIX;
        try {
            const fetched = await db.get(`prefix_${client.user.id}_${guild_id}`);
            if(fetched === null){
                PREFIX = setting.prefix;
            }
            else {
                PREFIX = fetched;
            }
            return await PREFIX;
        } 
        catch (e) {
            console.log(e);
        }
    }
}