const client = require("..");
const chalk = require('chalk');
const setting = require('../settings/config.js');

client.on("ready", async() => {
  	console.log(chalk.greenBright.bold(`[Client] `) + chalk.greenBright.bold("-------------- [Client] --------------"));
  	console.log(chalk.greenBright.bold(`[Client] `) + chalk.whiteBright.bold(`Logged in as `) + chalk.blue.bold(`${client.user.tag}`))
	console.log(chalk.greenBright.bold(`[Client] `) + chalk.whiteBright.bold(`Ready On ${client.guilds.cache.size} Servers, ${client.users.cache.size} Users`))
	console.log(chalk.greenBright.bold(`[Client] `) + chalk.greenBright.bold("-------------- [Client] --------------"));
  	setInterval(() => {
    	change_status(client);
  	}, 10 * 1000);

	require('../database/quick_mongo.js');
	require('../database/connect.js')();
});




function change_status(client) {
	try {
		client.user.setActivity(`${setting.prefix}help | ${client.guilds.cache.size} เซิฟเวอร์`, { 
      		type: "STREAMING", 
      		url: "https://www.twitch.tv/im_just_non",
		});
	} 
	catch (e) {
		client.user.setActivity(`${setting.prefix}help | ${client.guilds.cache.size} เซิฟเวอร์`, {
      		type: "STREAMING", 
      		url: "https://www.twitch.tv/im_just_non",
		});
	}
}