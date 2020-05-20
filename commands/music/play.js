const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const { youtubeAPI } = require('../../config.json');
const youtube = new Youtube(youtubeAPI);

module.exports = class PlayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'play',
      aliases: ['play-song', 'add'],
      memberName: 'play',
      group: 'music',
      description: '유튜브에 존재하는 곡 또는 재생목록을 재생합니다.',
      guildOnly: true,
      clientPermissions: ['SPEAK', 'CONNECT'],
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: 'query',
          prompt: '유튜브에 존재하는 곡 또는 재생목록을 검색하세요.',
          type: 'string',
          validate: query => query.length > 0 && query.length < 200
        }
      ]
    });
  }

  async run(message, { query }) {
    // initial checking
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.say('음성 채널에 진입 후 사용해주세요.');
    // end initial check
    if (message.guild.triviaData.isTriviaRunning == true)
      return message.say('Please try after the trivia has ended');
    // This if statement checks if the user entered a youtube playlist url
    if (
      query.match(
        /^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/
      )
    ) {
      try {
        const playlist = await youtube.getPlaylist(query);
        const videosObj = await playlist.getVideos(10); // remove the 10 if you removed the queue limit conditions below
        //const videos = Object.entries(videosObj);
        for (let i = 0; i < videosObj.length; i++) {
          const video = await videosObj[i].fetch();

          const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
          const title = video.raw.snippet.title;
          let duration = this.formatDuration(video.duration);
          const thumbnail = video.thumbnails.high.url;
          if (duration == '00:00') duration = 'Live Stream';
          const song = {
            url,
            title,
            duration,
            thumbnail,
            voiceChannel
          };
          // this can be uncommented if you choose to limit the queue
          // if (message.guild.musicData.queue.length < 10) {
          //
          message.guild.musicData.queue.push(song);
          // } else {
          //   return message.say(
          //     `I can't play the full playlist because there will be more than 10 songs in queue`
          //   );
          // }
        }
        if (message.guild.musicData.isPlaying == false) {
          message.guild.musicData.isPlaying = true;
          return this.playSong(message.guild.musicData.queue, message);
        } else if (message.guild.musicData.isPlaying == true) {
          return message.say(
            `Playlist - :musical_note:  ${playlist.title} :musical_note: has been added to queue`
          );
        }
      } catch (err) {
        console.error(err);
        return message.say('재생목록이 비공개거나 존재하지 않습니다.');
      }
    }

    // This if statement checks if the user entered a youtube url, it can be any kind of youtube url
    if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
      const url = query;
      try {
        query = query
          .replace(/(>|<)/gi, '')
          .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        const id = query[2].split(/[^0-9a-z_\-]/i)[0];
        const video = await youtube.getVideoByID(id);
        // // can be uncommented if you don't want the bot to play live streams
        // if (video.raw.snippet.liveBroadcastContent === 'live') {
        //   return message.say("I don't support live streams!");
        // }
        // // can be uncommented if you don't want the bot to play videos longer than 1 hour
        // if (video.duration.hours !== 0) {
        //   return message.say('I cannot play videos longer than 1 hour');
        // }
        const title = video.title;
        let duration = this.formatDuration(video.duration);
        const thumbnail = video.thumbnails.high.url;
        if (duration == '00:00') duration = 'Live Stream';
        const song = {
          url,
          title,
          duration,
          thumbnail,
          voiceChannel
        };
        // // can be uncommented if you want to limit the queue
        // if (message.guild.musicData.queue.length > 10) {
        //   return message.say(
        //     'There are too many songs in the queue already, skip or wait a bit'
        //   );
        // }
        message.guild.musicData.queue.push(song);
        if (
          message.guild.musicData.isPlaying == false ||
          typeof message.guild.musicData.isPlaying == 'undefined'
        ) {
          message.guild.musicData.isPlaying = true;
          return this.playSong(message.guild.musicData.queue, message);
        } else if (message.guild.musicData.isPlaying == true) {
          return message.say(`${song.title} 곡이 대기열에 추가되었습니다.`);
        }
      } catch (err) {
        console.error(err);
        return message.say('오류가 발생했습니다.');
      }
    }
    try {
      const videos = await youtube.searchVideos(query, 5);
      if (videos.length < 5) {
        return message.say(
          `요청한 곡을 찾을 수 없습니다. 좀 더 구체적인 검색을 하세요.`
        );
      }
      const vidNameArr = [];
      for (let i = 0; i < videos.length; i++) {
        vidNameArr.push(`${i + 1}: ${videos[i].title}`);
      }
      vidNameArr.push('exit');
      const embed = new MessageEmbed()
        .setColor('#e9f931')
        .setTitle('1-5 번 중에서 골라주세요. 취소하시려면 exit을 치세요.')
        .addField('1번', vidNameArr[0])
        .addField('2번', vidNameArr[1])
        .addField('3번', vidNameArr[2])
        .addField('4번', vidNameArr[3])
        .addField('5번', vidNameArr[4])
        .addField('Exit', 'exit');
      var songEmbed = await message.say({ embed });
      try {
        var response = await message.channel.awaitMessages(
          msg => (msg.content > 0 && msg.content < 6) || msg.content === 'exit',
          {
            max: 1,
            maxProcessed: 1,
            time: 60000,
            errors: ['time']
          }
        );
        var videoIndex = parseInt(response.first().content);
      } catch (err) {
        console.error(err);
        if (songEmbed) {
          songEmbed.delete();
        }
        return message.say(
          '1-5번 또는 exit을 입력해야 합니다. 다시 !play 명령어를 사용해주세요.'
        );
      }
      if (response.first().content === 'exit') return songEmbed.delete();
      try {
        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
        // // can be uncommented if you don't want the bot to play live streams
        // if (video.raw.snippet.liveBroadcastContent === 'live') {
        //   songEmbed.delete();
        //   return message.say("I don't support live streams!");
        // }

        // // can be uncommented if you don't want the bot to play videos longer than 1 hour
        // if (video.duration.hours !== 0) {
        //   songEmbed.delete();
        //   return message.say('I cannot play videos longer than 1 hour');
        // }
      } catch (err) {
        console.error(err);
        if (songEmbed) {
          songEmbed.delete();
        }
        return message.say(
          '오류가 발생했습니다. Youtube Video UID를 가져오지 못했습니다.'
        );
      }
      const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
      const title = video.title;
      let duration = this.formatDuration(video.duration);
      const thumbnail = video.thumbnails.high.url;
      if (duration == '00:00') duration = 'Live Stream';
      const song = {
        url,
        title,
        duration,
        thumbnail,
        voiceChannel
      };
      // // can be uncommented if you don't want to limit the queue
      // if (message.guild.musicData.queue.length > 10) {
      //   songEmbed.delete();
      //   return message.say(
      //     'There are too many songs in the queue already, skip or wait a bit'
      //   );
      // }
      message.guild.musicData.queue.push(song);
      if (message.guild.musicData.isPlaying == false) {
        message.guild.musicData.isPlaying = true;
        if (songEmbed) {
          songEmbed.delete();
        }
        this.playSong(message.guild.musicData.queue, message);
      } else if (message.guild.musicData.isPlaying == true) {
        if (songEmbed) {
          songEmbed.delete();
        }
        return message.say(`${song.title} added to queue`);
      }
    } catch (err) {
      console.error(err);
      if (songEmbed) {
        songEmbed.delete();
      }
      return message.say(
        '요청한 곡을 찾을 수 없었습니다.'
      );
    }
  }
  playSong(queue, message) {
    queue[0].voiceChannel
      .join()
      .then(connection => {
        const dispatcher = connection
          .play(
            ytdl(queue[0].url, {
              quality: 'highestaudio',
              highWaterMark: 1024 * 1024 * 10
            })
          )
          .on('start', () => {
            message.guild.musicData.songDispatcher = dispatcher;
            dispatcher.setVolume(message.guild.musicData.volume);
            const videoEmbed = new MessageEmbed()
              .setThumbnail(queue[0].thumbnail)
              .setColor('#e9f931')
              .addField('재생 중:', queue[0].title)
              .addField('길이:', queue[0].duration);
            if (queue[1]) videoEmbed.addField('다음 곡:', queue[1].title);
            if(message.guild.musicData.isLoop){
              message.say(queue[0].title+'반복 재생 중');
            }else{
              message.say(videoEmbed);
            }
            message.guild.musicData.nowPlaying = queue[0];
            return queue.shift();
          })
          .on('finish', () => {
            if(message.guild.musicData.isLoop){
              message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying);
              return this.playSong(queue, message);
            }
            else if (queue.length >= 1) {
              return this.playSong(queue, message);
            } else {
              message.guild.musicData.isPlaying = false;
              message.guild.musicData.nowPlaying = null;
              return message.guild.me.voice.channel.leave();
            }
          })
          .on('error', e => {
            message.say('곡을 재생하는 데 오류가 발생했습니다. 재시도합니다.');
            console.error(e);
            /*
            message.guild.musicData.queue.length = 0;
            message.guild.musicData.isPlaying = false;
            message.guild.musicData.nowPlaying = null;
            */
            return this.playSong(queue,message);
          });
      })
      .catch(e => {
        console.error(e);
        return message.guild.me.voice.channel.leave();
      });
  }

  formatDuration(durationObj) {
    const duration = `${durationObj.hours ? durationObj.hours + ':' : ''}${
      durationObj.minutes ? durationObj.minutes : '00'
    }:${
      durationObj.seconds < 10
        ? '0' + durationObj.seconds
        : durationObj.seconds
        ? durationObj.seconds
        : '00'
    }`;
    return duration;
  }
};
