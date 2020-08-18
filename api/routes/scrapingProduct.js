const express = require("express");
const router = express.Router();
const ScrapingProduct = require("../models/ScrapingProduct");
const Filter = require("../models/Filter");

const async = require('async');
const wait = require('wait.for');
const axios = require("axios");
const request = require('request');
const cheerio = require('cheerio');

const wget = require('wget');


let goLink = [];
let mLen;

let baseUrl = "https://www.diretta.it/";
let firstCategory = "div.menuMinority > div.menuMinority__content > div.menuMinority__contentInner > a";
let secondCountry = "div.mbox0px > ul.menu.country-list.tournament-menu > li > a";
let thirdLeague = "div.mbox0px > ul.menu.selected-country-list > li > a";
let forthSeason = "div.leagueTable__season > div.leagueTable__seasonName > a";
let fifthMatch = "sportName";


let nCategory = 0;
let nCountry = 0;
let nLeague = 0;
let nSeason = 0;
let nTeams = 0;

let lastStage = false;

let m = 0;
let pStage = 0;


router.post("/scraping-product", async (req, res) => {
    await console.log("--------------- success  ----------------");

    await goLink.slice(0, goLink.length);
    goLink[0] = baseUrl;
    await initializeDB(pStage);
    await ScrapingProduct.find({}).then(async scrapingItem => {
        for(let k = 0; k < scrapingItem.length; k ++) {
            goLink[k] = scrapingItem[k].link;

            console.log(k + 1, " -> ", goLink[k]);
        }
        console.log("The Initialize !");
    });

    /**
     * Getting Categories
     */
    nCategory = 1;
    // await gettingCategoryLink(0, firstCategory, baseUrl);
    await console.log(" ===============  Category Scraping Done !!!!! =============");
    console.log("nCategory = ", nCategory);
    // nCategory = 35;

    /**
     * Getting Country
     */
    await ScrapingProduct.find({}).then(async scrapingItem => {
        let pLen = scrapingItem.length;
        for (let k = 0; k < pLen; k ++) {
            await gettingCategoryLink(0, secondCountry, scrapingItem[k].link);
            console.log("###############", "2Stage/", k, "  -->  ", goLink.length);
        }
    });

    nCountry = goLink.length;
    console.log(nCountry);

    // nCountry = 300;

    /**
     * Getting League
     */
    await ScrapingProduct.find({}).then(async scrapingItem => {
        let pLen = scrapingItem.length;
        for (let k = nCategory; k < pLen; k ++) {
            await gettingCategoryLink(0, thirdLeague, scrapingItem[k].link);
            console.log("###############", "3Stage/", k, "  -->  ", goLink.length);
        }
    });

    nLeague = goLink.length;
    console.log("nLeague = ", nLeague);

    // nLeague = 300;

    /**
     * Getting Season
     */
    await ScrapingProduct.find({}).then(async scrapingItem => {
        let pLen = scrapingItem.length;
        for (let k = nCountry; k < pLen; k ++) {
            await gettingCategoryLink(0, forthSeason, scrapingItem[k].link + "archivio/");
            console.log("###############", "4Stage/", k, "  -->  ", goLink.length);
        }
    });

    nSeason = goLink.length;
    console.log("nLeague = ", nSeason);


    /**
     * Getting Last Link
     */
    //nSeason = 4970;
    // await ScrapingProduct.find({}).then(async scrapingItem => {
    //     let pLen = scrapingItem.length;
    //     for (let k = nSeason; k < pLen; k ++) {
    //         lastStage = true;
    //         await console.log("Starting 5Stage k = ", k, '\n', scrapingItem[k].link);
    //         await gettingCategoryLink(k, fifthMatch, scrapingItem[k].link + "risultati/");
    //         await console.log("###############", "5 Stage/", k, "  -->  Completing");
    //     }
    // });


    /**
     * Getting Description
     */
    // nTeams = 36487;
    // await ScrapingProduct.find({}).then(async scrapingItem => {
    //     let pLen = scrapingItem.length;
    //     for (let k = nTeams; k < pLen; k ++) {
    //         await sleep(500);
    //         await console.log("Starting Result k = ", k, '\n', scrapingItem[k].link);
    //         await gettingResult(k - nTeams + 3154, scrapingItem[k]);
    //         await console.log("###############", "Last Result Stage/", k, "  -->  Completing");
    //     }
    // });

    console.log(" ===============  Whole Scraping Done !!!!! =============");
    return res.status(200).json("scraping_Product");
});

