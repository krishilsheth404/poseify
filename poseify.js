// app using yahoo.com as a search engine
const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware 
const axios = require('axios')
const path = require('path');
const cheerio = require('cheerio')
const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');
const ejs = require("ejs");
const { AddressContext } = require('twilio/lib/rest/api/v2010/account/address');
const { getElementsByTagType } = require('domutils');
const { off } = require('process');
// var urlForSwiggy, urlForZomato;
// var extractLinksOfSwiggy, extractLinksOfZomato, matchedDishes = {};
// var matchedDishesForSwiggy, matchedDishesForZomato, tempAddress, discCodesForZomato, addr, linkOld = '';
// var z, s, w;
// var sdfd, tempurl, tempurl2;
// var Offers = 0;
app.set('view engine', 'ejs');
app.use(express.static(__dirname));
app.set('views', './');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// var newItem;
// Route to Login Page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.post('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.post('/poseify',async(req, res) => {
    var asana=req.body.asanaName;
    const final=[];

    const { data } = await axios.get(req.body.asanaLink)

    // Using cheerio to extract <a> tags
    const $ = cheerio.load(data);
    console.log(req.body.asanaLink);


    $('ol').last().map((i, elm) => {
       final.push({steps:$(elm).text().split('\n')});
       });

       final.push($('picture').attr('data-iesrc'));
       final.push(asana)

       console.log(final);


    if(asana=="Warrior 2 Pose"){
        res.render(__dirname+'/poseResultsForWarrior2Pose',{final:final});
    }else if(asana=="High Lunge, Crescent Variation"){
        res.render(__dirname+'/poseResultsForHighLungeCrescentVariation',{final:final});
    }else if(asana=="Mountain Pose"){
        res.render(__dirname+'/poseResultsForMountainPose',{final:final});
    }else if(asana=="Upward Salute"){
        res.render(__dirname+'/poseResultsForUpwardSalutePose',{final:final});
    }
});
app.post('/types', async (req, res) => {
    // Insert Login Code Here

    const final = [];


    urlForPe = `https://www.yogajournal.com/poses/types/`;

    extractdoe = async (url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url)

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            var temp;
            // BreadCrumb_peBreadCrumb__2CyhJ
            const type=[];
            const typeLink=[];
            const typeImgLink=[];
        
            $('.c-taxonomy-reference article').map((i, elm) => {
             type.push($(elm).text().trim())
            });
            $('.c-taxonomy-reference  .c-block__title a').map((i, elm) => {
             typeLink.push($(elm).attr('href'))
            });
            $('.c-taxonomy-reference article a source[class=true]').map((i, elm) => {
             typeImgLink.push($(elm).first().attr('srcset'))
            });
            // $('.c-taxonomy-reference  .c-block__title').map((i, elm) => {
            //  console.log({img:$(elm).text().trim()})
            // });
        
            for(var i=0;i<type.length;i++){
                final.push({
                  asanaType:type[i],
                  asanaImg:typeImgLink[i],
                  asanaLink:typeLink[i],
                })
            }

            final.sort();
            // final.push(req.body.foodItem);
            console.log(final)

        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            // console.log(error);

            // console.log(error);
            return {};
        }
    };
    await extractdoe(urlForPe);
    res.render(__dirname+'/team', { final: final });
});
app.post('/poses', async (req, res) => {
    // Insert Login Code Here

    const final = [];
    urlForPe = req.body.poseType+"";
    console.log(urlForPe)

    extractdoe = async (url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url)

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            var temp;
            // BreadCrumb_peBreadCrumb__2CyhJ
            const type=[];
            const typeLink=[];
            const typeImgLink=[];
        
            $('.c-atomic-reference  article h3 a').map((i, elm) => {
                type.push($(elm).text().trim())
               });
               $('.c-atomic-reference  article .c-block__title a').map((i, elm) => {
                typeLink.push($(elm).attr('href'))
               });
               $('.c-atomic-reference  article .c-block__media a source[height=500]').map((i, elm) => {
                typeImgLink.push($(elm).first().attr('srcset'))
               });
            // $('.c-taxonomy-reference  .c-block__title').map((i, elm) => {
            //  console.log({img:$(elm).text().trim()})
            // });
        
            for(var i=0;i<type.length;i++){
                final.push({
                  asanaType:type[i],
                  asanaImg:typeImgLink[i],
                  asanaLink:typeLink[i],
                })
            }

            final.sort();
            // final.push(req.body.foodItem);
            console.log(final)

        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            // console.log(error);

            // console.log(error);
            return {};
        }
    };
    await extractdoe(urlForPe);
    res.render(__dirname+'/portfolio', { final: final });
});
app.post('/posearch', async (req, res) => {
    // Insert Login Code Here

    const final = [];
 
   
    res.render(__dirname+'/poseDetection', { final: final });
});



const port = process.env.PORT || 5000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));