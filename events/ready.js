const { Events } = require('discord.js');
const sequelize = require('../database');
const sendGift = require('../tasks/sendGift');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        (async () => {
            try {
                await sequelize.sync();
                console.log('Database synced successfully.');
            } catch (error) {
                console.error('Unable to sync the database:', error);
            }
        })();
        console.log(`Ready! Logged in as ${client.user.tag}`);
        setInterval(() => {
            sendGift(client);
        },60000);
	},
};