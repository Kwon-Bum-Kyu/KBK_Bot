const { CommandoClient } = require('discord.js-commando');
const { Structures } = require('discord.js');
const path = require('path');
const { prefix, token } = require('./config.json');

Structures.extend('Guild', Guild => {
  class MusicGuild extends Guild {
    constructor(client, data) {
      super(client, data);
      this.musicData = {
        queue: [],
        isPlaying: false,
        nowPlaying: null,
        songDispatcher: null,
        volume: 1,
        isLoop: false
      };
      this.triviaData = {
        isTriviaRunning: false,
        wasTriviaEndCalled: false,
        triviaQueue: [],
        triviaScore: new Map()
      };
    }
  }
  return MusicGuild;
});

const client = new CommandoClient({
  commandPrefix: prefix,
  owner: '00000000000000000' // change this to your Discord user ID
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['music', '음악 재생 관련 명령어'],
    ['gifs', '움짤 관련 명령어'],
    ['other', '기타'],
    ['guild', '멤버 관리 관련 명령어']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    eval: false,
    prefix: false,
    commandState: false
  })
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
  console.log('Ready!');
  client.user.setActivity('!help', {
    type: 'WATCHING',
    url: 'https://github.com/galnir/Master-Bot'
  });
});

client.login(token);
