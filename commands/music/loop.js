const { Command } = require('discord.js-commando');

module.exports = class LoopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'loop',
      group: 'music',
      memberName: 'loop',
      guildOnly: true,
      description: '재생 중인 곡을 한 번 반복합니다. (대기열 투입)'
    });
  }

  run(message) {
    if (!message.guild.musicData.isPlaying) {
      return message.say('현재 재생 중인 곡이 없습니다.');
    } else if (
      message.guild.musicData.isPlaying &&
      message.guild.triviaData.isTriviaRunning
    ) {
      return message.say('You cannot loop over a trivia!');
    }
    if(!message.guild.musicData.isLoop){
      message.guild.musicData.isLoop = true;
    message.channel.send(
      `${message.guild.musicData.nowPlaying.title} 곡을 반복합니다.`
    );
    //message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying);
    return;
    }else{
      message.guild.musicData.isLoop = false;
      message.say('곡 반복이 해제되었습니다.')
      return;
    }
  }
};
