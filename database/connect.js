const mongoose = require("mongoose");
const setting = require('../settings/config.js');
const chalk = require('chalk');

async function connect() {
    mongoose.connect(setting.database.mongodbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.connection.once("open", () => {
        console.log(chalk.magenta.bold('[Data-Base]') + chalk.magenta.bold(' ------------ [Database] ------------'));
        console.log(chalk.magenta.bold('[Data-Base]') + chalk.white.bold(' MongoDB'));
        console.log(chalk.magenta.bold('[Data-Base]') + chalk.white.bold(' Database Is Already Connected'));
        console.log(chalk.magenta.bold('[Data-Base]') + chalk.magenta.bold(' ------------ [Database] ------------'));
    });
    return;
}

module.exports = connect;