module.exports = {
	name: 'seen',
    description: 'Assert dominance by way of viewed anime.',
    usage: 'seen <anime> <anime2> <anime3>',
    guildOnly: true,
    cooldown: 10,
    aliases: ['s', 'watched'],
	execute(message, args) {
        
        if (args[0] === 'Avatar') {
            return message.channel.send('bar');
        }
    
        message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};