const { Client, Collection } = require("discord.js");

module.exports = class Sounandroid extends Client {
    constructor() {
        super({
            intents: 1799,
            allowedMentions: { parse: ["users", "roles", "everyone"], everyone: false },
            restTimeOffset: 250
        });
        
        this.commands = new Collection();
        require("../Handlers/Events")(this);
        require("../Handlers/Commands")(this);
    }
}