const setting = require('../settings/config.js');
const { Database } = require('quickmongo');
const db = new Database(setting.database.mongodbURL);
const chalk = require('chalk');

async function connect(){
    db.on("ready", () =>{
        console.log(chalk.magenta.bold('[Data-Base] ') + chalk.white.bold("Quickmongo already connected to MongoDB"));
    });
    await db.connect();	
}
connect();

module.exports = db;