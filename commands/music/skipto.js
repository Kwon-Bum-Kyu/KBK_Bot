const { Command } = require('discord.js-commando');

module.exports = class SkipToCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skipto',
      memberName: 'skipto',
      group: 'music',
      description:
        '특정 대기열 순번의 곡으로 넘어갑니다.',
      guildOnly: true,
      args: [
        {
          key: 'songNumber',
          prompt:
            'What is the number in queue of the song you want to skip to?, it needs to be greater than 1',
          type: 'integer'
        }
      ]
    });
  }

  run(message, { songNumber }) {
    if (songNumber < 1 && songNumber >= message.guild.musicData.queue.length) {
      return message.reply('유효한 곡 순번을 입력해주세요.');
    }
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('음성 채널에 진입 후 사용해주세요.');

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.reply('현재 재생 중인 곡이 없습니다.');
    }

    if (message.guild.musicData.queue < 1)
      return message.say('현재 대기열에 곡이 없습니다.');

    message.guild.musicData.queue.splice(0, songNumber - 1);
    message.guild.musicData.songDispatcher.end();
    return;
  }
};
