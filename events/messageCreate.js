// events/messageCreate.js
const UserActivity = require('../models/userActivity');
const logMessage = require('../tasks/logMessage');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot || message.channel.type === 'dm') return;

        try {
            const user = await UserActivity.findOne({ where: { user_id: message.author.id } });

            if (!user) {
                await UserActivity.create({
                    user_id: message.author.id,
                    last_message: new Date(),
                    message_count: 1
                });
            } else {
                await user.update({
                    last_message: new Date(),
                    message_count: user.message_count + 1
                });
            }
            console.log('User activity updated successfully for:', message.author.tag);
        } catch (error) {
            console.error('Error updating user activity:', error);
        }

        logMessage(message);
    },
};
