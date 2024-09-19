const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Send a direct message to a specified user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user you want to send a DM to.')
                .setRequired(true)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        try {
            if (!targetUser) {
                return await interaction.reply({ content: 'Invalid user specified.', ephemeral: true });
            }

            await targetUser.send('Hello! This is a test DM from the FBot.');
            await interaction.reply({ content: `Successfully sent a DM to ${targetUser.tag}.`, ephemeral: true });

        } catch (error) {
            console.error('Error sending DM:', error);
            if (error.code === 50007) { 
                await interaction.reply({ content: 'I cannot send a DM to this user. They might have DMs disabled or blocked me.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'An error occurred while trying to send the DM.', ephemeral: true });
            }
        }
    },
};
