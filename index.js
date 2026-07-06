require('dotenv').config();

const express = require('express');
const { messagingApi, middleware } = require('@line/bot-sdk');

const app = express();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

app.get('/', (req, res) => {
  res.send('LINE Bot is running');
});

app.post('/webhook', middleware(config), async (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.status(200).end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

async function replyText(replyToken, text) {
  return client.replyMessage({
    replyToken,
    messages: [{ type: 'text', text }],
  });
}

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return null;
  }

  const text = event.message.text.trim();

if (text === '我要開版') {
  return replyText(
    event.replyToken,
`信用審核資料如下👇

1.身分證正反面（可浮水印）

2.存簿封面（可浮水印）

3.資料填寫

姓名：
電話：
現居地址：
戶籍地址：
工作：
每個月薪資：
緊急聯絡人1：
緊急聯絡人2：

畢竟您要開版賺錢，我要會員人數
資料保密，沒必要造成公司困擾謝謝

以上資料填寫後回傳，待客服驗證`
  );
}

  if (text === '活動登記') {
    return replyText(event.replyToken, '請留下你的暱稱與要參加的活動，客服會協助你登記。');
  }

  if (text === '問題回報') {
    return replyText(event.replyToken, '請描述你遇到的問題，客服會盡快協助你處理。');
  }

  return replyText(event.replyToken, '請點選下方圖文選單，或輸入：我要開版、活動登記、問題回報。');
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`LINE Bot running on port ${port}`);
});
