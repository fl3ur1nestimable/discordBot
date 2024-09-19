const { Events, Collection, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const UserActivity = require('../models/userActivity');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            const { cooldowns } = interaction.client;
            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const defaultCooldownDuration = 3;
            const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1_000);
                    return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        } else if (interaction.isButton()) {
            if (interaction.customId === 'click_to_claim') {
                try {
                    const userActivity = await UserActivity.findOne({ where: { user_id: interaction.user.id } });
                    if (userActivity) {
                        await userActivity.update({ gift_received: false });
                        await interaction.update({
                            content: 'Tu as bien reçu ton cadeau !',
                            components: [],
                        });

                        console.log(`User ${interaction.user.tag} claimed their reward.`);
                    } else {
                        await interaction.reply({ content: 'User activity record not found.', ephemeral: true });
                    }
                } catch (error) {
                    console.error('Error handling button interaction:', error);
                    await interaction.reply({ content: 'There was an error while processing your request!', ephemeral: true });
                }
            }
        }
    },
};
