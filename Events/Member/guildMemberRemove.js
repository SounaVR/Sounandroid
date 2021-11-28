const { MessageEmbed, GuildMember } = require('discord.js');

module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {GuildMember} member 
     */
    execute(client, member) {
        const logEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`${member}/${member.user.tag} just left the server`)
            .setTimestamp();

        member.guild.channels.cache.get("899621885346734110").send({ embeds: [logEmbed] });
    }
}


