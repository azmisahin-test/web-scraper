const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { scrapeAmazon, scrapeBBC } = require('./scraper');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index', { results: [] });
});

app.post('/scrape', async (req, res) => {
    const query = req.body.query;
    const type = req.body.type;
    let results = [];

    try {
        if (type === 'amazon') {
            results = await scrapeAmazon(query);
        } else if (type === 'bbc') {
            results = await scrapeBBC(query);
        }

        res.render('index', { results });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('index', { results: [] });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
