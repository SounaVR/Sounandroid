module.exports = {
    getUser: async function(con, user) {
        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM data WHERE userid = ${user}`, function(err, data) {
                if (!data[0]) return resolve(false)

                resolve({data:data[0]})
            })
        })
    },

    getPlayer: async function(con, player) {
        return new Promise(function(resolve, reject) {
            con.query(`SELECT * FROM data WHERE userid = ${player}`, function(err, data) {
                if (!data[0]) return resolve(false)

                resolve({data:data[0]})
            })
        })
    },
    checkDays: function(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days + (days == 1 ? " day" : " days") + " ago";
    }
}