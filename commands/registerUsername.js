module.exports = {
	name: 'registerUsername',
    description: 'Assert dominance by way of viewed anime.',
    usage: '<myAnimeList Username>',
    guildOnly: false,
    cooldown: 10,
    aliases: ['r', 'reg', 'register'],
	async execute(message, args) {
        try {
            message.channel.send(`https://api.myanimelist.net/v2/users/${args[0]}/animelist`);
            const { file } = await fetch(`https://api.myanimelist.net/v2/users/${args[0]}/animelist`).then(response => response.json());
            message.channel.send(`Website workie`);
            return message.channel.send(file);
        } catch (error) {
            return message.channel.send(`Website no workie`);
        }
	},
};