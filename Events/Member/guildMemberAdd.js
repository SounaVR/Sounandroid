const { MessageEmbed, GuildMember } = require('discord.js');

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} member 
     */
    execute(client, member) {
        if (member.guild.id !== "885409367464214578") return;
        const memberRole = member.guild.roles.cache.get("898319662675267625");
        member.roles.add(memberRole);

        const welcomeEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor("BIENVENUE !", member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`Bienvenue ${member} sur le serveur **${member.guild.name}**!\nNombre de membre: **${member.guild.memberCount}**`)
            .setFooter(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        member.guild.channels.cache.get("899616418922889246").send({ content: `${member} joined!`, embeds: [welcomeEmbed] })

        const logEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor("JOIN", member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`${member}/${member.user.id} joined.`)
            .setFooter(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        member.guild.channels.cache.get("899621885346734110").send({ embeds: [logEmbed] });
        }
}