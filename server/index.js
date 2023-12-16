const express = require('express');
const nodemailer = require('nodemailer');
const OpenAI = require('openai');
const schedule = require('node-schedule');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

let lastChatCompletionResult = null;
let articleSubject = 'Why it\'s important to have a good Realtor, Real estate news in florida, National real estate news (USA), Real estate news for the emerald coast, Real estate news for Panama City Beach, Real estate news for 30A Florida, Real estate news for Panama City';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

const sendEmail = async (subject) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'andriy14881999@gmail.com',
      pass: 'iloekazbyenjfiur'
    }
  });

  const chatCompletion = await openai.chat.completions.create({ 
    messages: [{ role: 'user', content: `${subject} - Generate an article on one of these topics.` || "Say this is a test" }], 
    model: 'gpt-3.5-turbo',
    temperature: 0.9,
  });

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to: 'andriy14881999@gmail.com',
    subject: "Generated Article",
    text: chatCompletion.choices[0].message.content,
  });

  lastChatCompletionResult = chatCompletion.choices[0].message.content

  console.log("Message sent: %s", info.messageId);
};

app.get('/getChatCompletionResult', (req, res) => {
  res.json({ 
    article: lastChatCompletionResult, 
    subject: articleSubject
  });
});

app.post('/setChatCompletionSubject', (req, res) => {
  const { subject } = req.body;
  articleSubject = subject;

  res.json({ result: articleSubject });
});

const job = schedule.scheduleJob('0 * * * *', () => {
  sendEmail();
});

app.listen(port, () => {
  console.log(`Сервер слухає на порту ${port}`);
});