const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const http = require('http');
const https = require('https');
http.createServer().listen(process.env.PORT || 5000).on('request', function(req, res){
    res.end('')
});
setInterval(function(){
    https.get('https://telegram-bot-danit.herokuapp.com')
},300000);

// replace the value below with the Telegram token you receive from @BotFather
const token = '625443142:AAHoCk3zJbg9sHkGkiznAJcVhxsDZsEnATI';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// bot.on('')
// const needZero = num => num > 9 ? `${num}` : `0${num}`;

// const deadline = 1552417200;
//
// bot.on('message', msg => {
//     const id = msg.chat.id;
//     console.log(msg)
//     const myDate = new Date(msg.date);
//     const lastTime = deadline - myDate;
//     const hours = needZero((lastTime / 3600).toFixed(0));
//     const minets = needZero((lastTime % 3600 / 60).toFixed(0));
//     const second = needZero((lastTime % 60).toFixed(0));
//     bot.sendMessage(id, `Вам осталось жить ${hours}:${minets}:${second}`)
// });
bot.onText(/\/start/, (msg) =>{
    const chatId = msg.chat.id;
    console.log(msg);
    bot.sendMessage(chatId, 'Что вас интересует?', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Курс валют",
                        callback_data: '/curse'
                    },
                    {
                        text: "Погода",
                        callback_data: "/weather"
                    }
                ]
            ]
        }
    })
});

bot.on('callback_query', query => {
    const id = query.message.chat.id;
    console.log(query.data);
    switch (query.data) {
        case '/curse':
            bot.sendMessage(id, 'Какая валюта вас интересует?', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'EUR',
                                callback_data: 'EUR'
                            },
                            {
                                text: 'USD',
                                callback_data: 'USD'
                            },
                            {
                                text: 'RUR',
                                callback_data: 'RUR'
                            },
                            {
                                text: 'BTC',
                                callback_data: 'BTC'
                            }
                        ]
                    ]
                }
            });
            break;
    }
    bot.on('callback_query', query => {
        const id = query.message.chat.id;
        request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', function (err, response, body) {
            const data = JSON.parse(body);
            const result = data.filter(elem => {
                return elem.ccy === query.data;
            })[0];
            const flag = {
                "UAH": "🇺🇦",
                "EUR": "🇪🇺",
                "USD": "🇺🇸",
                "RUR": "🇷🇺",
                "BTC": "₿"
            };
            let markDown = `
            *${flag[result.ccy]} ${result.ccy}     ${result.base_ccy} ${flag[result.base_ccy]}*
            Buy: _${(result.buy)}_
            Sale: _${(result.sale)}_
        `;
            bot.sendMessage(id, markDown, {parse_mode: 'Markdown'})
        })
    });
})

// bot.onText(/\/curse/, (msg, match) => {
//     const chatId = msg.chat.id;
//     bot.sendMessage(chatId, 'Какая валюта вас интересует?', {
//         reply_markup: {
//             inline_keyboard: [
//                 [
//                     {
//                         text: 'EUR',
//                         callback_data: 'EUR'
//                     },
//                     {
//                         text: 'USD',
//                         callback_data: 'USD'
//                     },
//                     {
//                         text: 'RUR',
//                         callback_data: 'RUR'
//                     },
//                     {
//                         text: 'BTC',
//                         callback_data: 'BTC'
//                     }
//                 ]
//             ]
//         }
//     });
// });

