const { CommandInteraction, Client, MessageEmbed } = require('discord.js');
const moment = require('moment');
const { checkDays } = require('../../utils/function');

module.exports = {
    name: "serverinfo",
    description: "Displays the actual server informations",
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
            "NONE": "None",
            "LOW": "Low",
            "MEDIUM": "Medium",
            "HIGH": "(╯°□°）╯︵  ┻━┻",
            "VERY_HIGH": "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
        };

        // get the list of members
        await guild.members.fetch();
        const guildOwner = await guild.fetchOwner();

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addField("📝 Name", guild.name)
            .addField("👑 Owner", `${guildOwner}`)
            .addField("🚀 Boosts", `Level : ${guild.premiumTier} | ${guild.premiumSubscriptionCount} boosts`, true)
            .addField("✅ Verification Level", verifLevels[guild.verificationLevel], true)
            .addField("🕒 Created at", `${creationDate}\n${checkDays(guild.createdAt)}`, true)
            .addField("👥 Member Status", presenceString)
            .addField("🤖 Bots", guild.members.cache.filter((member) => member.user.bot === true).size.toString(), true)
            .addField("📜 Roles", guild.roles.cache.filter((role) => role.name != "@everyone").size.toString(), true)
            .addField("☺ Emoji Count", guild.emojis.cache.size.toString(), true)
            .addField("📂 Categories", channelCache.filter((channel) => channel.type === "GUILD_CATEGORY").size.toString(), true)
            .addField("💬 Text Channels", channelCache.filter((channel) => channel.type === "GUILD_TEXT").size.toString(), true)
            .addField("📣 Voice Channels", channelCache.filter((channel) => channel.type === "GUILD_VOICE").size.toString(), true)
            .setFooter(`${client.user.username}`, client.user.avatarURL({ dynamic: true }))
            .setTimestamp()

        interaction.reply({ embeds: [embed] });
    }
}