router.post('/get-all', (req, res) => {
    console.log('ok');
    // ScrapingProduct.find({}).then(async scrapingItem => {
    //     await console.log(scrapingItem);
    //     await gettingCountLeagueLink(secondCountryLeague, scrapingItem);
    //     return await res.status(200).json({results: [...scrapingItem]});
    // });
});

module.exports = router;

/**
 * Initailize of the database
 * @param pStage
 * @returns {Promise<*>}
 */
async function initializeDB(pStage) {
    if (pStage === 0) { // starting from the first
        const scraping_Product = await new ScrapingProduct({
            id: 1,
            link: baseUrl,
        });

        await scraping_Product.collection.deleteMany({});

        goLink = [];
        goLink[0] = baseUrl;

        const scraping_ProductOne = await new ScrapingProduct({
            id: 1,
            link: baseUrl,
        });
        m = 0;

        await scraping_ProductOne.save();

        await console.log( " === +++++++ === Total/Start -> ", await ScrapingProduct.countDocuments(), '/', m + 1, 'th');

    } else {
        return res.status(200).json("Conflict of the condition");
    }
}

/**
 * Getting CategoryName and Link
 * @param firstStr
 * @param baseUrl
 * @returns {Promise<number>}
 */
async function gettingCategoryLink(iM, matchStr, bUrl) {
    try {
        if (lastStage === true) {
            try {
                require('chromedriver');
                const webdriver = require('selenium-webdriver');
                let By = webdriver.By;
                let until = webdriver.until;
                const driver = new webdriver.Builder()
                    .forBrowser('chrome')
                    .build();

                await driver.get(bUrl);

                try {
                    let mError = await driver.findElement(By.className('nmf__title')).getAttribute('innerHTML');
                    if(mError === "Nessun incontro trovato.") {
                        await driver.quit();
                        return 0;
                    }
                } catch (e) {
                }

                await driver.wait(until.elementLocated(By.className(matchStr)));
                let sMatch = await driver.findElement(By.className(matchStr)).getAttribute('innerHTML');
                console.log(sMatch.length);
                await driver.quit();

                /**
                 * Getting the last Link
                 */
                let sCategory;
                let sCountry;
                let sLeague;

                let nCount = 0;
                let lastLink;
                let sTeamA;
                let sTeamB;
                let finalScore;

                let ss = bUrl.split("/");
                sCategory = ss[3];
                sCountry = ss[4];
                sLeague = ss[5];

                if(sLeague.includes("-20") === false) {
                    sLeague += "-2019-2020";
                }

                if(sCategory === "calcio") {
                    sCategory = "football";
                }

                let sId = "id=\"g_";
                let n = sMatch.search(sId);

                while(n >= 0) {
                    try {
                        sMatch = sMatch.slice(n + 8, );
                        if(sMatch[0] === "_") sMatch = sMatch.slice(1, );

                        let nI = sMatch.search("\"");
                        lastLink = sMatch.slice(0, nI);
                        sMatch = sMatch.slice(nI + 1, );

                        lastLink = baseUrl + "partita/" + lastLink + "/#informazioni-partita/";
                        console.log('\n LastLink = ', lastLink);

                        /**
                         * Description Information
                         */
                        const result = await axios.get(lastLink);
                        let $ = await cheerio.load(result.data);

                        sTeamA = $("div.team-text.tname-home > div > div > a").text();
                        sTeamB = $("div.team-text.tname-away > div > div > a").text();
                        finalScore = $("div.match-info > div.current-result").text().trim();
                        nCount += 1;

                        let t = (iM).toString() + "-" + (nCount).toString();

                        console.log(" id = ", t);
                        // console.log("Category = ", sCategory, " \n sCountry = ", sCountry, "\n sLeague = ", sLeague);
                        // console.log("TeamA = ", sTeamA);
                        // console.log("TeamB = ", sTeamB);
                        console.log("FinalScore = ", finalScore);

                        const scraping_data = await new ScrapingProduct({
                            id: t,
                            link: lastLink.trim(),
                            category: sCategory.trim(),
                            country: sCountry.trim(),
                            league: sLeague.trim(),
                            teamA: sTeamA.trim(),
                            teamB: sTeamB.trim(),
                            finalScore: finalScore.trim(),
                        });
                        await scraping_data.save();

                        n = sMatch.search(sId);
                    } catch (e) {
                        await driver.quit();
                        n = sMatch.search(sId);
                        console.log(" error -> n = ", n);
                    }
                }
            } catch (e) {
                if(error.response === undefined) {
                    console.log("Site Error - Un-existing Url");
                    await sleep(1000);
                    return 0;
                } else {
                    console.log("Last Stage Error !!", error);
                    await sleep(1000);
                    await gettingCategoryLink(matchStr, bUrl);
                }
            }
        } else {

            const result = await axios.get(bUrl);
            let $ = await cheerio.load(result.data);
            let aStr;
            const aTags = $(matchStr);

            console.log("+============", aTags.length);

            for (let i = 0; i < aTags.length; i++) {

                aStr = aTags[i].attribs.href;
                if (aStr !== undefined) {
                    if((aStr.includes("2003-2004") === true) || (aStr.includes("-2004") === true)) break;
                    mLen = goLink.length;
                    goLink.push('https://www.diretta.it' + aStr);
                    const scraping_Product = new ScrapingProduct({
                        id: goLink.length,
                        link: goLink[goLink.length - 1]
                    });

                    await scraping_Product.save();
                    console.log(goLink.length, "  -> ", goLink[goLink.length - 1]);
                }
            }
        }
    } catch (error) {
        if(error.response === undefined) {
            console.log("Site Error - Un-existing Product Url");
        }
        console.log(goLink.length, "th  -> ", "Timeout 1st + 2nd", error);
        await sleep(1500);
        return 0;
    }
}


