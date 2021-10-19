const Default = require('../default.json');

module.exports = async function insert_data(client, con, player, message, databaseLogs, userid) {
    if (!player) {
        await con.query(`INSERT INTO data (
            uuid, userid, username, lang, lastDaily, money
        ) VALUES (
            '${Default.uuid}', '${message.user.id.toString()}', '${message.user.tag}', 'en', '${Default.lastDaily}','${Default.money}'
        )`), async (err) => {
            if (err) return databaseLogs.send(`🔴 Table **data** > An error occurred :\n**${err}**`);
            databaseLogs(`🟢 Table **data** : **${message.user.id.toString()}** aka **${message.user.tag}**.`);
        }
    }
}