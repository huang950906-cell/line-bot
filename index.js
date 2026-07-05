require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');

const app = express();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);

app.get('/', (req, res) => {
  res.send('LINE Bot is running');
});

app.post('/webhook', line.middleware(config), async (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.status(200).end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return null;
  }

  const text = event.message.text.trim();

  if (text === '我要開版') {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '請留下你的暱稱，客服會協助你處理信用註冊。',
    });
  }

  if (text === '活動登記') {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '請留下你的暱稱與要參加的活動，客服會協助你登記。',
    });
  }

  if (text === '問題回報') {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '請描述你遇到的問題，客服會盡快協助你處理。',
    });
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: '請點選下方圖文選單，或輸入：我要開版、活動登記、問題回報。',
  });
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`LINE Bot running on port ${port}`);
});