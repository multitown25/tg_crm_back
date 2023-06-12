const Category = require('./Category');
const TelegramBot = require("node-telegram-bot-api");
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fetch = require('node-fetch');

const token = '6197761076:AAHHIYc-S1uiKUkN2IHYttrRcN2lnOkx-74';
const webAppUrl = 'https://restaurant-react-system.netlify.app';

const bot = new TelegramBot(token, {polling: true});
const app = express();

const mongoURI = 'mongodb://5.101.51.105/restaurant';

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB has connected'))
    .catch(error => console.log(error))

// const authorization = 'https://vk.com/r_whoust';
let authorized = false;

app.use('/uploads', express.static(`${__dirname}/uploads`));
app.use(express.json());
app.use(cors());

const username = 'andrew@mail.ru';
const password = '1234567';

const getCategories = async () => {
    // const baseURL = 'http://5.101.51.105/api'
    // // const categories = await fetch(new URL('/api/categories', baseURL)
    // //     .then(res => res.text())
    // //     .then(body => console.log(body));
    // let response = await fetch(new URL('/category', baseURL));
    // let responseJson = await response.text()
    // console.log(responseJson);
    const categories = await Category.find();
    return categories;
}

// const authentication = async () => {
//     const baseURL = 'http://5.101.51.105'
//     const categories = await fetch(new URL('/categories', baseURL), {
//         method: 'GET',
//         headers:  {
//             'Content-type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         }
//     });
//     console.log(categories);
// }

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        //await authentication();
        await bot.sendMessage(chatId, 'Новый заказ', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Добавить заказ', web_app: {url: webAppUrl}}]
                ]
            }
        });
    }
});

app.get('/getCategories', async (req, res) => {
    const categories = await getCategories();
    res.status(200).json(categories)
});
app.post('/create-order', async (req, res) => {
    const {queryId, addedItems, totalPrice} = req.body;

    // add order to db

    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Добавление нового заказа',
            input_message_content: {
                message_text: `Заказ номер 54 добавлен. Общая сумма заказа: ${totalPrice}`
            }
        });
        return res.status(200).json({});
    } catch (err) {
        return res.status(500).json({});
    }
})

const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))