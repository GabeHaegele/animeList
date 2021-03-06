const fs = require('fs');
const Discord = require('discord.js');

const { Client, MessageEmbed } = require('discord.js');

const { prefixes, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const fetch = require('node-fetch');

var containsPre = true;
var sliceLength = 0;

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
    console.log('SexyAnimeGirl is online ;)');
    client.user.setActivity('trap-anthem', { type: 'LISTENING' });
});

client.on('message', message =>{

    if (message.author.bot) return;

    containsPre=false;

    prefixes.forEach(function (prefix, index) {
        if(message.content.toLowerCase().startsWith(prefix))
        {
            containsPre=true;
            sliceLength=prefix.length;
        }
    });
    
    if (!containsPre) return;

    const args = message.content.slice(sliceLength).trim().split(/ +/);//regex to split arguments
    
    const commandName = args.shift().toLowerCase();
    
    //Dynamically Execute Commands:
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    if (!command) return;

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
        
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    //COOLDOWN SECTION
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    //END COOLDOWN SECTION

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
})




//Last Line:
client.login(token);