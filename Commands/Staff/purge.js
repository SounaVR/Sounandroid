const { parse } = require("path/posix");

exports.run = async (client, message, args) => {
    if (!client.config.owners.includes(message.author.id)) return message.react("❌");
    try {
        let delamount = args[0];
        if (isNaN(delamount) || parseInt(delamount <= 0)) return message.reply('You need to specify a number !');

        if (parseInt(delamount) > 100) return message.reply('You cant delete 100 messages at a time!');

        await message.channel.bulkDelete(parseInt(delamount), true);

        await message.channel.send('Purged!').then(m => {
            setTimeout(() => {
                m.delete()
            }, 5000);
        })
    } catch (error) {
        console.log(error);
    }
}

exports.help = {
    name: "purge",
    description: "Delete an amount of messages",
    usage: "<amount>",
    category: "Staff",
    aliases: ["clear", "prune", "del"]
}