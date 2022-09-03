module.exports = (client) => {
    const { spawn } = require('child_process');
    spawn('cmd.exe', ['/c', __dirname + '\\Start_Server_Player.bat'], {
        detached: true,
        stdio: 'ignore',
    });
}