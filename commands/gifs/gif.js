const fetch = require('node-fetch');
const { tenorAPI } = require('../../config.json');
const { Command } = require('discord.js-commando');

module.exports = class GifCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'gif',
      group: 'gifs',
      aliases: ['search-gif', 'search-gifs'],
      memberName: 'gif',
      description: '움짤 검색기',
      throttling: {
        usages: 1,
        duration: 4
      },
      args: [
        {
          key: 'text',
          prompt: '검색하고 싶은 게 무엇인가요?',
          type: 'string',
          validate: text => text.length < 50
        }
      ]
    });
  }

  run(message, { text }) {
    fetch(`https://api.tenor.com/v1/random?key=${tenorAPI}&q=${text}&limit=1`)
      .then(res => res.json())
      .then(json => message.say(json.results[0].url))
      .catch(e => {
        message.say('그런 건 없습니다.');
        return console.error(e);
      });
  }
};
