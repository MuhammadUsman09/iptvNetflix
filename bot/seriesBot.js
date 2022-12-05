let puppeteer = require('puppeteer')
// let cheerio = require('cheerio');
// const select = require('puppeteer-select');
// const fs = require('fs');
const { title } = require('process');
const axios = require('axios');
function getUserList() {
    process.argv[2] = "mercuryofficials"
    console.log("Entering into endpoint")
    var localUrl='http://localhost:3000/'
    var serverUrl='https://discoveryplus.herokuapp.com/'
    var baseUrl = serverUrl
    var seriesCallUrl = baseUrl+'series';
    var castCallUrl = baseUrl + 'cast';
    var genreCallUrl = baseUrl+'genre';
    var seasonCallUrl = baseUrl+'season';
    var episodeCallUrl = baseUrl+'episode';
    let seriesId;
    let imdbPage
    let justWatchSeriesUrl;
    let requestTime=300000000
    if (process.argv[2] !== undefined) {
        (() => {
            function delay(time) {
                return new Promise(resolve => setTimeout(resolve, time));
            }
            async function run() {
                await delay(3000);
                console.log('This printed after about 1 second');
            }
            async function autoScroll(page) {
                await page.evaluate(async () => {
                    await new Promise((resolve, reject) => {
                        var totalHeight = 0;
                        var distance = 100;
                        var timer = setInterval(() => {
                            var scrollHeight = document.body.scrollHeight;
                            window.scrollBy(0, distance);
                            totalHeight += distance;
                            if (totalHeight >= scrollHeight - window.innerHeight) {
                                clearInterval(timer);
                                resolve();
                            }
                        }, 100);
                    });
                });
            }
            const prompt = require('prompt-sync')();
            justWatchSeriesUrl = prompt('Enter Series Url : ');
            console.log(justWatchSeriesUrl);
            puppeteer.launch({ headless: false })
                .then(async (browser) => {
                    let justWatchPage = await browser.newPage()
                    justWatchPage.setViewport({ width: 1366, height: 768 });
                    let justWatchUrl = justWatchSeriesUrl
                    await justWatchPage.goto(justWatchUrl, { waitUntil: 'networkidle2', timeout: requestTime })
                    await justWatchPage.evaluate(async () => {
                        await window.scrollBy(0, window.innerHeight);
                        await window.scrollBy(0, window.innerHeight);
                    });
                    let videoUrl = await justWatchPage.evaluate(async () => {
                        try {
                            document.querySelector('.youtube-player__play-button.youtube-player__play-button--backdrop').click()
                            return await document.querySelector("html>body>div>div>div>div>div>div>iframe").src
                        } catch (error) {
                            console.log(error)
                        }
                    })
                    console.log(videoUrl);
                    const seriesTitle = await justWatchPage.evaluate(async () => {
                        try {
                            return await document.querySelector('html>body>div>div>div>div>div>div>div>div>div>h1').innerText
                        } catch (error) {
                            console.log(error)
                        }
                    })
                    console.log(seriesTitle);
                    var imgUrl;
                    do {
                        imgUrl = await justWatchPage.evaluate(async () => {
                            try {
                                return await document.querySelectorAll('.jw-info-box__container-sidebar img')[0].src
                            } catch (error) {
                                console.log(error)
                            }
                        })
                      } while (imgUrl.includes('gif;base64') );
                    
                    console.log(imgUrl);
                    // for imdb page data
                    const imdbUrl = await justWatchPage.evaluate(async () => {
                        try {
                            return await (document.querySelectorAll('html>body>div>div>div>div>div>div>div>div>div>div>div .jw-scoring-listing__rating a'))[1].href
                        } catch (error) {
                            console.log(error)
                        }
                    })
                    console.log(imdbUrl);
                    if(seriesTitle=='Dangals of Crime'){
                       
                        let seriesStoryLine = await justWatchPage.evaluate(async () => {
                            try {
                                document.querySelector('html>body>div>div>div>div>div>div>div>div>p>span').innerText
                            } catch (error) {
                                console.log(error)
                            }
                        })
                        const genreName = await justWatchPage.evaluate(async () => {
                            try {
                                return await document.querySelector("html>body>div>div>div>div>div>div>aside>div>div>div>div>span").innerText
                            } catch (error) {
                                console.log(error)
                            }
                        })
                        console.log(seriesStoryLine)
                        let genreId;
                            await axios({
                                method: 'POST',
                                url: genreCallUrl,
                                data: {
                                    "name": genreName
                                }
                            }).then(data => {
                                console.log(data.data)
                                genreId = data.data['_id']
                                console.log(genreId)
                            }).catch(err => {
                                console.log('in error')
                                console.log(err)
                        })
                        await axios({
                            method: 'POST',
                            url: seriesCallUrl,
                            data: {
                                "title": seriesTitle,
                                "storyline": seriesStoryLine,
                                "rating": "",
                                "episodes": "",
                                "genreId": genreId,
                                "image": imgUrl,
                                "trailer": videoUrl
                            }
                        }).then(data => {
                            console.log(data.data)
                            seriesId = data.data['_id']
                            console.log(seriesId)
                        }).catch(err => {
                            console.log('in error')
                            console.log(err)
                        })
                    }
                    if(imdbUrl){
                        imdbPage = await browser.newPage()
                        imdbPage.setViewport({ width: 1366, height: 768 });
                        await imdbPage.goto(imdbUrl, { waitUntil: 'networkidle2', timeout: requestTime })
                        //await page.screenshot({ path: 'example.png' })
                        await imdbPage.evaluate(async () => {
                            await window.scrollBy(0, window.innerHeight);
                            await window.scrollBy(0, window.innerHeight);
                        });
                        let seriesStoryLine = await imdbPage.evaluate(async () => {
                            try {
                                return await document.querySelector('.sc-16ede01-2.gXUyNh').innerText
                            } catch (error) {
                                console.log(error)
                            }
                        })
                        console.log(seriesStoryLine);
                        if (seriesStoryLine) {
                            //do nothng
                        } else {
                            seriesStoryLine = "Season StoryLine"
                        }
                        console.log(seriesStoryLine)
    
                        if (videoUrl) {
                            //do nothing
                        } else {
                            videoUrl = await justWatchPage.evaluate(async () => {
                                try {
                                    return await document.querySelector("html>body>div>div>div>div>div>div>iframe").src
                                } catch (error) {
                                    console.log(error)
                                }
                            })
                        }
                        if (videoUrl) {
    
                        } else {
                            videoUrl = await imdbPage.evaluate(async () => {
                                try {
                                    return await document.querySelector(".ipc-lockup-overlay.sc-5ea2f380-2.gdvnDB.hero-media__slate-overlay.ipc-focusable").href
                                } catch (error) {
                                    console.log(error)
                                }
                            })
                        }
                        if(videoUrl){
                            //do nothing
                        }else{
                            videoUrl="-";
                        }
                        console.log(videoUrl)
                        const rating = await imdbPage.evaluate(async () => {
                            try {
                                return await document.querySelector("main>div>section>section>div>section>section>div>div>div>div>a>div>div>div>div>span").innerText
                            } catch (error) {
                                console.log(error)
                            }
                        })
                        console.log(rating);
                        let episodes = await imdbPage.evaluate(async () => {
                            try {
                                return await document.querySelector('html>body>div>main>div>section>div>section>div>div>section>div>a>h3').children[1].innerText;
                            } catch (error) {
                                console.log(error)
                            }
                        })
                        console.log(episodes);
                        const genreName = await justWatchPage.evaluate(async () => {
                            try {
                                return await document.querySelector("html>body>div>div>div>div>div>div>aside>div>div>div>div>span").innerText
                            } catch (error) {
                                console.log(error)
                            }
                        })
                        if(episodes){
                            //do nothing
                        }else{
                            episodes="-"
                        }
    
                        console.log(genreName);
                        let genreId;
                        await axios({
                            method: 'POST',
                            url: genreCallUrl,
                            data: {
                                "name": genreName
                            }
                        }).then(data => {
                            console.log(data.data)
                            genreId = data.data['_id']
                            console.log(genreId)
                        }).catch(err => {
                            console.log('in error')
                            console.log(err)
                        })
                        
                        seriesStoryLine=seriesStoryLine.replace(/\n/g, '');
                        await axios({
                            method: 'POST',
                            url: seriesCallUrl,
                            data: {
                                "title": seriesTitle,
                                "storyline": seriesStoryLine,
                                "rating": rating,
                                "episodes": episodes,
                                "genreId": genreId,
                                "image": imgUrl,
                                "trailer": videoUrl
                            }
                        }).then(data => {
                            console.log(data.data)
                            seriesId = data.data['_id']
                            console.log(seriesId)
                        }).catch(err => {
                            console.log('in error')
                            console.log(err)
                        })
                        const getCastLength = await imdbPage.evaluate(async () => {
                            try {
                                return await document.querySelector('.ipc-sub-grid.ipc-sub-grid--page-span-2.ipc-sub-grid--wraps-at-above-l.ipc-shoveler__grid').children.length
                            } catch (error) {
                                console.log(error)
                            }
                        })
                        let actorDeatils, actorName, actorRole, actorEpisode, actorYear, actorCompleteDetail;
                        console.log(getCastLength);
                        for (let i = 0; i < getCastLength; i++) {
                            actorDeatils = await imdbPage.evaluate(async (i) => {
                                try {
                                    return await document.querySelector('.ipc-sub-grid.ipc-sub-grid--page-span-2.ipc-sub-grid--wraps-at-above-l.ipc-shoveler__grid').children[i].innerText;
                                } catch (error) {
                                    console.log(error)
                                }
                            }, i)
                            console.log(actorDeatils);
                            if(actorDeatils.includes('episode')){
                                actorName = actorDeatils.substring(0, actorDeatils.indexOf('\n'));
                                actorDeatils = actorDeatils.substring(actorName.length + 1);
                                actorRole = actorDeatils.substring(0, actorDeatils.indexOf('\n'))
                                actorDeatils = actorDeatils.substring(actorRole.length + 1);
                                actorEpisode = actorDeatils.substring(0, actorDeatils.indexOf('•'))
                                actorDeatils = actorDeatils.substring(actorEpisode.length + 2)
                                actorYear = actorDeatils;
                                console.log(actorName);
                                console.log(actorRole);
                                console.log(actorEpisode);
                                console.log(actorYear);
                            }else{
                                if(actorDeatils.includes('\n')){
                                    actorName = actorDeatils.substring(0, actorDeatils.indexOf('\n'));
                                    actorDeatils = actorDeatils.substring(actorName.length + 1);
                                    actorRole = actorDeatils;
                                    actorEpisode = "-"
                                    actorDeatils = "-"
                                    actorYear = actorDeatils;
                                    console.log(actorName);
                                    console.log(actorRole);
                                    console.log(actorEpisode);
                                    console.log(actorYear);
                                }else{
                                    actorName = actorDeatils;
                                    actorRole = "-";
                                    actorEpisode = "-"
                                    actorDeatils = "-"
                                    actorYear = actorDeatils;
                                    console.log(actorName);
                                    console.log(actorRole);
                                    console.log(actorEpisode);
                                    console.log(actorYear);
                                }
                                
                            }
                            
                            await imdbPage.evaluate(async (i) => {
                                try {
                                    document.querySelector('.ipc-sub-grid.ipc-sub-grid--page-span-2.ipc-sub-grid--wraps-at-above-l.ipc-shoveler__grid').children[i].children[1].children[2].click()
                                } catch (error) {
                                    console.log(error)
                                }
                            }, i)
                        
                            if(actorEpisode && actorEpisode!=="-"){
                                await imdbPage.waitForSelector('.ipc-list__item.sc-12de2ed8-1.dyEUVp.series-credits-bottomsheet__menu-item');
                                
                                await imdbPage.evaluate(async () => {
                                    try {
                                        await document.querySelector('.ipc-button.ipc-button--single-padding.ipc-button--center-align-content.ipc-button--default-height.ipc-button--core-baseAlt.ipc-button--theme-baseAlt.ipc-button--on-accent2.ipc-text-button.ipc-see-more__button').click()
                                    } catch (error) {
                                        console.log(error)
                                    }
                                })
                                await imdbPage.waitForSelector('.ipc-list__item.sc-12de2ed8-1.dyEUVp.series-credits-bottomsheet__menu-item');
                                await new Promise(resolve => setTimeout(resolve, 2000));
    
                                    actorCompleteDetail = await imdbPage.evaluate(async () => {
                                        try {
                                            return await document.querySelector('.ipc-promptable-base__content').innerText
                                        } catch (error) {
                                            console.log(error)
                                        }
                                    })
                                    actorCompleteDetail = actorCompleteDetail.substring(26);
                            }
                            
                            console.log(actorCompleteDetail)
                            if (actorCompleteDetail) {
                                //do nothing
                            } else {
                                actorCompleteDetail = "Actor details"
                            }
                            actorCompleteDetail=actorCompleteDetail.replace(/\n/g, ' ');
                            await axios({
                                method: 'POST',
                                url: castCallUrl,
                                data: {
                                    "streamId": seriesId,
                                    "name": actorName,
                                    "role": actorRole,
                                    "episodes": actorEpisode,
                                    "year": actorYear,
                                    "detail": actorCompleteDetail
                                }
                            }).then(data => {
                                console.log(data.data)
                            }).catch(err => {
                                console.log('in error')
                                console.log(err)
                            })
                          }    
                    }
                       
                    
                  
                    let seasonCount = await justWatchPage.evaluate(async () => {
                        try {
                            return await document.querySelector("html>body>div>div>div>div>div>div>div>div>h2").innerText
                        } catch (error) {
                            console.log(error)
                        }
                    })
                    seasonCount = seasonCount.substring(0, seasonCount.indexOf(' '));
                    console.log(seasonCount);
                    var episodeObject = {};
                    var episodesArray= new Array();
                    seasonCount = seasonCount;
                    let seasonUrl, seasonImgUrl, seasonNumber = seasonCount, seasonName, seasonId;
                    for (let i = 0; i < seasonCount; i++, seasonNumber--) {
                        episodesArray=[];
                        // seasonNumber=i;
                        seasonName = 'Season ' + seasonNumber;

                        seasonUrl = await justWatchPage.evaluate(async (i) => {
                            try {
                                return await document.querySelectorAll('html>body>div>div>div>div>div>div>div>div>div>div>div .horizontal-title-list__item a')[i].href
                            } catch (error) {
                                console.log(error)
                            }
                        }, i)
                        console.log(i);
                        console.log(seasonUrl);
                        console.log(seasonNumber);
                        console.log(seasonName);
                        do {
                            seasonImgUrl = await justWatchPage.evaluate(async () => {
                                try {
                                    return await document.querySelector('html>body>div>div>div>div>div>div>aside>div>div>picture>img').src
                                } catch (error) {
                                    console.log(error)
                                }
                            })
                          } while (seasonImgUrl.includes('gif;base64'));
                        console.log(seasonImgUrl);
                        console.log(seasonUrl);
                        console.log(seasonNumber);
                        console.log(seasonName);
                        await axios({
                            method: 'POST',
                            url: seasonCallUrl,
                            data: {
                                "seriesId": seriesId,
                                "image": seasonImgUrl,
                                "season": seasonNumber.toString(),
                                "name": seasonName.toString(),
                            }
                        }).then(data => {
                            console.log(data.data)
                            seasonId = data.data['_id']
                            console.log(seasonId)
                        }).catch(err => {
                            console.log('in error')
                            console.log(err)
                        })
                        let seasonPage = await browser.newPage()
                        seasonPage.setViewport({ width: 1366, height: 768 });
                        await seasonPage.goto(seasonUrl, { waitUntil: 'networkidle2', timeout: requestTime })
                        await seasonPage.evaluate(async () => {
                            await window.scrollBy(0, 270);
                            await window.scrollBy(0, 270);
                        });
                        let episodeCount, episodeNumber, episodeTitle, episodeDescription, episodeUrl;
                        episodeCount = await seasonPage.evaluate(async () => {
                            try {
                                return await document.querySelector('html>body>div>div>div>div>div>div>div>h2').innerText
                            } catch (error) {
                                console.log(error)
                            }
                        })
                        if (episodeCount) {
                            //do nothing
                        } else {
                            continue;
                        }
                        episodeCount = episodeCount.substring(0, episodeCount.indexOf(' '));
                        console.log(episodeCount);
                        if(episodeCount>=20){
                            await new Promise(resolve => setTimeout(resolve, 5000));
                            await seasonPage.evaluate(async () => {
                                try {
                                    document.querySelector('html>body>div>div>div>div>div>div>ul>div>button>div').click()
                                } catch (error) {
                                    console.log(error)
                                }
                            })
                            
                            await new Promise(resolve => setTimeout(resolve, 5000));
                            episodeCount = await seasonPage.evaluate( async() => {
                                try {
                                    return await document.querySelector('html>body>div>div>div>div>div>div>div>h2').innerText
                                } catch (error) {
                                    console.log(error)
                                }
                            }) 
                            episodeCount=episodeCount.substring(0, episodeCount.indexOf(' ')); 
                            console.log(episodeCount);
                            console.log('122')
                        }
                        
                        for (let j = 0; j < episodeCount; j++) {
                            episodeObject = {};
                            episodeNumber = j + 1;
                            await new Promise(resolve => setTimeout(resolve, 500));
                            episodeTitle = await seasonPage.evaluate(async (j) => {
                                try {
                                    document.querySelectorAll('html>body>div>div>div>div>div>div>ul .episodes-item h4')[j].click()
                                    return await document.querySelectorAll('html>body>div>div>div>div>div>div>ul .episodes-item h4')[j].innerText
                                } catch (error) {
                                    console.log(error)
                                }
                            }, j)
                            await new Promise(resolve => setTimeout(resolve, 500));
                            console.log(episodeTitle);
                            episodeTitle = episodeTitle.substring(8);
                            console.log(episodeTitle);
                            if(episodeTitle){
                                //do nothing
                            }else{
                                episodeTitle = "Episode "
                            }
                            
                            let desc;
                            episodeDescription = await seasonPage.evaluate(async (j,desc) => {
                                try {
                                        desc=document.querySelectorAll('html>body>div>div>div>div>div>div>ul .episodes-item p')[0].innerText
                                     document.querySelectorAll('html>body>div>div>div>div>div>div>ul .episodes-item h4')[j].click();
                                    return await desc;

                                } catch (error) {
                                    console.log(error)
                                }
                            }, j,desc)
                            
                            console.log(episodeDescription)
                           
                            if (episodeDescription) {
                                //do nothing
                            } else {
                                episodeDescription = "Episode :" + episodeNumber
                            }
                            episodeUrl = await seasonPage.evaluate(async () => {
                                try {

                                    return await document.querySelectorAll('html>body>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>a')[0].href

                                } catch (error) {
                                    console.log(error)
                                }
                            })
                            if (episodeUrl) {
                                // do nothing
                            }else {
                                episodeUrl = await seasonPage.evaluate(async () => {
                                    try {
    
                                        return await document.querySelectorAll('html>body>div>div>div>div>div>div>ul>li>div>div>div>div>div>div>div>div>a')[5].href
    
                                    } catch (error) {
                                        console.log(error)
                                    }
                                })
                            }
                            if (episodeUrl) {
                                // do nothing
                            }else {
                                episodeUrl = await seasonPage.evaluate(async () => {
                                    try {
    
                                        return await document.querySelectorAll('.price-comparison__grid__row__holder a')[0].href
    
                                    } catch (error) {
                                        console.log(error)
                                    }
                                })
                            }
                            if (episodeUrl) {
                                // do nothing
                            }else {
                                episodeUrl = await seasonPage.evaluate(async () => {
                                    try {
    
                                        document.querySelectorAll('html>body>div>div>div>div>div>div>div>div>div>div>div>div>div>div>a')[5].href
    
                                    } catch (error) {
                                        console.log(error)
                                    }
                                })
                            }
                            if (episodeUrl) {
                                // do nothing
                            }else {
                                episodeUrl="/episodeUrl"
                            }
                            console.log(episodeUrl);
                            console.log(j);
                            console.log(episodeNumber)
                            console.log(episodeTitle)
                            console.log(episodeDescription)
                            console.log(episodeUrl)
                            episodeTitle=episodeTitle.replace(/\n/g, '');;
                            episodeDescription=episodeDescription.replace(/\n/g, '');
                            episodeDescription=episodeDescription.replace(/\"/g, '');
                            episodeObject = {
                                seasonId: seasonId,
                                episode: episodeNumber.toString(),
                                title: episodeTitle.toString(),
                                description:episodeDescription.toString(),
                                url: episodeUrl.toString()
                              };
                              episodesArray.push(episodeObject);
                            // await axios({
                            //     method: 'POST',
                            //     url: episodeCallUrl,
                            //     data: {
                            //         "seasonId": seasonId,
                            //         "episode": episodeNumber.toString(),
                            //         "title": episodeTitle.toString(),
                            //         "description": episodeDescription.toString(),
                            //         "url": episodeUrl.toString(),
                            //     }
                            // }).then(data => {
                            //     console.log(data.data)
                            // }).catch(err => {
                            //     console.log('in error')
                            //     console.log(err)
                            // })

                        }
                        await axios({
                            method: 'POST',
                            url: episodeCallUrl,
                            data: episodesArray
                        }).then(data => {
                            console.log(data.data)
                        }).catch(err => {
                            console.log('in error')
                            console.log(err)
                        })
                        seasonPage.close();
                    }

                    justWatchPage.close();
                    if(imdbPage){
                        imdbPage.close();
                    }
                                        // browser.close();
                    process.exit(1)

                })
                .catch((err) => {
                    console.log(" CAUGHT WITH AN ERROR ", err);
                })
        })()
    }
};

getUserList();