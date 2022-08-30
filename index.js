//dunzo parcel price getter automation
const puppeteer = require('puppeteer')
const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware 
const fs = require('fs');

const { AddressContext } = require('twilio/lib/rest/api/v2010/account/address');
const { getElementsByTagType } = require('domutils');

app.set('view engine', 'ejs');
// app.set('views', './');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// var newItem;
// Route to Login Page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});
app.post('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/result', async (req, res) => {
    // Insert Login Code Here
    const nameOfFruit = req.body.dataOfMed + '\n';
    const url = `https://www.bigbasket.com/ps/?q=${nameOfFruit}`
    const url1 = `https://www.starquik.com/search/${nameOfFruit}`

    var final=[];
    const browser = await puppeteer.launch({ headless: false });

    async function bigbasket() {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        console.log('started for bigbasket')

        const item = await page.$('.item:nth-child(1)')
        let value = await page.evaluate(el => el.textContent, item)
        final.push({name:value});
        console.log("Bigbasket - > "+value);
        await page.close();
    }
    async function starquik(){
        const page = await browser.newPage();
        await page.goto(url1, { waitUntil: 'networkidle2' });
        
        console.log('started for starquick')
        
        var item = await page.$('.cat-items div:nth-child(1) .product-title')
        value = await page.evaluate(el => el.textContent, item)

    item = await page.$('.cat-items div:nth-child(1) .offer_price')
    value += await page.evaluate(el => el.textContent, item)
 final.push({name:value});
    console.log("StarQuick - > "+value);
    }


    promise1 = bigbasket();
    promise2 = starquik();

    await Promise.all([promise1, promise2])
    console.log(final);
    res.render('final', { final: final });
    await browser.close();
});

const port = process.env.PORT || 5000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));
