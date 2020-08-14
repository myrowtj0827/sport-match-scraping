const express = require("express");
const router = express.Router();
const ScrapingProduct = require("../models/ScrapingProduct");
const Filter = require("../models/Filter");

const async = require('async');
const wait = require('wait.for');
const axios = require("axios");
const request = require('request');
const cheerio = require('cheerio');

let goLink = [];
let mLen, timeFlag;

let baseUrl = "https://www.diretta.it/";
let firstCategory = "div.menuMinority > div.menuMinority__content > div.menuMinority__contentInner > a";
let secondCountry = "div.mbox0px > ul.menu.country-list.tournament-menu > li > a";
let thirdLeague = "div.mbox0px > ul.menu.selected-country-list > li > a";
let forthSeason = "div.leagueTable__season > div.leagueTable__seasonName > a";
let fifthMatch = "#live-table";

//let fifthMatch = "div.sportName > div.event__match";


let nCategory = 0;
let nCountry = 0;
let nLeague = 0;
let nSeason = 0;
let nTeams = 0;

let lastStage = false;
let goLinkLen = 2688;

const nth = 1;
let nCount_First = 1, nCount_Products;

let m = 0;
let pStage = 0;

router.post("/scraping-product", async (req, res) => {
    await console.log("--------------- success  ----------------");

    await goLink.slice(0, goLink.length);
    // goLink[0] = baseUrl;
    // await initializeDB(pStage);
    await ScrapingProduct.find({}).then(async scrapingItem => {
        for(let k = 0; k < scrapingItem.length; k ++) {
            goLink[k] = scrapingItem[k].link;

            //console.log(k + 1, " -> ", goLink[k]);
        }

        console.log("The Initialize !");
    });

    /**
     * Getting Categories
     */
    // await gettingCategoryLink(firstCategory, baseUrl);
    // await console.log(" ===============  Category Scraping Done !!!!! =============");
    // console.log("nCategory = ", nCategory);
    //
    // nCategory = 35;


    /**
     * Getting Country
     */
    // await ScrapingProduct.find({}).then(async scrapingItem => {
    //     let pLen = scrapingItem.length;
    //     for (let k = 0; k < pLen; k ++) {
    //         await gettingCategoryLink(secondCountry, scrapingItem[k].link);
    //         console.log("###############", "2Stage/", k, "  -->  ", goLink.length);
    //     }
    // });
    //
    // nCountry = goLink.length;
    // console.log(nCountry);

    // nCountry = 1455;

    /**
     * Getting League
     */
    // await ScrapingProduct.find({}).then(async scrapingItem => {
    //     let pLen = scrapingItem.length;
    //     for (let k = nCategory; k < pLen; k ++) {
    //         await gettingCategoryLink(thirdLeague, scrapingItem[k].link);
    //         console.log("###############", "3Stage/", k, "  -->  ", goLink.length);
    //     }
    // });
    //
    // nLeague = goLink.length;
    // console.log("nLeague = ", nLeague);

    // nLeague = 2688;

    /**
     * Getting Season
     */
    // await ScrapingProduct.find({}).then(async scrapingItem => {
    //     let pLen = scrapingItem.length;
    //     for (let k = nCountry; k < pLen; k ++) {
    //         await gettingCategoryLink(forthSeason, scrapingItem[k].link + "archivio/");
    //         console.log("###############", "4Stage/", k, "  -->  ", goLink.length);
    //     }
    // });
    //
    // nSeason = goLink.length;
    // console.log("nLeague = ", nSeason);

    nSeason = 4970;

    /**
     * Getting Description
     */
    await ScrapingProduct.find({}).then(async scrapingItem => {
        lastStage = true;
        let pLen = scrapingItem.length;

        for (let k = nSeason; k < pLen; k ++) {

            await gettingCategoryLink(fifthMatch, scrapingItem[k].link + "risultati/");

            console.log("###############", "5 Stage/", k, "  -->  ", goLink.length);
        }

        // let pLen = "https://www.diretta.it/basket/australia/wnbl-women-2018-2019/";
        // await gettingCategoryLink(fifthMatch, pLen + "risultati/");
        // console.log("###############", "5 Stage/", 12312, "  -->  ", goLink.length);
    });

    nTeams = goLink.length;
    console.log("nLeague = ", nTeams);







    // await gettingCountryLeagueLink(secondCountryLeague);
    await console.log(" ===============  Country and League Scraping Done !!!!! =============");
    // console.log(goLink, "categoryCount = ", nCategory);


    //await shownData(ScrapingProduct);

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
async function gettingCategoryLink(matchStr, bUrl) {
    try {
        const result = await axios.get(bUrl);
        let $ = await cheerio.load(result.data);
        let aStr;
        const aTags = $(matchStr);

        console.log('Len = ', aTags.length);
        // console.log('aTags = ', aTags);
        // console.log("bUrl ->", bUrl);

        // for (let i = 0; i < aTags.length; i++) {console.log("Scraping-5th");
        //     if(lastStage === true) {
        //         // let sMiddle = aTags[i].find("div.event");
        //         // console.log(sMiddle);
        //         // let id = aTags[i].attr("id");
        //         // if(id.includes("g_") === false) break;
        //         //
        //         // if(id[3] === "_") {
        //         //     aStr = id.slice(3, );
        //         // } else if(id[4] === "_") {
        //         //     aStr = id.slice(4, );
        //         // }
        //         //
        //         // aStr = "/partita/" + aStr + "/#informazioni-partita/";
        //         //
        //         // console.log("#######", aStr);
        //     } else {
        //         aStr = aTags[i].attribs.href;
        //     }
        //
        //     if (aStr !== undefined) {
        //         if((aStr.includes("2003-2004") === true) || (aStr.includes("-2004") === true)) break;
        //         mLen = goLink.length;
        //         goLink.push('https://www.diretta.it' + aStr);
        //         const scraping_Product = new ScrapingProduct({
        //             id: goLink.length,
        //             link: goLink[goLink.length - 1]
        //         });
        //
        //         await scraping_Product.save();
        //
        //         console.log(goLink.length, "  -> ", goLink[goLink.length - 1]);
        //         // nCategory = goLink.length;
        //     }
        // }
    } catch (error) {
        if(error.response === undefined) {
            console.log("Site Error - Un-existing Product Url");
        }

        // console.log(error.response);

        console.log(goLink.length, "th  -> ", "Timeout 1st + 2nd", error);
        await sleep(1500);
        return 0;
    }
}










/**
 * Getting the last scraping Information
 * @param nFirst
 * @param nSecond
 * @returns {Promise<void>}
 */
// async function gettingScraping(nFirst, nSecond) {
//
//     for (let i = nFirst; i <= nSecond; i ++) {
//         try {
//             if(i === 0) i = 1;
//
//             const result = await axios.get(goLink[i - 1]);
//             // await sleep(2000);
//             let $ = await cheerio.load(result.data);
//
//             /**
//              * Getting the category list
//              */
//             let categoryList = '';
//
//             await $("div.breadcrumbContainer > div > div.breadcrumb").each(async function( index ) {
//                 // await sleep(1000);
//                 $("span.crumb > a").each( function( index ) {
//                     if ($(this).text() !== undefined) {
//                         categoryList += $(this).text() + '/';
//                         categoryList = categoryList.replace(' & ', '/');
//                     }
//                 });
//
//                 categoryList = categoryList.replace('Home/', '');
//                 let mArray = categoryList.split('/');
//                 mArray = [...new Set(mArray)];
//
//                 categoryList = '';
//                 for (let j = 0; j < mArray.length - 1; j ++) {
//                     categoryList += mArray[j] + '/';
//                 }
//             });
//
//             /**
//              * Getting the details information
//              */
//             let sInfo = $("div.primaryDetails");
//
//             let photoLink = await $(sInfo).find("div.mediaContainer > div > img").attr("src");
//             let thumbnailPhotoLink = await $(sInfo).find("div.mediaContainer > img").attr("src");
//             let productName = await $(sInfo).find("div.coreWrapper > div > a").text().trim();
//             let productDescription = await $(sInfo).find("div.coreWrapper > div > h1").text().trim();
//             let productPrice = await $(sInfo).find("div.coreWrapper > div > div.priceRow > div.pdpPrice > p > span.value > span.sellingPriceContainer > span.sellingPrice > span > span.value").text().trim();
//
//             await ScrapingProduct.updateOne({scraping_store_address: goLink[i-1]},
//                 [{$set: {scraping_category: categoryList, scraping_name: productName, scraping_photo_link: photoLink,
//                     scraping_description: productDescription, scraping_price: productPrice, scraping_thumbnail_Link: thumbnailPhotoLink}}]).then(async () => {
//                         console.log(i, "    ------> ", goLink[i-1]);
//             });
//
//             await console.log("\n 3rd stage -> ", goLink.length, '/', i, "th   Passed \n");
//         } catch (error) {
//             // console.log(i, ' -> ', error.response.status);
//             if(error.response === undefined) {
//                 console.log('3rd stage -> ', goLink.length, '/', i, 'th  ', "Site Error - Un-existing Product Url");
//                 // console.log('3rd stage -> ', goLink.length, '/', i, 'th  ', error);
//             } else {
//
//                 // console.log('3rd stage -> ', goLink.length, '/', i, 'th  ', "Timeout");
//                 i = i - 1;
//             }
//
//             // await sleep(2000);
//         }
//     }
// }


/**
 * Inserting the scraping results to the real DB
 * @param pDbName
 * @returns {Promise<void>}
 */
async function shownData(pDbName) {
    let regLink = new RegExp('.+');

    await pDbName.find({
        link: {$regex: regLink},
        category: {$regex: regLink},
        country: {$regex: regLink}
    }).then( scrapingItems =>  {
        if(scrapingItems){

            for (let i = 0; i < scrapingItems.length; i ++)
            {
                const scraping_Product = new Filter({
                    id: scrapingItems[i].id,
                    link: scrapingItems[i].link,
                    category: scrapingItems[i].category,
                    country: scrapingItems[i].country,
                    league: scrapingItems[i].league,
                    teamA: scrapingItems[i].teamA,
                    teamB: scrapingItems[i].teamB,
                    matchDate: scrapingItems[i].matchDate,
                });

                scraping_Product.save();
                console.log(i + 1, "  -> ");
            }
        } else {
            return res.status(400).json({msg: "The products don't exist at all !"});
        }
    });

    await console.log("Adding to the real DB !!!");
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
