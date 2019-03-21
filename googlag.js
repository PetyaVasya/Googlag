const Discord = require('./discord.js')
const botconfig = require('./botconfig.json');

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
        let prefix = botconfig.prefix;
        let messageArray = message.content.split(" ");
        let cmd = messageArray[0];
        let args = messageArray.slice(1);
        let goolag = message.guild.channels.find(channel => channel.name == "Гулаг" && channel.type == "category");
        if(cmd === `${prefix}вставить`){
            message.delete();
            let userWithProblem = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
            if (!userWithProblem) return message.channel.send("Выбери живую жертву").then(msg => {
                msg.delete(180000);
            });
            if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Опа, еще один стахановец?").then(msg => {
                msg.delete(180000);
            });
            if (userWithProblem.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Товарищу присунуть решил?").then(msg => {
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
            if (!logschannel) return message.channel.send("Сука, киноленту-то вставь").then(msg => {
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
            if (!userWithProblem) return message.channel.send("Отряд уже в пути").then(msg => {
                msg.delete(180000);
            });
            if (!message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0])).mute) return message.channel.send("Уложить его? Это с легкостью").then(msg => {
                msg.delete(180000);
            });
            if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Опа, еще один стахановец?").then(msg => {
                msg.delete(180000);
            });
            if (userWithProblem.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Товарищу присунуть решил?").then(msg => {
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
            .addField("Комменатрии врача:", helpReason?helpReason:"В экстазе");
            
            logschannel = message.guild.channels.find('name', "logs");
            if (!logschannel) return message.channel.send("Сука, киноленту-то вставь").then(msg => {
                msg.delete(180000);
            })
            
            logschannel.send(helpEmbed);

            message.guild.member(userWithProblem).setMute(true, problemReason);
            // message.channel.send("");
        }
        else if (cmd == `${prefix}обед` && (goolag.children.exists('id', message.channel.id))){
            message.delete();
            if (!message.member.roles.exists('name', "НКВД")) return
            let dinnerRoom = goolag.children.find(channel => channel.name == "Столовка" && channel.type == "voice");
            if (!dinnerRoom) return message.channel.send("Расходимся поцаны, пока только галька").then(msg => {
                msg.delete(180000);
            });
            let places = goolag.children.filter(function(c){return (c.type == "voice") && (c.name != "Столовка")});
            if (!places) return message.channel.send("Всех уже приняли").then(msg => {
                msg.delete(180000);
            });
            let nigers = new Discord.Collection();
            places.forEach(element => {
                nigers = nigers.concat(element.members);
            });

            let activityReason = args.join(" ");

            // Прочесываем рядовых
            nigers = nigers.filter(function(c){return !c.roles.exists('name', 'НКВД')})
            if (nigers.length == 0) return message.channel.send("Всех уже приняли").then(msg => {
                msg.delete(180000);
            });

            let dinnerchat = goolag.children.find(channel => channel.name == "столовка" && channel.type == "text")
            if (!dinnerchat) return message.channel.send('Немые еще и ослепли').then(msg => {
                msg.delete(180000);
            });
            logschannel = goolag.children.find('name', "logs")
            if (!logschannel) return message.channel.send("Сука, киноленту-то вставь").then(msg => {
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
        else if (cmd === `${prefix}help`){
            message.delete();
            message.channel.send(new Discord.RichEmbed()
            .setDescription("Команды")
            .setColor("#e56b00")
            .addField("Кара:", "!вставить - gag\n!вытащить - ungag")
            .addField("Разное:", "!help - список команды")
            .addField("НКВД")
            .addField("ГУЛАГ:", "!обед - сбор"))
            .then(msg => {
                msg.delete(180000);
            });
        }
    }
});

bot.login(botconfig.token);
