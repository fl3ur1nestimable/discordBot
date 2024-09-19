const UserActivity = require('../models/userActivity');

const claimGift = async (interaction) => {
    if (interaction.customId === 'claimGift') {
        try {
            const userActivity = await UserActivity.findOne({ where: { user_id: interaction.user.id } });
            if (userActivity) {
                await userActivity.update({ message_count: 0, gift_received: false });
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

module.exports = claimGift;