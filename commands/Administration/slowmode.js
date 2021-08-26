const Command = require("../../base/Command.js"),
	ms = require("ms");

class Slowmode extends Command {

	constructor (client) {
		super(client, {
			name: "slowmode",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "slowmotion" ],
			memberPermissions: [ "MANAGE_GUILD" ],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 3000
		});
	}

	async run (interaction, translate, data) {

		const channel = message.mentions.channels.filter((ch) => ch.type === "text" && ch.guild.id === interaction.guild.id).first();
		if(!channel){
			return interaction.reply({
				content: translate("misc:INVALID_CHANNEL"),
				ephemeral: true
			});
		}
		const time = args[1];
		if(!time){
			if(!data.guild.slowmode.channels.find((ch) => ch.id === channel.id)){
				return interaction.reply({
					content: translate("misc:INVALID_TIME"),
					ephemeral: true
				});
			}
			data.guild.slowmode.channels = data.guild.slowmode.channels.filter((ch) => ch.id !== channel.id);
			data.guild.markModified("slowmode.channels");
			data.guild.save();
			message.success("administration/slowmode:DISABLED", {
				prefix: data.guild.prefix,
				channel: `#${channel.name}`
			});
		} else {
			if(isNaN(ms(time))){
				return interaction.reply({
					content: translate("misc:INVALID_TIME"),
					ephemeral: true
				});
			}
			if(data.guild.slowmode.channels.find((ch) => ch.id === channel.id)){
				data.guild.slowmode.channels = data.guild.slowmode.channels.filter((ch) => ch.id !== channel.id);
			}
			data.guild.slowmode.channels.push({
				id: channel.id,
				time: ms(time)
			});
			data.guild.markModified("slowmode.channels");
			data.guild.save();
			message.success("administration/slowmode:ENABLED", {
				prefix: data.guild.prefix,
				channel: `#${channel.name}`,
				time: this.client.functions.convertTime(message.guild, ms(time))
			});
		}
	}
}

module.exports = Slowmode;
