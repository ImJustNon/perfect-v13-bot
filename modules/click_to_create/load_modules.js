const db = require('../../database/quick_mongo.js');
const fs = require('fs');
const chalk = require('chalk');

module.exports = async(client) =>{
    db.on('ready', async() =>{
        const files = fs.readdirSync(__dirname + '/modules/').filter(name => name.endsWith('.js'));
        files.forEach(async(x) =>{
            require(`./modules/${x}`)(client);
            console.log(chalk.hex("#9748f7").bold('[Module] ') + chalk.whiteBright.bold('Loading module : ') + chalk.hex("#9748f7").bold(`${x}`));
        });
        console.log(chalk.hex("#9748f7").bold("[Module] ") + chalk.whiteBright.bold('Total loaded JoinToCreate Modules : ') + chalk.hex("#9748f7").bold(`${files.length}`));
    });
}