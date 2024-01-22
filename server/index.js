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
let articleSubject = 'Make a catchy Facebook post about Real Estate News in Florida. The post needs to use emoji’s, use real article data. The post needs to be structured as this: Brief description of Florida Real Estate update, Why this information is import for the consumer, and a takeaway. Lastly, to comply with Florida real estate advertising laws I need to display my name, number, and brokerage at the bottom of my post as follows: Dylan Smith | Realtor | 865-604-6654 | Realty ONE Group Emerald Coast';
let exampleArticle = 'The pace fell significantly short of expectations on Wall Street. Economists had forecast new-home sales to total 688,000 in November. New-home sales are at the lowest level since November 2022. The rate of new-home sales was dragged down by sharp drops in the South and the West. The data from October was revised. New-home sales fell a revised 4% in October, compared with the initial estimate of a 5.6% drop. The new-home sales data are volatile month over month and are often revised. Key details: The median sales price of a new home sold in November rose to $434,700 from $414,900 in the prior the month. The supply of new homes for sale rose 16.5% between October and November, equating to a 9.2-month supply. Half of the nation reported an increase in new-home sales, with the Midwest posting the biggest gains at 25%, followed by the Northeast at 3.1%. Sales fell in the South by 20.9% and in the West by 5.1%. Overall, sales of new homes are up 1.4% compared with last year. Big picture: Housing data can be noisy, so this month’s fall in new-home sales may be an aberration. That won’t be known until a trend develops. Aside from the bleak number, the U.S. housing market is overall showing early signs of a recovery as mortgage rates fall significantly in December and home-buying demand ticks up. And rates are poised to fall further, based on economists’ estimates. With a lack of resale inventory persisting, home builders are in a strong position to meet increasing buyer demand—and they’re responding. Housing starts jumped 15% in November, a sign that builders are ramping up construction on new housing units. What are they saying? “The significant decline in new-home sales in the largest region of the country, the South, drove this month’s new-home sales report into negative territory,” analysts at Raymond James wrote in a note. “This was the largest month-over-month decline since April of 2022.” Market reaction: Stocks were up in early trading on Friday. The yield on the 10-year Treasury note was below 3.9%. Shares of builders, including D.R. Horton Inc., Lennar Corp., PulteGroup Inc. and Toll Brothers Inc. were up in the morning trading session. MarketWatch, the place where you can find the latest stock market, financial and business news. Cryptocurrency is trending now, get the latest info on Bitcoin, Ethereum, and XRP.';
let photoSubject = 'Real estate Florida'

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
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
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
    to: process.env.SMTP_USER,
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

const job = schedule.scheduleJob('0 */72 * * *', () => {
  sendEmail();
});

// For testing
// const job = schedule.scheduleJob('*/1 * * * *', () => {
//   sendEmail();
// });

app.listen(port, () => {
  console.log(`Сервер слухає на порту ${port}`);
});