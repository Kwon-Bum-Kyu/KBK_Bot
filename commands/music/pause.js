const { Command } = require('discord.js-commando');

module.exports = class PauseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pause',
      aliases: ['pause-song', 'hold', 'stop'],
      memberName: 'pause',
      group: 'music',
      description: '재생을 일시 중지시킵니다. !resume 으로 재개합니다.',
      guildOnly: true
    });
  }

  run(message) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('음성 채널에 진입 후 사용해주세요.');

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.say('현재 재생 중인 곡이 없습니다.');
    }

    message.say('곡 일시중지됨 :pause_button:');

    message.guild.musicData.songDispatcher.pause();
  }
};
