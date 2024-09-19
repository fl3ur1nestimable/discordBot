const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const logMessage = async (message) => {
    const channel = message.guild.channels.cache.find(channel => channel.name === 'logs');
    const authorUsernameClickable = `<@${message.author.id}>`; // This is clickable but won't tag the user
    const msgChannelId = message.channel.id;
    const attachments = message.attachments.map(attachment => attachment.url).toString();
    
    if (!channel) return;

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel('Jump to message')
            .setStyle(ButtonStyle.Link)
            .setURL(message.url)
    );

    const sentMessage = `**➡️ Message sent by ${authorUsernameClickable} in <#${msgChannelId}>** \n\n\`\`\`${message.content || "No content"}\`\`\`\n${attachments || "No attachments"}`;
    await channel.send({ content: sentMessage, components: [row] , allowedMentions: { parse: [] } });
}

module.exports = logMessage;
