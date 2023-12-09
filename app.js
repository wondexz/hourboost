const Discord = require("discord.js");
const SteamUser = require("steam-user");
const axios = require('axios');
const fs = require('fs');
const moment = require('moment');
let startTime;
const client = new Discord.Client();
const config = require("./config.json");
const dconfig = require("./discord-config.json")
const wondexzbaba = "http://wondexz.cloud/screenshots/wondexz.png"
const prefix = dconfig.prefix; 
const hostingbyurl = dconfig.hostingby_url

const steamApiKey = dconfig.steam_api_key;
const steamUserId = dconfig.steam_user_id;

const steamApiUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamApiKey}&steamid=${steamUserId}&format=json`;

async function getCSGOSessionTime() {
    try {
        const response = await axios.get(steamApiUrl);
        const games = response.data.response.games;
        
        const csgoGame = games.find(game => game.appid === 730);

        if (csgoGame) {
            const playtimeMinutes = csgoGame.playtime_forever;
            const playtimeHours = playtimeMinutes / 60;

            

            client.on("message", (message) => {
                if (!message.content.startsWith(prefix) || message.author.bot) return;
            
                const args = message.content.slice(prefix.length).trim().split(/ +/);
                const command = args.shift().toLowerCase();
            
                if (command === "cs") {
                    if (message.author.id !== dconfig.dev) {
                        const embed = new Discord.MessageEmbed()
                        .setAuthor('wondexz', wondexzbaba, hostingbyurl)
                        .setDescription(`Bu komut sadece <@${dconfig.dev}> tarafından kullanabilir`)
                        return message.reply(embed);
                    }
            
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(dconfig.author_title+' - Counter-Strike 2', wondexzbaba, hostingbyurl)
                        .setDescription("Counter-Strike 2 adlı oyunun toplam oynama süresi aşağıdadır.")
                        .addField('Counter-Strike 2', '```'+playtimeHours.toFixed(0)+' saat```')
                        .setFooter(`hosting by ${dconfig.hostingby}`)
                        .setColor('#ff01f3');
            
                    message.reply(embed);
                }
            });
        } else {
            console.log("Bu kullanıcının CS:GO oyunu bulunamadı.");
        }
    } catch (error) {
        console.error("API isteği sırasında bir hata oluştu:", error.message);
    }
}

getCSGOSessionTime();

async function getETSSessionTime() {
    try {
        const response = await axios.get(steamApiUrl);
        const games = response.data.response.games;
        
        const etsGame = games.find(game => game.appid === 227300);

        if (etsGame) {
            const playtimeMinutes = etsGame.playtime_forever;
            const playtimeHours = playtimeMinutes / 60;

            

            client.on("message", (message) => {
                if (!message.content.startsWith(prefix) || message.author.bot) return;
            
                const args = message.content.slice(prefix.length).trim().split(/ +/);
                const command = args.shift().toLowerCase();
            
                if (command === "ets") {
                    if (message.author.id !== dconfig.dev) {
                        const embed = new Discord.MessageEmbed()
                        .setAuthor('wondexz', wondexzbaba, hostingbyurl)
                        .setDescription(`Bu komut sadece <@${dconfig.dev}> tarafından kullanabilir`)
                        return message.reply(embed);
                    }
            
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(dconfig.author_title+' - Euro Truck Simulator 2', wondexzbaba, hostingbyurl)
                        .setDescription("Euro Truck Simulator 2 adlı oyunun oynama süresi aşağıdadır.")
                        .addField('Euro Truck Simulator 2', '```'+playtimeHours.toFixed(0)+' saat```')
                        .setFooter(`hosting by ${dconfig.hostingby}`, wondexzbaba )
                        .setColor('#ff01f3');
            
                    message.reply(embed);
                }
            });
        } else {
            console.log("Bu kullanıcının ETS oyunu bulunamadı.");
        }
    } catch (error) {
        console.error("API isteği sırasında bir hata oluştu:", error.message);
    }
}

getETSSessionTime();

for (const account in config.accounts) {
    const username = config.accounts[account].details.username;
    const password = config.accounts[account].details.password;

    const title = config.accounts[account].settings.title;
    const games = config.accounts[account].settings.games;

    const steamClient = new SteamUser();

    steamClient.logOn({
        accountName: username,
        password: password
    });

    steamClient.on("loggedOn", async () => {
        await Array.prototype.push.apply(
            title,
            games
        );

        await steamClient.setPersona(
            SteamUser.EPersonaState.Online
        );

        await steamClient.gamesPlayed(
            title
        );

        console.log(`Logged successfully as ${username} on Steam.`);
    });
}

client.on("message", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "çıkış") {
        if (message.author.id !== dconfig.dev) {
            return message.reply("Bu komutu kullanamazsın.");
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(dconfig.author_title+' - Çıkış', wondexzbaba, hostingbyurl)
            .addField('Kapatılan hesap', '```wondexz```')
            .setFooter(`hosting by ${dconfig.hostingby}`, wondexzbaba)
            .setColor('#ff01f3');

        message.reply(embed);
        setTimeout(() => {
            process.exit();
        }, 10000);
    }
});

client.on("message", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "komutlar") {
        if (message.author.id !== dconfig.dev) {
            const embed = new Discord.MessageEmbed()
            .setAuthor('wondexz', wondexzbaba, hostingbyurl)
            .setDescription(`Bu komut sadece <@${dconfig.dev}> tarafından kullanabilir`)
            return message.reply(embed);
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(dconfig.author_title+' - Komutlar', wondexzbaba)
            .setDescription(`${dconfig.prefix}süreler - Hourboost yapılan hesapların kaç saatte olduğunu görürsün.\n${dconfig.prefix}çıkış - Hourboost'u durdurur.`)
            .setFooter(`hosting by ${dconfig.hostingby}`, wondexzbaba)
            .setColor('#ff01f3');

        message.reply(embed);
    }
});

client.on("message", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "süreler") {
        if (message.author.id !== dconfig.dev) {
            const embed = new Discord.MessageEmbed()
            .setAuthor('wondexz', wondexzbaba, hostingbyurl)
            .setDescription(`Bu komut sadece <@${dconfig.dev}> tarafından kullanabilir`)
            return message.reply(embed);
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(dconfig.author_title+' - Süreler', wondexzbaba,hostingbyurl)
            .setDescription("Counter-Strike 2 oyununun süresini görmek için `h!cs`\nEuro Truck Simulator oyununun süresini görmek için `h!ets`")
            .setFooter(`hosting by ${dconfig.hostingby}`, wondexzbaba)
            .setColor('#ff01f3');

        message.reply(embed);
    }
});


client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag} (${client.user.id})`);

client.user.setPresence({
    activity: {
        name: dconfig.activity_name,
        type: dconfig.activity_type
    },
    status: dconfig.status
});
});


client.login(dconfig.token);
