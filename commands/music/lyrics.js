const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { geniusLyricsAPI } = require('../../config.json');

module.exports = class LyricsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lyrics',
      memberName: 'lyrics',
      description:
        '가사를 검색합니다. (작동 잘 안 함)',
      group: 'music',
      throttling: {
        usages: 1,
        duration: 5
      },
      args: [
        {
          key: 'songName',
          default: '',
          type: 'string',
          prompt: '가사를 얻고 싶은 곡의 이름을 입력해주세요.'
        }
      ]
    });
  }
  async run(message, { songName }) {
    if (
      songName == '' &&
      message.guild.musicData.isPlaying &&
      !message.guild.triviaData.isTriviaRunning
    ) {
      songName = message.guild.musicData.nowPlaying.title;
    } else if (songName == '' && message.guild.triviaData.isTriviaRunning) {
      return message.say('Please try again after the trivia has ended');
    } else if (songName == '' && !message.guild.musicData.isPlaying) {
      return message.say(
        '현재 재생 중인 곡이 없습니다. 곡 이름을 명시하거나 곡을 추가한 뒤 시도하세요.'
      );
    }
    const sentMessage = await message.channel.send(
      '👀 Searching for lyrics 👀'
    );

    // get song id
    var url = `https://api.genius.com/search?q=${encodeURI(songName)}`;

    const headers = {
      Authorization: `Bearer ${geniusLyricsAPI}`
    };
    try {
      var body = await fetch(url, { headers });
      var result = await body.json();
      const songID = result.response.hits[0].result.id;

      // get lyrics
      url = `https://api.genius.com/songs/${songID}`;
      body = await fetch(url, { headers });
      result = await body.json();

      const song = result.response.song;

      let lyrics = await getLyrics(song.url);
      lyrics = lyrics.replace(/(\[.+\])/g, '');

      if (lyrics.length > 4095)
        return message.say('Lyrics are too long to be returned as embed');
      if (lyrics.length < 2048) {
        const lyricsEmbed = new MessageEmbed()
          .setColor('#00724E')
          .setDescription(lyrics.trim());
        return sentMessage.edit('', lyricsEmbed);
      } else {
        // lyrics.length > 2048
        const firstLyricsEmbed = new MessageEmbed()
          .setColor('#00724E')
          .setDescription(lyrics.slice(0, 2048));
        const secondLyricsEmbed = new MessageEmbed()
          .setColor('#00724E')
          .setDescription(lyrics.slice(2048, lyrics.length));
        sentMessage.edit('', firstLyricsEmbed);
        message.channel.send(secondLyricsEmbed);
        return;
      }
    } catch (e) {
      console.error(e);
      return sentMessage.edit(
        'Something when wrong, please try again or be more specific'
      );
    }
    async function getLyrics(url) {
      const response = await fetch(url);
      const text = await response.text();
      const $ = cheerio.load(text);
      return $('.lyrics')
        .text()
        .trim();
    }
  }
};
