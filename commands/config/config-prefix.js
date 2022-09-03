const { MessageEmbed } = require("discord.js");
const { Command } = require("../../utils/command/command");
const setting = require("../../settings/config.js");
const emoji = require("../../settings/config.js").emoji;
const econfig = require("../../settings/embed.js");
const db = require("../../database/quick_mongo.js");

module.exports = new Command({
    name: "config-prefix",
    description: `ตั้งค่า Prefix บอท(สำหรับคำสั่งที่รองรับเท่านั้น)`,
    userPermissions: ['ADMINISTRATOR'],
    botPermissions: ['READ_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES'],
    category: "config",
    cooldown: 10,
    options: [
        {
            name: "prefix",
            description: `[ใส่ Prefix ใหม่ที่ต้องการ หรือ reset เพื่อลบการตั้งค่า]`,
            type: "STRING",
            required: true,
        },
    ],
    run: async ({ client, interaction, args, prefix }) => {
        const newPrefix = interaction.options.getString('prefix');

        if(newPrefix.toLowerCase() === 'reset'){
            if(await db.get(`prefix_${client.user.id}_${interaction.guildId}`) === null){
                return interaction.followUp('⚠ | เซิฟเวอร์นี้ยังไม่มีการตั้งค่า Prefix เลยน่ะคะ');
            }
            await db.delete(`prefix_${client.user.id}_${interaction.guildId}`).then(async() =>{
                await interaction.followUp('✅ ทำการรีเซ็ต Prefix เป็นค่าเริ่มต้นเรียบร้อย');
            });
        }
        else{
            if(newPrefix === setting.prefix) return interaction.followUp({content: `⚠️ ไม่สามารถตั้งค่า \`${newPrefix}\` ได้เนื่องจากเป็น Prefix เริ่มต้นค่ะ`});
            if(newPrefix.length > 6) return interaction.followUp({content: `⚠️ ไม่สามารถตั้งค่าได้เกิน \`6\` ตัวอักษรน่ะคะ`});
            if(newPrefix.includes(' ')) return interaction.followUp({content: `⚠️ ไม่สามารถตั้งค่าได้เนื่องจาก \`ห้ามมีการเว้นวรรค\` น่ะคะ`});
            
            await db.set(`prefix_${client.user.id}_${interaction.guildId}`, newPrefix).then(async() =>{
				interaction.followUp(`✅ ทำการตั้งค่า Prefix เป็น \`${newPrefix}\` เรียบร้อยเเล้วค่ะ`);
			});
        }
    },
});