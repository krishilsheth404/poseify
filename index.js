const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware 
const axios = require('axios')
const cheerio = require('cheerio')
// const puppeteer = require('puppeteer');
// const request = require('request');
// const fs = require('fs');
const ejs = require("ejs");
// const { AddressContext } = require('twilio/lib/rest/api/v2010/account/address');
const { getElementsByTagType } = require('domutils');

app.set('view engine', 'ejs');
app.set('views',__dirname);

app.use(bodyParser.urlencoded({ extended: false }));  //*//
app.use(bodyParser.json());
// var newItem;
// Route to Login Page
app.get('/', (req, res) => {
    // console.log(res)
    res.sendFile(__dirname + '/login.html');
});

// app.post('/', (req, res) => {
//     res.sendFile(__dirname + '/login.html');
// });

app.post('/result', async(req, res) => {

    // app.get('/', (req, res) => {

    const final = []

    extractLinkFromyahoo = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url)
                // console.log(data)

            // Using cheerio to extract <a> tags
            console.log(typeof(data));
            const K = cheerio.load(data);  
            console.log(typeof(K));
            var t = 0;

            K('.searchCenterMiddle li').find('li a').each(function(index, element) {
                if (K(element).text() != 'Cached' && K(element).text() != '') {
                    final.push({
                        link: K(element).attr('href'),
                        title: K(element).text(),
                    });
                }
            });
            console.log(final);

        } catch (error) {
            // console.log(error);
            return 0;
        }
    };

    const s = req.body.search + '\n';
    console.log(s)
    final.push(s);

    await extractLinkFromyahoo(`https://in.search.yahoo.com/search;_ylt=?p=${s}&ad=dirN&o=0`)
    res.render(__dirname+'/final', { final: final })


});
const port = process.env.PORT || 1000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));
