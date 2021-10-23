const { CommandInteraction, Client, MessageEmbed } = require('discord.js');
const { checkDays } = require('../../utils/function');
const moment = require('moment');

module.exports = {
    name: "serverinfo",
    description: "Affiche les informations actuelles du serveur",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        //variables
        const guild = interaction.guild;
        const channelCache = guild.channels.cache;
        const presenceCache = guild.presences.cache;
        const creationDate = moment.utc(guild.createdAt).format("DD/MM/YYYY");

        // presence calculation
        const online = `🟢 Online : ${presenceCache.filter((presence) => presence.status === "online").size}\n`;
        const idle = `🌙 Idle : ${presenceCache.filter((presence) => presence.status === "idle").size}\n`;
        const dnd = `⛔ Do not disturb : ${presenceCache.filter((presence) => presence.status === "dnd").size}\n`;
        const offline = `⭕ offline : ${presenceCache.filter((presence) => presence.status === "offline").size}\n`
        let presenceString = online + idle + dnd + offline;

        // verification levels for "guild.verificationLevel" field
        const verifLevels = {
            "NONE": "Aucun",
            "LOW": "Faible",
            "MEDIUM": "Moyen",
            "HIGH": "(╯°□°）╯︵  ┻━┻",
            "VERY_HIGH": "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
        };

        // get the list of members
        await guild.members.fetch();
        const guildOwner = await guild.fetchOwner();

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addField("📝 Nom", guild.name)
            .addField("👑 Preaupryaitères", `${guildOwner}`)
            .addField("🚀 Boosts", `Niveau : ${guild.premiumTier} | ${guild.premiumSubscriptionCount} boosts`, true)
            .addField("✅ Niveau de vérification", verifLevels[guild.verificationLevel], true)
            .addField("🕒 Date de création", `${creationDate}\n${checkDays(guild.createdAt)}`, true)
            .addField("👥 Status de membre", presenceString)
            .addField("🤖", `**Bots** : ${guild.members.cache.filter((member) => member.user.bot === true).size.toString()}`, true)
            .addField("📜", `**Rôles** : ${guild.roles.cache.filter((role) => role.name != "@everyone").size.toString()}`, true)
            .addField("☺", `**Nombre d'emojis** : ${guild.emojis.cache.size.toString()}`, true)
            .addField("📂", `**Catégories** : ${channelCache.filter((channel) => channel.type === "GUILD_CATEGORY").size.toString()}`, true)
            .addField("💬", `**Salons textuels** : ${channelCache.filter((channel) => channel.type === "GUILD_TEXT").size.toString()}`, true)
            .addField("📣", `**Salons vocaux** : ${channelCache.filter((channel) => channel.type === "GUILD_VOICE").size.toString()}`, true)
            .setFooter(`${client.user.username}`, client.user.avatarURL({ dynamic: true }))
            .setTimestamp()

        interaction.reply({ embeds: [embed] });
    }
}