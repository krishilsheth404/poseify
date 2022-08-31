//dunzo parcel price getter automation
const puppeteer = require('puppeteer')
const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware 
const cheerio=require('cheerio');
const fs = require('fs');
const ejs = require("ejs");

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
    const nameOfFruit = req.body.foodItem + '\n';
    const urlForBB = `https://www.bigbasket.com/ps/?q=${nameOfFruit}`
    const urlForStar = `https://www.starquik.com/search/${nameOfFruit}`
    const urlForJiomart=`https://www.jiomart.com/catalogsearch/result?q=${nameOfFruit}`;
    const urlForKimaye=`https://kimaye.com/search?q=${nameOfFruit}&type=product`;

    var final=[];
    const browser = await puppeteer.launch({
        args : [ 
           '--no-sandbox',
           '--disable-setuid-sandbox',
        ]
    });;
    
    async function bigbasket(url) {
        try {
            // Fetching HTML
            console.log(url);

             const page = await browser.newPage();
                await page.goto(url, { waitUntil: 'networkidle2' });
                const data = await page.evaluate(() => document.querySelector('*').outerHTML);
                console.log("got the data from bigbasket");
                // await browser.close();
                // console.log(data)
                // await page.close();
                // Using cheerio to extract <a> tags
                const $ = cheerio.load(data);
            var n=$('.prod-name >a').first().text() +' '
            n+= $('.qnty-selection div span').first().text();
            // console.log($.html());
            return{
                title:'BigBasket',
                name:n,
                price:$('.discnt-price').first().text(),
            }
            
        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            console.log(error);
        }
    }
    async function starquik(url){
        try {
            // Fetching HTML
            console.log(url);

             const page = await browser.newPage();
                await page.goto(url, { waitUntil: 'networkidle2' });
                
                const data = await page.evaluate(() => document.querySelector('*').outerHTML);
                console.log("got the data from starquick");
                // await browser.close();
                // console.log(data)
                // await page.close();
                // Using cheerio to extract <a> tags
                const $ = cheerio.load(data);
            // var n=$('.prod-name >a').first().text() +' '
            // n+= $('.qnty-selection div span').first().text();
            // console.log($.html());
            return{
                title:'StarQuick',
                name:$('.product-title').first().text(),
                price:$('.offer_price').first().text(),
            }
            
        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            console.log(error);
        }
    }
    async function jiomart(url){
        try {
            // Fetching HTML
            console.log(url);

             const page = await browser.newPage();
             await page.goto(url, { waitUntil: 'networkidle2' });
             const data = await page.evaluate(() => document.querySelector('*').outerHTML);
             console.log("got the data from jiomart");
             // await page.close();
             // console.log(data)
             // await page.close();
             // Using cheerio to extract <a> tags
             const $ = cheerio.load(data);
             // console.log($.html());
             return{
                 title:'Jiomart',
                 name:$('.clsgetname').first().text(),
                 price:$('#final_price').first().text(),
                }
            } catch (error) {
                // res.sendFile(__dirname + '/try.html');
            console.log(error);
        }
    };
    async function kimaye(url)
    {
        try {
            // Fetching HTML
            console.log(url);
            
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2' });
            const data = await page.evaluate(() => document.querySelector('*').outerHTML);
            console.log("got the data from kimaye");
            // await browser.close();
            // console.log(data)
            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            // var n=$('.prod-name >a').first().text() +' '
                // n+= $('.qnty-selection div span').first().text();
                // console.log($.html());
                // await page.close();
            return{
                title:'Kimaye',
                name:$('.product-title').first().text(),
                price:$('.price-Mumbai').first().text(),
            }
            
        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            console.log(error);
        }
    }
    const promise1=await bigbasket(urlForBB);
    const promise2=await jiomart(urlForJiomart);
    const promise3=await starquik(urlForStar);
    const promise4=await kimaye(urlForKimaye);
    await Promise.all([promise1, promise2, promise3,promise4]).then((values,index) => {
        final.push(values[0]);
        final.push(values[1]);
        final.push(values[2]);
        final.push(values[3]);
      });
    
    // await Promise.all([final.push(await bigbasket(urlForBB)),final.push(await jiomart(urlForJiomart)),
    //     final.push(await starquik(urlForStar)),final.push(await kimaye(urlForKimaye))])
    
    //     await Promise.all([final.push(await bigbasket(urlForBB)),final.push(await jiomart(urlForJiomart)),
    //     final.push(await starquik(urlForStar)),final.push(await kimaye(urlForKimaye))])
    
    console.log(final);
    res.render('final', { final: final });
    await browser.close();
});

const port = process.env.PORT || 5000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));
