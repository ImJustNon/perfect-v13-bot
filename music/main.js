const chalk = require('chalk');
const fs = require('fs');

module.exports = async(client) =>{
    require('./manager.js');
    require('./erela_creation.js')(client);


    //load Event file
    const guild_event = fs.readdirSync(__dirname + '/events/guild').filter(name => name.endsWith('.js'));
    guild_event.forEach(async(x) =>{
        require(`./events/guild/${x}`)(client);
        console.log(chalk.blueBright.bold(`[Music-Client-Event-Handler] `) + chalk.whiteBright.bold(`Loading event : `) + chalk.blueBright.bold(`${x}`));
    });

    //messageCreate Event files
    require('./channel/events/messageCreate.js')(client);
    //Button interactionCreate
    require('./channel/click_button.js')(client);

    console.log(chalk.blueBright.bold(`[Music-Client-Event-Handler] `) + chalk.whiteBright.bold(`Total loaded : `) + chalk.blueBright.bold(`${guild_event.length}`));
}