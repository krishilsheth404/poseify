//dunzo parcel price getter automation
const puppeteer = require('puppeteer')
const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware 
const cheerio=require('cheerio');
const fs = require('fs');
const ejs = require("ejs");
const { url } = require('inspector');
const { fail } = require('assert');

app.set('view engine', 'ejs');
app.set('views', './');

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
async function bigbasket(url) {
    try {
        // Fetching HTML
        console.log(url);
        const browser = await puppeteer.launch({
            args : [ 
               '--no-sandbox',
               '--disable-setuid-sandbox',
            ]
        });;
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
        await browser.close();
        return{
            name:'BigBasket',
            item:n,
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
        const browser = await puppeteer.launch({
            args : [ 
               '--no-sandbox',
               '--disable-setuid-sandbox',
            ]
        });;
         const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2' });
            const data = await page.evaluate(() => document.querySelector('*').outerHTML);

            let name=await page.waitForSelector('.product-title');
            name=await page.evaluate(el => el.textContent, name);
        //   console.log(name);
          
          let price=await page.waitForSelector('.offer_price');
            price=await page.evaluate(el => el.textContent, price);

            //.product-img for image of product 

            // console.log("got the link for zomato");
            // await browser.close();
            // console.log(data)
            // Using cheerio to extract <a> tags
            // var n=$('.prod-name >a').first().text() +' '
            // n+= $('.qnty-selection div span').first().text();
            // console.log($.html());
            await browser.close();
        return{
            name:'StarQuick',
            item:name,
            price:price,
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
        const browser = await puppeteer.launch({
            args : [ 
               '--no-sandbox',
               '--disable-setuid-sandbox',
            ]
        });;

         const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2' });
            const data = await page.evaluate(() => document.querySelector('*').outerHTML);

            let name=await page.waitForSelector('.clsgetname');
            name=await page.evaluate(el => el.textContent, name);
        //   console.log(name);
          
          let price=await page.waitForSelector('#final_price');
            price=await page.evaluate(el => el.textContent, price);

          
            await browser.close();
        return{
            name:'jioMart',
            item:name,
            price:price,
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
        const browser = await puppeteer.launch({
            args : [ 
               '--no-sandbox',
               '--disable-setuid-sandbox',
            ]
        });;
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        const data = await page.evaluate(() => document.querySelector('*').outerHTML);
        console.log("got the data from kimaye");
        
        // console.log(data)
        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // var n=$('.prod-name >a').first().text() +' '
        // n+= $('.qnty-selection div span').first().text();
        // console.log($.html());
        // await broqwer.close();
        await browser.close();
        return{
            name:'Kimaye',
            item:$('.product-title').first().text(),
            price:$('.price-Mumbai').first().text(),
        }
        
    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        console.log(error);
    }
}

app.post('/result', async (req, res) => {
    // Insert Login Code Here
    const nameOfFruit = req.body.fav + '\n';
    const urlForBB = `https://www.bigbasket.com/ps/?q=${nameOfFruit}`
    const urlForStar = `https://www.starquik.com/search/${nameOfFruit}`
    const urlForJiomart=`https://www.jiomart.com/catalogsearch/result?q=${nameOfFruit}`;
    const urlForKimaye=`https://kimaye.com/search?q=${nameOfFruit}&type=product`;

    var final=[];
   
    const promise1=bigbasket(urlForBB);
    const promise2=starquik(urlForStar);
    const promise3=jiomart(urlForJiomart);
    const promise4=kimaye(urlForKimaye);
    await Promise.all([promise1, promise2, promise3,promise4]).then((values) => {
        final.push(values[0])
        final.push(values[1])
        final.push(values[2])
        final.push(values[3])
      });
    
    // await Promise.all([final.push(await bigbasket(urlForBB)),final.push(await jiomart(urlForJiomart)),
    //     final.push(await starquik(urlForStar)),final.push(await kimaye(urlForKimaye))])
    
    //     await Promise.all([final.push(await bigbasket(urlForBB)),final.push(await jiomart(urlForJiomart)),
    //     final.push(await starquik(urlForStar)),final.push(await kimaye(urlForKimaye))])
    
    final.sort((a, b) => a.price - b.price); // b - a for reverse sort
    console.log(final);
    final.push(nameOfFruit)
    res.render(__dirname+'/final', { final: final });
});

const port = process.env.PORT || 5000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));