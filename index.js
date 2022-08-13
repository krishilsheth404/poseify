//dunzo parcel price getter automation
const puppeteer = require('puppeteer')
const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware 

url = 'https://www.dunzo.com/mumbai/send-packages'
url1= 'https://porter.in/bike-parcel-delivery-mumbai'

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

app.post('/result', async(req, res) => {
    // Insert Login Code Here
    const nameOfMed = req.body.dataOfMed + '\n';

    var final;
    const browser = await puppeteer.launch({ headless: true });
 
    async function dunzo() {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        await page.waitForTimeout(3000);
        console.log('started')

        await page.waitForSelector('.fVkmJL')
        await page.click('.fVkmJL')

        try {
            await page.waitForSelector('.bIlSir')
            await page.type('.bIlSir', '400026')

            await page.waitForSelector('.hqIdmi')
            await page.click('.hqIdmi')

            await page.waitForSelector('.kcSRbj')
            await page.click('.kcSRbj')

            await page.waitForSelector('.bpyVvo')
            await page.type('.bpyVvo', 'm')

            await page.keyboard.press('Enter');
        } catch (e) {
            console.log('error');
        }

        await page.waitForTimeout(3000);
        console.log('part 1 over')


        await page.waitForSelector('.lfHqJN > .hEolHO')
        await page.click('.lfHqJN > .hEolHO')

        await page.waitForSelector('.sc-1pv5wjx-2')
        await page.type('.sc-1pv5wjx-2', '400004')

        await page.waitForSelector('.hqIdmi')
        await page.click('.hqIdmi')

        await page.waitForSelector('.kcSRbj')
        await page.click('.kcSRbj')

        await page.waitForSelector('.bpyVvo')
        await page.type('.bpyVvo', 'm')

        await page.keyboard.press('Enter');

        console.log('part 2 over')

        await page.waitForSelector('.hBOWfr')
        let element = await page.$('.hBOWfr')
        let value = await page.evaluate(el => el.textContent, element)
        console.log("From Dunzo->"+value);
        final+=value;


     await page.close();


    }
    async function porter() {
        const page1 = await browser.newPage();
        await page1.goto(url1, { waitUntil: 'networkidle2' });

        console.log('started')

        await page1.waitForSelector('.MuiSelect-root')
        await page1.click('.MuiSelect-root')
        console.log("connected...")
       
        await page1.waitForSelector('.MuiMenu-list>li[data-value=mumbai]')
        await page1.click('.MuiMenu-list>li[data-value=mumbai]')


            await page1.keyboard.press('Tab');
            // await page.waitForSelector('input[type=text]')
            await page1.type('input[type=text]', '400027')
            await page1.waitForTimeout(1000);

            await page1.keyboard.press('ArrowDown');

            await page1.keyboard.press('Tab');
            
            await page1.type('input[placeholder="Enter DropOff Address"]', '400004')
            await page1.waitForTimeout(1000);
            
            await page1.keyboard.press('ArrowDown');
            
            await page1.keyboard.press('Tab');
            await page1.keyboard.press('Tab');
            await page1.type('input[placeholder="Enter Mobile Number"]', '9876543210')

              await page1.waitForSelector('.chip')
            await page1.click('.chip')

            await page1.waitForSelector('.MuiButtonBase-root')
            await page1.click('.MuiButtonBase-root')

           await page1.waitForNavigation({waitUntil: 'networkidle2'})

         
         
           await page1.waitForSelector('.fare-estimate-result-desktop-vehicle-card-container')
           let element = await page1.$('.fare-estimate-result-desktop-vehicle-card-container')
           let value = await page1.evaluate(el => el.textContent, element)
           console.log("From Porter-> "+value);
           final+=value;
    

    
    await page1.close();
    
}

promise1= porter();
promise2= dunzo();

await Promise.all([promise1, promise2])
// res.render('final', { final: final });
 await browser.close();
    


});

const port = process.env.PORT || 5000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));
