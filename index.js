require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
let urlDatabase = [
  {
    original_url: 'https://www.google.com/',
    short_url: "1",
  },
];

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});
app.post('/api/shorturl', (req, res) => {
  const longUrl = req.body.url;
  console.log(longUrl);
  if (!longUrl) {
    return res.json({ error: 'invalid url' });
  };

  const regex = /^(http|https):\/\/[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/.*)?$|^((http|https):\/\/)?localhost(:[0-9]{1,5})?(\/.*)?$/;

  if(!regex.test(longUrl)) {
    return res.json({ error: 'invalid url' });
  }

  const shortUrl = urlDatabase.length + 1;

  urlDatabase.push({
    original_url: longUrl,
    short_url: shortUrl
  });
  res.json({
    original_url: longUrl,
    short_url: shortUrl
  });
});

app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  const longUrl = urlDatabase.find(url => url.short_url == shortUrl).original_url;
  console.log(longUrl);
  res.redirect(longUrl);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
