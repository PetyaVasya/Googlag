const Discord = require('./discord.js');
const fs = require("fs");
const botconfig = require('./botconfig.json');
var servers = require("./servers.json");
var phrases = require("./phrases.json");
var votes = require("./votes.json");

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity("из-за шторы", {type: "WATCHING"});
});

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm"){
        message.author.send("Petuh");
    }
    else{
        if (message.channel.name === "logs") message.delete();
        let prefix = servers[message.guild.id].prefix;
        let messageArray = message.content.split(" ");
        let cmd = messageArray[0];
        let args = messageArray.slice(1);
        let goolag = message.guild.channels.find(channel => channel.name == "Гулаг" && channel.type == "category");
        if(cmd === `${prefix}вставить`){
            message.delete();
            let userWithProblem = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
            if (!userWithProblem) return message.channel.send(`<@${message.member.id}>, Выбери живую жертву`).then(msg => {
                msg.delete(180000);
            });
            if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`<@${message.member.id}>, Опа, еще один стахановец?`).then(msg => {
                msg.delete(180000);
            });
            if (userWithProblem.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`<@${message.member.id}>, Товарищу присунуть решил?`).then(msg => {
                msg.delete(180000);
            });

            let problemReason = args.join(" ").slice(22);
            
            let problemEmbed = new Discord.RichEmbed()
            .setDescription("~Вставил~")
            .setColor("#e56b00")
            .addField("Заглотивший:", `${userWithProblem}. ID: ${userWithProblem.id}`)
            .addField("Подозреваемый:", `<@${message.author.id}>. ID: ${message.author.id}`)
            .addField("Предположительное место происшествия:", message.channel)
            .addField("Время происшествия:", message.createdAt)
            .addField("Оправдания подозреваемого:", problemReason?problemReason:"В экстазе");

            let logschannel = message.guild.channels.find('name', "logs")
            if (!logschannel) return message.channel.send(`<@${message.member.id}>, Сука, киноленту-то вставь`).then(msg => {
                msg.delete(180000);
            });
            
            logschannel.send(problemEmbed);

            message.guild.member(userWithProblem).setMute(true, problemReason);
            // message.channel.send("");
            return
        }
        else if (cmd === `${prefix}вытащить`){
            message.delete();
            let userWithProblem = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
            if (!userWithProblem) return message.channel.send(`<@${message.member.id}>, Отряд уже в пути`).then(msg => {
                msg.delete(180000);
            });
            if (!message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0])).mute) return message.channel.send(`<@${message.member.id}>, Уложить его? Это с легкостью`).then(msg => {
                msg.delete(180000);
            });
            if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`<@${message.member.id}>, Опа, еще один стахановец?`).then(msg => {
                msg.delete(180000);
            });
            if (userWithProblem.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`<@${message.member.id}>, Товарищу присунуть решил?`).then(msg => {
                msg.delete(180000);
            });

            let helpReason = args.join(" ").slice(22);

            let helpEmbed = new Discord.RichEmbed()
            .setDescription("~Вытащил~")
            .setColor("#e56b00")
            .addField("Его рот был спасен:", `${userWithProblem}. ID: ${userWithProblem.id}`)
            .addField("Врач:", `<@${message.author.id}>. ID: ${message.author.id}`)
            .addField("Больница:", message.channel)
            .addField("Время выздоровления:", message.createdAt)
            .addField("Комменатрии врача:", helpReason?helpReason:"Было не просто, но мы смогли вывернуть его обратно");
            
            logschannel = message.guild.channels.find('name', "logs");
            if (!logschannel) return message.channel.send(`<@${message.member.id}>, Сука, киноленту-то вставь`).then(msg => {
                msg.delete(180000);
            })
            
            logschannel.send(helpEmbed);

            message.guild.member(userWithProblem).setMute(false, helpReason);
            // message.channel.send("");
        }
        else if (cmd == `${prefix}обед` && (goolag.children.exists('id', message.channel.id))){
            message.delete();
            if (!message.member.roles.exists('name', "НКВД")) return
            let dinnerRoom = goolag.children.find(channel => channel.name == "Столовка" && channel.type == "voice");
            if (!dinnerRoom) return message.channel.send(`<@${message.member.id}>, Расходимся поцаны, пока только галька`).then(msg => {
                msg.delete(180000);
            });
            let places = goolag.children.filter(function(c){return (c.type == "voice") && (c.name != "Столовка")});
            if (!places) return message.channel.send(`<@${message.member.id}>, Всех уже приняли`).then(msg => {
                msg.delete(180000);
            });
            let nigers = new Discord.Collection();
            places.forEach(element => {
                nigers = nigers.concat(element.members);
            });

            let activityReason = args.join(" ");

            // Прочесываем рядовых
            nigers = nigers.filter(function(c){return !c.roles.exists('name', 'НКВД')})
            if (nigers.length == 0) return message.channel.send(`<@${message.member.id}>, Всех уже приняли`).then(msg => {
                msg.delete(180000);
            });

            let dinnerchat = goolag.children.find(channel => channel.name == "столовка" && channel.type == "text")
            if (!dinnerchat) return message.channel.send(`<@${message.member.id}>, Немые еще и ослепли`).then(msg => {
                msg.delete(180000);
            });
            logschannel = goolag.children.find('name', "logs");
            if (!logschannel) return message.channel.send(`<@${message.member.id}>, Сука, киноленту-то вставь`).then(msg => {
                msg.delete(180000);
            });

            nigers.forEach(niger => {
                niger.setVoiceChannel(dinnerRoom.id)
                .then(() => dinnerchat.send(new Discord.RichEmbed()
                                            .setDescription("Карта прибывшего")
                                            .setColor("#388e3c")
                                            .addField("Рабочий:", `<@${niger.user.id}>. ID: ${niger.user.id}`)
                                            .addField("Из:", `${niger.voiceChannel}`)));
            });

            logschannel.send(new Discord.RichEmbed()
            .setDescription("~Сбор~")
            .setColor("#9a0007")
            .addField("Повод:", "Обед")
            .addField("Ответственный:", `НКВД: <@${message.author.id}>. ID: ${message.author.id}`)
            .addField("Место:", dinnerRoom)
            .addField("Время сбора:", message.createdAt)
            .addField("Комменатрии ответственного:", activityReason?activityReason:"Срочная необходимость"));
        }
        else if (cmd === `${prefix}коллаборационист`){
            message.delete();
            let newWorker = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
            if (!newWorker) return message.channel.send("Отряд уже в пути").then(msg => {
                msg.delete(180000);
            });
            if (message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0])).roles.exists('name', "В гулаге")) return message.channel.send(`<@${message.member.id}>, <@${newWorker.id}> уже на содержании`).then(msg => {
                msg.delete(180000);
            });
            if (!message.member.roles.exists('name', "НКВД")) return message.channel.send(`<@${message.member.id}>, Жить типо надоело?`).then(msg => {
                msg.delete(180000);
            });

            logschannel = goolag.children.find('name', "logs")
            if (!logschannel) return message.channel.send(`<@${message.member.id}>, Сука, киноленту-то вставь`).then(msg => {
                msg.delete(180000);
            });

            let workReason = args.join(" ").slice(22);
            if (newWorker.roles.exists('name', "НКВД")){ 
                logschannel.send(new Discord.RichEmbed()
                .setDescription("~Рапорт~")
                .setColor("#9a0007")
                .addField("Крыса:", `<@${message.author.id}>. ID: ${message.author.id}`)
                .addField("Рапорт из:", message.channel)
                .addField("Время подачи:", message.createdAt)
                .addField("Суть:", workReason?workReason:"Ну, он это, собак ебет"));
                return message.channel.send(`<@${message.member.id}>, Рапорт накатан`).then(msg => {
                    msg.delete(180000);});
            }
            message.channel.send(`<@${newWorker.id}> теперь офицально трудоустроен! Ваша семья в надежных руках!`);
            logschannel.send(new Discord.RichEmbed()
                .setDescription("~Трудоустройство~")
                .setColor("#9a0007")
                .addField("Трудоустроен:", `<@${newWorker.id}>. ID: ${newWorker.id}`)
                .addField("Ответственный:", `<@${message.author.id}>. ID: ${message.author.id}`)
                .addField("Трансфер из:", message.channel)
                .addField("Время трансфера:", message.createdAt)
                .addField("Причина трудоустройства:", workReason?workReason:"Ну, он это, собак ебет"));
            newWorker.addRole(servers[message.guild.id].jail);
        }
        else if (cmd === `${prefix}help`){
            message.delete();
            helpEmbed = new Discord.RichEmbed()
            .setDescription("Команды")
            .setColor("#e56b00")
            .addField("Кара:", "!вставить <to> <reason>(opt) - gag\n!вытащить <from> <reason>(opt) - ungag")
            .addField("Разное:", "!help - список команды\n!тролльнуть - када делать нехуй");
            if (message.member.roles.exists('name', "Тролль")){
                helpEmbed.addField("Тролль:", `!тролльнуть <victim>(opt) <Your trolling>(opt) - нацеленный удар`);
            }
            if (message.member.roles.exists('name', "НКВД")){
                helpEmbed.addField("НКВД:")
                .addField("Трудоустройство:", "!коллаборационист <who> <reason>(opt) - работа на шахте. Семья в могиле")
                .addField("ГУЛАГ:", "!обед <reason>(opt) - сбор");
            }
            message.channel.send(helpEmbed)
            .then(msg => {
                msg.delete(180000);
            });
        }
        else if (cmd === `${prefix}тролльнуть`){
            message.delete();
            trollPhr = phrases["trolling"]
            let victim = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
            if (victim) {
                if (message.member.roles.exists('name', "Тролль")){
                    let realTrolling = args.join(" ").slice(22);
                    if (realTrolling)
                        return message.channel.send(`<@${victim.id}>, ${realTrolling}`);
                    else
                        return message.channel.send(`<@${victim.id}>, ${trollPhr[Math.floor(Math.random()*trollPhr.length)]["phrase"]}`);
                }
                else
                    return message.reply(`${trollPhr[Math.floor(Math.random()*trollPhr.length)]["phrase"]}`);
            }
            else
                return message.reply(`${trollPhr[Math.floor(Math.random()*trollPhr.length)]["phrase"]}`);
        }
        else if (cmd  === `${prefix}голосование`){
            message.delete();
            if (args.join(" ").search('"') == -1) return message.reply("Регламент соблюдай").then(msg => msg.delete(180000))
            let vote = args.join(" ").split('"');
            let question = vote[1];
            if (!question) return message.reply("Вопрос то какой?").then(msg => msg.delete(180000))
            voteEmbed = new Discord.RichEmbed()
            .setDescription(`Голосование by <@${message.member.id}>`)
            .setColor("#e56b00")
            .addField("Вопрос:", question);
            let vars = vote[2].split(" ").filter(v => v !== "");
            if (vars.length == 0 || vars.length > 7) return message.reply("Регламент соблюдай").then(msg => msg.delete(180000))
            let varsStr = "";
            (vars.slice(0, 5)).forEach((variant, num) => {
                varsStr += (num + 1) + ": " + variant + "\n";
            });
            voteEmbed.addField('Варианты:', varsStr);
            message.channel.send(voteEmbed).then(msg => msg.delete(60000));
            let users = ""
            old = JSON.stringify(votes).substr(0, JSON.stringify(votes).length - 1);
            if (old[old.length - 1] === "}")
                old += ","
            fs.writeFile("votes.json", JSON.stringify(JSON.parse(old + `"${message.id}":{"vars":[{"name":"${vars.slice(0, 5).join('"},name":"')}"}],"users":[]}}`)), 
                        function(err) {
                            if (err) {
                                console.log(err);
                            }
                        });
            let max = 4, time = 60000
            // if (vars[0]){ let max = parseInt(vars[0])}
            // if (vars[1] && (parseInt(vars) > 60000)) {let time = parseInt(vars[1])}
            message.channel.awaitMessages(msg => msg.content.startsWith("!за"), { max: max, time: time, errors: ['time'] })
                .then(collected => {console.log(collected)})
                .catch(collected => console.log(`After a minute, only ${collected.size} out of 4 voted.`));
        }
        else if (cmd.startsWith(prefix)){
            message.delete();
        }
    }
});

bot.login(botconfig.token);
