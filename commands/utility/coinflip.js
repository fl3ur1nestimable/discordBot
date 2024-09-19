const { ButtonBuilder, ButtonStyle, SlashCommandBuilder, ActionRowBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flips a coin.'),
    async execute(interaction) {
        const heads = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel('Heads')
            .setCustomId('heads');
        const tails = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel('Tails')
            .setCustomId('tails');
        const row  = new ActionRowBuilder()
            .addComponents(heads, tails);

        await interaction.reply({ 
            content: 'Choose heads or tails.', 
            components: [row] 
        });

        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'heads') {
                await i.reply('You chose heads.');
            } else {
                await i.reply('You chose tails.');
            }
            collector.stop();
            const result = Math.random() < 0.5 ? 'heads' : 'tails';
            wait(2000);
            await interaction.followUp({ content: `The coin landed on ${result}.`, components: [] });
        });

        collector.on('end', async collected => {
            if (collected.size === 0) {
                await interaction.editReply({ content: 'You did not choose in time.', components: [] });
            }
            collector.stop();
        });
    },
};