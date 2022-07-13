//dunzo parcel price getter automation
const puppeteer = require('puppeteer')
url = 'https://www.dunzo.com/mumbai/send-packages'
async function run() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });



    await page.waitForTimeout(3000);
    console.log('started')

    await page.waitForSelector('.fVkmJL')
    await page.click('.fVkmJL')

    try {
        await page.waitForSelector('.bIlSir')
        await page.type('.bIlSir', 'grant road,mumbai')

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
    await page.type('.sc-1pv5wjx-2', 'sikka nagar,mumbai')

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
    console.log(value);





    await page.goto('https://borzodelivery.com/in/order', { waitUntil: 'networkidle2' });



    await page.waitForTimeout(3000);
    console.log('started')


    await browser.close();

}
run();
//first address click kfSQKN
// click on bIlSir
//type in b11....
//click on first hqIdmi
//click on kcSRbj
//type in bpyVvo
//press enter

//second address click eulfiR