/**
 * Last Result
 * @param m
 * @param pStr
 * @returns {Promise<number>}
 */
async function gettingResult(m, pStr) {
    try {
        try {
            /**
             * Getting the last Link
             */
            let sCategory = pStr.category;
            let sCountry = pStr.country;
            let sLeague = pStr.league;

            let lastLink = pStr.link;
            let sDate;
            let sTeamA = pStr.teamA;
            let sTeamB = pStr.teamB;
            let finalScore = pStr.finalScore;
            let timeScored_firstHalf = "";
            let timeScored_secondHalf = "";

            try {
                /**
                 * getting the match date
                 */
                require('chromedriver');
                const webdriver = require('selenium-webdriver');
                let By = webdriver.By;
                let until = webdriver.until;
                const driver = new webdriver.Builder()
                    .forBrowser('chrome')
                    .build();

                await driver.get(lastLink);
                await driver.wait(until.elementLocated(By.id("detcon")));

                sDate = await driver.findElement(By.id("utime")).getAttribute('innerHTML');

                /**
                 * Getting Scores of 1th and 2nd half
                 */
                let aList = await driver.findElements(By.css("div.detailMS__incidentRow.incidentRow--home"));
                let bList = await driver.findElements(By.css("div.detailMS__incidentRow.incidentRow--away"));
                timeScored_firstHalf = "";
                timeScored_secondHalf = "";

                for(let e of aList) {
                    try {
                        let aa = await e.findElement(By.className("soccer-ball")).getText();
                        if(aa.length === 1) {
                            let a;
                            try {
                                a = "A: " + await e.findElement(By.css("div.time-box")).getText() + ", ";
                            } catch {
                                try {
                                    a = "A: " + await e.findElement(By.css("div.time-box-wide")).getText() + ", ";
                                } catch (e) {
                                }
                            }

                            timeScored_firstHalf = timeScored_firstHalf + a;
                        }
                    } catch {
                        try {
                            /**
                             * oneself Goal
                             */
                            let ownGoal = await e.findElement(By.className("soccer-ball-own")).getText();
                            if(ownGoal.length === 1) {

                                let a;
                                try {
                                    a = "A: " + await e.findElement(By.css("div.time-box")).getText() + ", ";
                                } catch {
                                    try {
                                        a = "A: " + await e.findElement(By.css("div.time-box-wide")).getText() + ", ";
                                    } catch (e) {
                                    }
                                }
                                timeScored_firstHalf = timeScored_firstHalf + a;
                            }
                        } catch (e) {
                        }
                    }
                }

                for(let e of bList) {
                    try {
                        let bb = await e.findElement(By.className("soccer-ball")).getText();
                        if(bb.length === 1) {
                            let b;
                            try {
                                b = "B: " + await e.findElement(By.css("div.time-box")).getText() + ", ";
                            } catch {
                                try {
                                    b = "B: " + await e.findElement(By.css("div.time-box-wide")).getText() + ", ";
                                } catch (e) {
                                }
                            }

                            timeScored_secondHalf = timeScored_secondHalf + b;
                        }
                    } catch {
                        try {

                            /**
                             * oneself Goal
                             */
                            let ownGoal = await e.findElement(By.className("soccer-ball-own")).getText();
                            if(ownGoal.length === 1) {

                                let b;
                                try {
                                    b = "B: " + await e.findElement(By.css("div.time-box")).getText() + ", ";
                                } catch {
                                    try {
                                        b = "B: " + await e.findElement(By.css("div.time-box-wide")).getText() + ", ";
                                    } catch (e) {
                                    }
                                }

                                timeScored_secondHalf = timeScored_secondHalf + b;
                            }
                        } catch (e) {
                        }
                    }
                }

                if(timeScored_firstHalf !== "") {
                    timeScored_firstHalf = timeScored_firstHalf.slice(0, timeScored_firstHalf.length - 2);
                }
                if(timeScored_secondHalf !== "") {
                    timeScored_secondHalf = timeScored_secondHalf.slice(0, timeScored_secondHalf.length - 2);
                }
                await driver.quit();

                // console.log("Category = ", sCategory, " \n sCountry = ", sCountry, "\n sLeague = ", sLeague);
                // console.log("Match Date = ", sDate);
                // console.log("TeamA = ", sTeamA);
                // console.log("TeamB = ", sTeamB);
                console.log("FinalScore = ", finalScore);
                console.log("timeScored_firstHalf = ", timeScored_firstHalf);
                console.log("timeScored_secondHalf = ", timeScored_secondHalf);

                const scraping_data = await new Filter({
                    id: m,
                    link: lastLink.trim(),
                    category: sCategory.trim(),
                    country: sCountry.trim(),
                    league: sLeague.trim(),
                    matchDate: sDate.trim(),
                    teamA: sTeamA.trim(),
                    teamB: sTeamB.trim(),
                    finalScore: finalScore.trim(),
                    historiesFirstHalf: timeScored_firstHalf,
                    historiesSecondHalf: timeScored_secondHalf,
                });
                await scraping_data.save();
            } catch (e) {
                await driver.quit();
            }

        } catch (e) {
            console.log("Error");
            await sleep(500);
            return 0;
        }

    } catch (error) {
        console.log("Error");
        await sleep(500);
        return 0;
    }
}


function sleep(milliseconds) {
    let timeStart = new Date().getTime();
    while (true) {
        let elapsedTime = new Date().getTime() - timeStart;
        if (elapsedTime > milliseconds) {
            break;
        }
    }
}
