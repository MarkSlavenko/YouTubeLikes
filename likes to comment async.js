const puppeteer = require('puppeteer');

const mails = ['mail1', 'mail2', '...']; // gmail
const passwords = ['pass1', 'pass2', '...'];
const link_to_comment = 'link to comment';

  for (let i = 0; i < mails.length; i++) {
    main(mails[i], passwords[i]);
  }

async function main(log, pass) {

  const browser = await puppeteer.launch({headless: true}); //change to false, if you want to see progress
  const page = await browser.newPage();
  page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
  await page.goto('https://accounts.google.com/ServiceLogin?hl=ru&passive=true&continue=https://www.google.com/');
  await page.setViewport({width: 1000, height: 1000})
  await page.waitFor('input[name=identifier]');
  await page.$eval('input[name=identifier]', (el, value) => el.value = value, log);
  await page.click('#identifierNext');

  await page.waitFor('input[name=password]');
  await page.$eval('input[name=password]', (el, value) => el.value = value, pass);
  await page.waitFor(2000);
  await page.click('#passwordNext'); 

  await page.waitFor(2000);
  await page.goto(link_to_comment);
  await page.waitFor('#like-button > a');
  await page.waitFor(2000);
  await page.click('#like-button > a');
  console.log('Like set!')

  await page.waitFor(1000);
  await browser.close();
  }