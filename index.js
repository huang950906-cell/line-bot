
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

// ================================
// 首頁測試
// ================================
app.get('/', (req, res) => {
  res.send('LINE Bot is running');
});

// ================================
// LINE Webhook
// ================================
app.post('/webhook', middleware(config), async (req, res) => {
  try {
    await Promise.all(req.body.events.map(handleEvent));
    res.status(200).end();
  } catch (err) {
    console.error('Webhook 處理失敗：', err);
    res.status(500).end();
  }
});

// ================================
// 純文字回覆
// ================================
async function replyText(replyToken, text) {
  return client.replyMessage({
    replyToken,
    messages: [
      {
        type: 'text',
        text,
      },
    ],
  });
}

// ================================
// 活動圖片 Bubble
// ================================
function createImageBubble(imageUrl) {
  return {
    type: 'bubble',
    size: 'mega',
    hero: {
      type: 'image',
      url: imageUrl,
      size: 'full',
      aspectRatio: '2:3',
      aspectMode: 'cover',
    },
  };
}

// ================================
// 現金註冊 Flex 卡片
// ================================
function createCashRegisterFlex() {
  return {
    type: 'flex',
    altText: '現金註冊',
    contents: {
      type: 'bubble',
      size: 'mega',

      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '20px',
        spacing: 'md',

        contents: [
          {
            type: 'text',
            text: '限時福利✨',
            weight: 'bold',
            size: 'xl',
            color: '#222222',
            align: 'center',
            wrap: true,
          },

          {
            type: 'separator',
            margin: 'sm',
          },

          {
            type: 'text',
            text:
              '儲值 2000 贈 1000 (綁2)\n' +
              '儲值 3000 贈 2000 (綁2)\n' +
              '儲值 5000 贈 3000 (綁2)\n' +
              '以上是信用平台儲值活動🎁',
            size: 'md',
            color: '#444444',
            wrap: true,
            align: 'center',
            margin: 'md',
          },

          {
            type: 'text',
            text: '⚠️ 推薦碼務必輸入（55014）',
            size: 'md',
            color: '#FF3B30',
            weight: 'bold',
            align: 'center',
            margin: 'md',
            wrap: true,
          },

          {
            type: 'button',
            style: 'primary',
            color: '#18C964',
            height: 'sm',
            action: {
              type: 'uri',
              label: '信用平台立即註冊',
              uri: 'http://gm.fl8899.com/hz',
            },
            margin: 'md',
          },

          {
            type: 'separator',
            margin: 'xl',
          },

          {
            type: 'text',
            text: '若你想使用三方儲值',
            weight: 'bold',
            size: 'md',
            color: '#333333',
            align: 'center',
            margin: 'lg',
            wrap: true,
          },

          {
            type: 'text',
            text: '以下是現金版註冊連結👇',
            size: 'md',
            color: '#666666',
            align: 'center',
            wrap: true,
          },

          {
            type: 'text',
            text: '活動只有儲值 2000 贈 1000',
            size: 'md',
            color: '#666666',
            align: 'center',
            margin: 'md',
            wrap: true,
          },

          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'uri',
              label: '現金版立即註冊',
              uri: 'http://trun888.ho666888.com/',
            },
            margin: 'md',
          },
        ],
      },
    },
  };
}

// ================================
// AI分析機器人 Flex 卡片
// ================================
function createAIBotFlex() {
  return {
    type: 'flex',
    altText: 'AI分析機器人',
    contents: {
      type: 'bubble',
      size: 'mega',

      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '24px',
        spacing: 'lg',

        contents: [
          // 標題
          {
            type: 'text',
            text: '🤖 AI分析機器人',
            weight: 'bold',
            size: 'xxl',
            color: '#1F2937',
            align: 'center',
            wrap: true,
          },

          // 分隔線
          {
            type: 'separator',
            margin: 'md',
            color: '#E5E7EB',
          },

          // 介紹內容
          {
            type: 'text',
            text:
              '透過上萬局牌局數據結果\n' +
              '短時間優化下把牌局最合適的走向',
            size: 'md',
            color: '#4B5563',
            align: 'center',
            gravity: 'center',
            wrap: true,
            margin: 'lg',
          },

          // 立即領取 AI 機器人
          {
            type: 'button',
            style: 'primary',
            color: '#18C964',
            height: 'md',
            margin: 'xl',
            action: {
              type: 'uri',
              label: '立即領取AI機器人',
              uri: 'https://lin.ee/WadCzkv',
            },
          },
        ],
      },
    },
  };
}

// ================================
// 處理 LINE 訊息
// ================================
async function handleEvent(event) {

  // 不是文字訊息就不處理
  if (
    event.type !== 'message' ||
    event.message.type !== 'text'
  ) {
    return null;
  }

  const text = event.message.text.trim();

  // ================================
  // 現金註冊
  // ================================
  if (text === '現金註冊') {
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        createCashRegisterFlex(),
      ],
    });
  }

  // ================================
  // 我要開版
  // ================================
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

  // ================================
  // 活動登記
  // ================================
  if (text === '活動登記') {
    return client.replyMessage({
      replyToken: event.replyToken,

      messages: [
        {
          type: 'flex',
          altText: '活動登記',

          contents: {
            type: 'carousel',

            contents: [
              createImageBubble(
                'https://res.cloudinary.com/bl7fhm9c/image/upload/f_auto,q_auto/v1783491150/activity1_fqe5v5.jpg'
              ),

              createImageBubble(
                'https://res.cloudinary.com/bl7fhm9c/image/upload/f_auto,q_auto/v1783491151/activity2_hblfck.jpg'
              ),

              createImageBubble(
                'https://res.cloudinary.com/bl7fhm9c/image/upload/f_auto,q_auto/v1783491150/activity3_ya6pfs.jpg'
              ),

              createImageBubble(
                'https://res.cloudinary.com/bl7fhm9c/image/upload/f_auto,q_auto/v1783491151/activity4_peredy.jpg'
              ),

              createImageBubble(
                'https://res.cloudinary.com/bl7fhm9c/image/upload/f_auto,q_auto/v1783491151/activity5_gmmgcx.jpg'
              ),

              createImageBubble(
                'https://res.cloudinary.com/bl7fhm9c/image/upload/f_auto,q_auto/v1783491151/activity6_bviiyu.jpg'
              ),
            ],
          },
        },

        {
          type: 'text',
          text: `會員帳號：
優惠選項：

稍等客服幫你查詢是否符合領取資格`,
        },
      ],
    });
  }

  // ================================
  // 問題回報
  // ================================
  if (text === '問題回報') {
    return replyText(
      event.replyToken,
      '請描述你遇到的問題，客服會盡快協助你處理。'
    );
  }

  // ================================
  // AI機器人
  // ================================
  if (text === 'AI機器人') {
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        createAIBotFlex(),
      ],
    });
  }

  // ================================
  // 其他一般訊息完全不回覆
  // ================================
  return null;
}

// ================================
// 啟動 Server
// ================================
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`LINE Bot running on port ${port}`);
});
