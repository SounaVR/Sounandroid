const { CommandInteraction, Client } = require("discord.js");

module.exports = {
    name: "cheat",
    description: "🕵️‍♀️",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "target",
            description: "Select a target.",
            type: "USER",
            required: true
        },
        {
            name: "set",
            description: "Add or set a value.",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "set",
                    value: "set"
                },
                {
                    name: "add",
                    value: "add"
                }
            ]
        },
        {
            name: "table",
            description: "Choose a table",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "data",
                    value: "data"
                }
            ]
        },
        {
            name: "column",
            description: "Choose a column",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "lang",
                    value: "lang"
                },
                {
                    name: "lastDaily",
                    value: "lastDaily"
                },
                {
                    name: "money",
                    value: "money"
                }
            ]
        },
        {
            name: "value",
            description: "Put a valid value",
            type: "STRING",
            required: true
        }
    ],
    /** 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client, getUser) {
        const con = client.connection;
        const Target = interaction.options.getUser("target");
        const member = await getUser(con, Target.id);
    
        const args1 = interaction.options.getString("set");
        const args2 = interaction.options.getString("table");
        const args3 = interaction.options.getString("column");
        const args4 = interaction.options.getString("value");
        
        if (!member) return interaction.reply("Cet utilisateur n'est pas enregistré.");

        if (args4 < 0) return interaction.reply("Ce montant est invalide.")
    
        switch (args1) {
            case "set":       
                con.query(`UPDATE ${args2} SET ${args3} = ${args4} WHERE userid = ${Target.id}`);
                interaction.reply("✅");
                break;
        
            case "add":
                con.query(`UPDATE ${args2} SET ${args3} = ${member[args2][args3] + Number(args4)} WHERE userid = ${Target.id}`);
                interaction.reply("✅");
                break;
        }
    }
}