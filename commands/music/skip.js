const { Command } = require('discord.js-commando');

module.exports = class SkipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      aliases: ['skip-song', 'advance-song'],
      memberName: 'skip',
      group: 'music',
      description: '현재 재생 중인 곡을 넘깁니다.',
      guildOnly: true
    });
  }

  run(message) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('음성 채널에 진입 후 사용해주세요.');

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.reply('현재 재생 중인 곡이 없습니다.');
    }
    message.guild.musicData.isLoop = false;
    message.guild.musicData.songDispatcher.end();
  }
};
