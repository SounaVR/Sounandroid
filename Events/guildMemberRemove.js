const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(client, member) {
        const logEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`${member}/${member.user.tag} just left the server`)
            .setTimestamp();

        await member.guild.channels.cache.get("1091634192267346002").send({ embeds: [logEmbed] });
    }
}