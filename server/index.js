const express = require('express');
const nodemailer = require('nodemailer');
const OpenAI = require('openai');
const schedule = require('node-schedule');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

let lastChatCompletionResult = null;
let generatedPhoto = null;
let articleSubject = 'Why it\'s important to have a good Realtor, Real estate news in florida, National real estate news (USA), Real estate news for the emerald coast, Real estate news for Panama City Beach, Real estate news for 30A Florida, Real estate news for Panama City';
let exampleArticle = '';
let photoSubject = 'Real estate'

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

  const articleForSend = exampleArticle.trim() !== ''
    ? `${subject} - Generate an article on one of these topics with emojis. Here is an example article: ${exampleArticle}`
    : `${subject} - Generate an article on one of these topics with emojis.`

  const chatCompletion = await openai.chat.completions.create({ 
    messages: [{ role: 'user', content: articleForSend || 'Say this is a test' }], 
    model: 'gpt-4-1106-preview',
    temperature: 0.1,
  });

  const { data } = await axios.get(`${process.env.UNSPLASH_BASE_URL}/photos/random/?client_id=${process.env.UNSPLASH_CLIENT_ID}&query=${photoSubject}`)

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to: 'andriy14881999@gmail.com',
    subject: "Generated Article",
    text: chatCompletion.choices[0].message.content,
  });


  lastChatCompletionResult = chatCompletion.choices[0].message.content
  generatedPhoto = data?.urls?.full

  console.log("Message sent: %s", info.messageId);
};

app.get('/getChatCompletionResult', (req, res) => {
  res.json({ 
    article: lastChatCompletionResult, 
    subject: articleSubject,
    imageSubject: photoSubject,
    photo: generatedPhoto,
    exArticle: exampleArticle
  });
});

app.post('/setChatCompletionSubject', (req, res) => {
  const { subject, imageSubject, exampleArticle: exArticle } = req.body;
  articleSubject = subject;
  photoSubject = imageSubject
  exampleArticle = exArticle

  res.json({ result: { articleSubject, photoSubject, exArticle} });
});

const job = schedule.scheduleJob('0 * * * *', () => {
  sendEmail();
});

// For testing
// const job = schedule.scheduleJob('*/1 * * * *', () => {
//   sendEmail();
// });

app.listen(port, () => {
  console.log(`Сервер слухає на порту ${port}`);
});