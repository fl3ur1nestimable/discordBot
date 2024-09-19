const { ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const UserActivity = require('../models/userActivity');

const sendGift = async (client) => {
    try {
        const users = await UserActivity.findAll();
        const now = new Date();

        for (const user of users) {
            const lastMessageTime = new Date(user.last_message);
            const diffInMinutes = Math.floor((now - lastMessageTime) / 60000);

            if (diffInMinutes >= 2 && user.message_count > 2 && !user.gift_received) {
                const guildMember = await client.users.fetch(user.user_id);
                const memberId = guildMember.id;

                if (guildMember) {

                    const row = new ActionRowBuilder()
                    const button = new ButtonBuilder()
                        .setCustomId('claimGift')
                        .setLabel('🎁 Ouvrir')
                        .setStyle(ButtonStyle.Primary);
                    row.addComponents(button);
                    guildMember.send({ 
                        content: `Salut <@${memberId}> ! Tu nous manques !\n\n` +
                                 `Voici un **cadeau** spécial pour toi. **Clique** sur le bouton pour l'ouvrir et découvrir ta surprise !\n` +
                                 `-# *Ce message provient du serveur chicken wings*`, 
                        components: [row] 
                    });

                    //set the gift_received flag to true
                    await user.update({ gift_received: true });

                    console.log(`Sent DM to ${guildMember.tag}`);
                }
            }
        }
    } catch (error) {
        console.error('Error checking inactive users:', error);
    }
}

module.exports = sendGift;

