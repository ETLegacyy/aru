/**
 * Aru
 * Overwatch Command
 */

module.exports = {
  options: {
    name: 'ow',
    usage: 'ow <username> <platform> <region>',
    description: 'Get information from an Overwatch profile',
    fullDescription: 'Get information from an Overwatch profile. Information includes level, wins, and playtime.'
  },

  exec: function (bot, logger, msg, args) {
    // Setup files and modules
    const axios = require('axios')

    if (args[1] !== 'pc' && args[1] !== 'xbl' && args[1] !== 'psn') {
      msg.channel.createMessage(`Please put in a valid platform: pc, xbl, psn.`)
      logger.cmdUsageError(module.exports.options.name, msg, args, 'Invalid platform')
      return
    }

    if (args[2] !== 'eu' && args[2] !== 'kr' && args[2] !== 'us' && args[2] !== 'global' && args[2] !== 'cn') {
      msg.channel.createMessage(`Please put in a valid region: eu, kr, us, global, cn.`)
      logger.cmdUsageError(module.exports.options.name, msg, args, 'Invalid region')
      return
    }

    let username = args[0].replace('#', '-')
    let platform = args[1]
    let region = args[2]

    axios
      .get(`https://ow-api.com/v1/stats/${platform}/${region}/${username}/complete`)
      .then(response => {
        // Create message
        msg.channel.createMessage({
          embed: {
            author: {
              name: response.data.name,
              icon_url: 'https://pbs.twimg.com/profile_images/538246909664559104/oeOj9DtM.png',
              url: `http://masteroverwatch.com/profile/${platform}/${region}/${username}`
            },
            title: 'Overwatch Information:',
            color: 16765404,
            fields: [
              {
                name: 'Level',
                value: response.data.level != null ? response.data.level : '0',
                inline: true
              },
              {
                name: 'Quick Wins',
                value: response.data.quickPlayStats.games.won != null ? response.data.quickPlayStats.games.won : '0',
                inline: true
              },
              {
                name: 'Competitive Wins',
                value: response.data.competitiveStats.games.won != null ? response.data.competitiveStats.games.won : '0',
                inline: true
              },
              {
                name: 'Competitive Lost',
                value: response.data.competitiveStats.games.played != null ? response.data.competitiveStats.games.played - response.data.competitiveStats.games.won : '0',
                inline: true
              },
              {
                name: 'Playtime (Quick)',
                value: response.data.quickPlayStats.careerStats.allHeroes.game.timePlayed != null ? response.data.quickPlayStats.careerStats.allHeroes.game.timePlayed : '0',
                inline: true
              },
              {
                name: 'Playtime (Competitive)',
                value: response.data.competitiveStats.careerStats.allHeroes.game.timePlayed != null ? response.data.competitiveStats.careerStats.allHeroes.game.timePlayed : '0',
                inline: true
              }
            ],
            thumbnail: {
              url:
                response.data.icon != null ? response.data.icon : ''
            },
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        })

        logger.cmdUsage(module.exports.options.name, msg, args)
      })
      .catch(err => {
        msg.channel.createMessage(`Overwatch profile :slight_frown:`)
        logger.cmdUsageError(module.exports.options.name, msg, args, err)
      })
  }
}
