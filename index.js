//dunzo parcel price getter automation
const puppeteer = require('puppeteer')
const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware 
const cheerio=require('cheerio');
const { raw } = require('body-parser');
var urlForZomato = `https://medicomp.herokuapp.com`;
        // urlForZomato = urlForZomato.split(' ').join('+')

app.set('view engine', 'ejs');
// app.set('views', './');

var urlForSwiggy, urlForZomato;
var extractLinksOfSwiggy, extractLinksOfZomato, matchedDishes = {};
var matchedDishesForSwiggy, matchedDishesForZomato, tempAddress, discCodesForZomato, addr, linkOld = '';
var z, s, w;
var sdfd, tempurl, tempurl2;
var Offers = 0;
var final = [];
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

app.post('/result', async(req, res) => {
    // Insert Login Code Here   
    const nameOfMed = req.body.dataOfMed + '\n';
    const browser = await puppeteer.launch({
        args : [ 
            '--no-sandbox',
            '--disable-setuid-sandbox',
         ]
        
    });;
    extractLinksOfZomato = async(url) => {
        try {
            // Fetching HTML
            console.log(url);
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2' });
            await page.waitForSelector('#foodItem');
            await page.$eval('#foodItem', el => el.value = 'Start');

            await page.waitForSelector('#form-submit');
            try{
                await page.click('#form-submit');
                console.log('clicked');
            }catch(e){
                 console.log('error');
            }

            await page.waitForTimeout(1000);
            // const data = await page.evaluate(() => document.querySelector('*').outerHTML);
            // console.log("got the data from bigbasket");
            // await browser.close();
            // console.log(data)
            // await page.close();
            // Using cheerio to extract <a> tags
            // const $ = cheerio.load(data);
            // console.log($.html());
            // return{
            //     title:'jioMart',
            //     name:n,
            //     url:imgurl,
            // }
            
        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            console.log(error);
        }
    };
    z = await extractLinksOfZomato(urlForZomato);
    await browser.close();
   
 
});

const port = process.env.PORT || 4000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));
