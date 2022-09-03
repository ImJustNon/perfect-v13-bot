module.exports = {
    convertTime: async(duration) =>{
        var milliseconds = parseInt((duration % 1000) / 100);
        var	seconds = parseInt((duration / 1000) % 60);
        var	minutes = parseInt((duration / (1000 * 60)) % 60);
        var hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
    
        if (duration < 3600000) {
          return minutes + ":" + seconds;
        } else {
          return hours + ":" + minutes + ":" + seconds;
        }
    }
};