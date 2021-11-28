const firstMessage = require('./first-message')

module.exports = (client) => {
    const channelId = '914532612029165578';

    const getEmoji = (emojiName) => client.emojis.cache.find((emoji) => emoji.name === emojiName);

    const emojis = {
        'python': 'Python Game'
    };

    const reactions = [];

    let emojiText = 'Ajoutez la réaction que vous voulez pour récupérer le rôle correspondant.\n\n';
    for (const key in emojis) {
        const emoji = getEmoji(key)
        reactions.push(emoji)

        const role = emojis[key]
        emojiText += `${emoji} = ${role}\n`
    };

    firstMessage(client, channelId, emojiText, reactions);

    const handleReaction = (reaction, user, add) => {
        if (user.id === '899618699743461386') return;

        const emoji = reaction._emoji.name;

        const { guild } = reaction.message;

        const roleName = emojis[emoji];
        if (!roleName) return;

        const role = guild.roles.cache.get('914526256077365268'); // "Python Game" role
        const member = guild.members.cache.find((member) => member.id === user.id);

        if (add) {
            member.roles.add(role);
        } else {
            member.roles.remove(role);
        }
    }

    client.on('messageReactionAdd', (reaction, user) => {
        if (reaction.message.channel.id === channelId) {
            handleReaction(reaction, user, true);
        }
    })

    client.on('messageReactionRemove', (reaction, user) => {
        if (reaction.message.channel.id === channelId) {
            handleReaction(reaction, user, false);
        }
    })
}