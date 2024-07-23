// app.js
const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});


app.get('/metrics-info', (req, res) => {
  res.render('definition');
});
app.post('/check', async (req, res) => {
  const { url } = req.body;

  const apiKey = process.env.GOOGLE_API_KEY;
  const pagespeedUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

  try {
    const desktopResult = await axios.get(pagespeedUrl, {
      params: {
        url: url,
        key: apiKey,
        strategy: 'desktop',
      },
    });

    const mobileResult = await axios.get(pagespeedUrl, {
      params: {
        url: url,
        key: apiKey,
        strategy: 'mobile',
      },
    });

    res.render('results', { desktopResult: desktopResult.data, mobileResult: mobileResult.data });
  } catch (error) {
    console.error(error);
    res.render('error', { error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
