const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(client, member) {
        const logEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`${member}/${member.user.username} just left the server`)
            .setTimestamp();

        await member.guild.channels.cache.get("1065830709652103168").send({ embeds: [logEmbed] });
    }
}