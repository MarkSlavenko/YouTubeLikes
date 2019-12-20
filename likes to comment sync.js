const puppeteer = require('puppeteer');
const fs = require('fs');
 
const pre_proxies = fs.readFileSync('./proxies.txt', 'utf8').toString().replace(/\r\n/g, '\n').split('\n');
const proxies = pre_proxies.map((proxy)=> proxy = '--proxy-server=' + proxy );

let mails = [];
let passwords = [];
const accounts = fs.readFileSync('./accounts.txt', 'utf8').toString().replace(/\r\n/g, '\n').split('\n');
for (let i = 0; i < accounts.length; i++) {
	let acc_parts = accounts[i].split(';');
	mails.push(acc_parts[0]);
	passwords.push(acc_parts[1]);
}

const link_to_comment = fs.readFileSync('./link.txt', 'utf8').toString().replace(/\r\n/g, '\n');


async function main() {
	for (let i = 0; i < proxies.length; i++) {
  	const browser = await puppeteer.launch({headless: true, args: [ proxies[i] ]}); //change to false, if you want to see progress
    const page = await browser.newPage();
    page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    await page.goto('https://accounts.google.com/ServiceLogin?hl=ru&passive=true&continue=https://www.google.com/');
    await page.setViewport({width: 1000, height: 1000})
    await page.waitFor('input[name=identifier]');
    await page.$eval('input[name=identifier]', (el, value) => el.value = value, mails[i]);
    await page.click('#identifierNext');

    await page.waitFor('input[name=password]');
    await page.$eval('input[name=password]', (el, value) => el.value = value, passwords[i]);
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
}

main();