const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;


module.exports = {
    colldown : 5,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
        await wait(5000);
		await interaction.editReply({ content: 'Pong again!', ephemeral: true });
        const message = await interaction.fetchReply();
	},
};