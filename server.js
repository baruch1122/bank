const app = require('express')()
const { createScraper } = require('israeli-bank-scrapers');
const fetch = require(`node-fetch`);
const cors = require(`cors`);
const hook = `https://hook.integromat.com/urlny1m9oce71e1mcxmjfszebfdrtb3o`

const credentialsArr = [
    {
        userCode: "",
        password: ""
    },
    {
        username: "",
        password: ""
    },
    {
        id: "",
        password: "",
        num: ""
    },
    {
        username: "",
        password: ""
    }
]


app.use(require('express').json())
app.use(cors())

app.post('/bank', async function (req, res) {
    try {
        let credentials = {}
        switch (req.body.bank) {
            case "hapoalim":
                credentials = credentialsArr[0]
                credentials.userCode = req.body.userCode
                credentials.password = req.body.password
                break;
            case "leumi":
            case "mizrahi":
            case "otsarHahayal":
                credentials = credentialsArr[1]
                credentials.username = req.body.username
                credentials.password = req.body.password
                break;
            case "discount":
                credentials = credentialsArr[2]
                credentials.password = req.body.password
                credentials.id = req.body.id
                credentials.num = req.body.num
                break;
                case "visaCal":
                credentials = credentialsArr[3]
                credentials.username = req.body.username
                credentials.password = req.body.password
                break;

            default:
                break;
        }
        const options = {
            companyId: req.body.bank, // mandatory; one of 'hapoalim', 'hapoalimBeOnline', leumi', 'discount', 'mizrahi', 'otsarHahayal', 'visaCal', 'max', 'isracard', 'amex'
            startDate: new Date(req.body.year, req.body.month + 1, req.body.day + 1), // the date to fetch transactions from (can't be before the minimum allowed time difference for the scraper)
            combineInstallments: `true`, // if set to true, all installment transactions will be combine into the first one
            showBrowser: `false`, // shows the browser while scraping, good for debugging (default false)
            verbose: `true`, // include more debug info about in the output
            //browser : Browser, // optional option from init puppeteer browser instance outside the libary scope. you can get browser diretly from puppeteer via `puppeteer.launch()` command.
            //executablePath: string // optional. provide a patch to local chromium to be used by puppeteer. Relevant when using `israeli-bank-scrapers-core` library 
        };

        const scraper = createScraper(options);
        const scrapeResult = await scraper.scrape(credentials);

        if (scrapeResult.success) {
           res.send(scrapeResult);
		// await
        //  fetch(hook, {
        //  method: 'POST',
        //  headers: {
        //  'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(scrapeResult),
        //   });
        }
        else {
            res.send(500);
            console.log(scrapeResult)
        }
    } catch (e) {
        console.error(`scraping failed for the following reason: ${e.message}`);
        console.log(e)
    }
})


app.get('/', (req,res)=>{
    res.send("blah i'm working")
})

app.listen(1000, function () {
console.log("run on prot 1000");
})
