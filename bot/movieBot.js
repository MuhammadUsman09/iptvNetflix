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
    var castCallUrl = baseUrl + 'cast';
    var movieCallUrl = baseUrl + 'movie';
    var genreCallUrl = baseUrl+'genre';
    var seasonCallUrl = baseUrl+'season';
    var episodeCallUrl = baseUrl+'episode';
    let justWatchMovieUrl ;
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
            justWatchMovieUrl = prompt('Enter Movie Url : ');
            console.log(justWatchMovieUrl);
            puppeteer.launch({ headless: false })
                .then(async (browser) => {
                    //for justwatch page data
                    let justWatchPage = await browser.newPage()
                    justWatchPage.setViewport({ width: 1366, height: 768 });
                    let justWatchUrl = justWatchMovieUrl
                    await justWatchPage.goto(justWatchUrl, { waitUntil: 'networkidle2', timeout: 0 })
                    //await page.screenshot({ path: 'example.png' })
                    await justWatchPage.evaluate(async () => {
                        await window.scrollBy(0, window.innerHeight);
                        await window.scrollBy(0, window.innerHeight);
                    });
                    let videoUrl = await justWatchPage.evaluate(async () => {
                        try {
                            document.querySelector('.youtube-player__play-button.youtube-player__play-button--backdrop').click()
                            return await document.querySelector("html>body>div>div>div>div>div>div>iframe").src
                            // document.waitForSelector('#youtube-player-tcrNsIaQkb4-backdrop')
                            // return await document.querySelector('#youtube-player-tcrNsIaQkb4-backdrop').src
                        } catch (error) {
                            console.log(error)
                        }
                    })
                    console.log(videoUrl);
                    let movieTitle = await justWatchPage.evaluate(async () => {
                        try {
                            return await document.querySelector('html>body>div>div>div>div>div>div>div>div>div>h1').innerText
                        } catch (error) {
                            console.log(error)
                        }
                    })
                    console.log(movieTitle);
                    const movieYear = await justWatchPage.evaluate(async () => {
                        try {
                            return await document.querySelector('html>body>div>div>div>div>div>div>div>div>div>span').innerText
                        } catch (error) {
                            console.log(error)
                        }
                    })
                    console.log(movieYear);
                    const movieDuration = await justWatchPage.evaluate(async () => {
                        try {
                            return await document.querySelectorAll('html>body>div>div>div>div>div>div>aside>div>div>div>div')[5].innerText
                        } catch (error) {
                            console.log(error)
                        }
                    })
                    console.log(movieDuration);
                    // let movieStoryLine = await justWatchPage.evaluate(async () => {
                    //     try {
                    //         // return await document.querySelector('html>body>div>div>div>div>div>div>div>div>p>span').innerText
                    //         return await document.querySelector('html>body>div>div>div>div>div>div>div>div>p').innerText
                    //     } catch (error) {
                    //         console.log(error)
                    //     }
                    // })
                    // if (movieStoryLine) {
                    //     //do nothng
                    // } else {
                    //     movieStoryLine = "Movie StoryLine"
                    // }
                    // console.log(movieStoryLine)
                    var imgUrl
                    do {
                        imgUrl = await justWatchPage.evaluate(async () => {
                            try {
                                return await document.querySelector("html>body>div>div>div>div>div>div>aside>div>div>picture>img").src
                                // return await document.querySelector('.picture-comp__img.lazyautosizes.ls-is-cached.lazyloaded').src
                            } catch (error) {
                                console.log(error)
                            }
                        })
                      } while (imgUrl.includes('gif;base64'));
                        
                    console.log(imgUrl);
                    movieUrl = await justWatchPage.evaluate(async () => {
                        try {

                            return await document.querySelectorAll('html>body>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>a')[0].href

                        } catch (error) {
                            console.log(error)
                        }
                    })
                    if (movieUrl) {

                    } else {
                        movieUrl = "/movieUrl"
                    }
                    console.log(movieUrl);
                    
                    // for imdb page data
                    const imdbUrl = await justWatchPage.evaluate(async () => {
                        try {
                            console.log('get imdb url');
                            return await (document.querySelectorAll('html>body>div>div>div>div>div>div>div>div>div>div>div .jw-scoring-listing__rating a'))[1].href
                        } catch (error) {
                            console.log(error)
                        }
                    })
                    console.log(imdbUrl);
                    

                    let imdbPage = await browser.newPage()
                    imdbPage.setViewport({ width: 1366, height: 768 });
                    await imdbPage.goto(imdbUrl, { waitUntil: 'networkidle2', timeout: 0 })
                    //await page.screenshot({ path: 'example.png' })
                    await imdbPage.evaluate(async () => {
                        await window.scrollBy(0, window.innerHeight);
                        await window.scrollBy(0, window.innerHeight);
                    });
                    let movieStoryLine = await imdbPage.evaluate(async () => {
                        try {
                            // return await document.querySelector('html>body>div>div>div>div>div>div>div>div>p>span').innerText
                            // return await document.querySelector('html>body>div>div>div>div>div>div>div>div>p').innerText
                            return await document.querySelector('.sc-16ede01-2.gXUyNh').innerText
                        } catch (error) {
                            console.log(error)
                        }
                    })
                    if (movieStoryLine) {
                        //do nothng
                    } else {
                        movieStoryLine = "Movie StoryLine"
                    }
                    

                    if (videoUrl) {
                        //do nothing
                    } else {
                        videoUrl = await justWatchPage.evaluate(async () => {
                            try {
                                // document.querySelector('.youtube-player__play-button.youtube-player__play-button--backdrop').click()
                                return await document.querySelector("html>body>div>div>div>div>div>div>iframe").src
                                // document.waitForSelector('#youtube-player-tcrNsIaQkb4-backdrop')
                                // return await document.querySelector('#youtube-player-tcrNsIaQkb4-backdrop').src
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
                    console.log(videoUrl)
                    const rating = await imdbPage.evaluate(async () => {
                        try {
                            return await document.querySelector("main>div>section>section>div>section>section>div>div>div>div>a>div>div>div>div>span").innerText
                        } catch (error) {
                            console.log(error)
                        }
                    })
                    console.log(rating);
                    const genreName = await justWatchPage.evaluate(async () => {
                        try {
                            return await document.querySelector("html>body>div>div>div>div>div>div>aside>div>div>div>div>span").innerText
                        } catch (error) {
                            console.log(error)
                        }
                    })
                    console.log(genreName);
                    console.log(genreName);
                    console.log('genrename');
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
                    movieTitle=movieTitle.replace(/\n/g, '')
                    movieStoryLine=movieStoryLine.replace(/\n/g, '')
                    let movieId;
                    await axios({
                        method: 'POST',
                        url: movieCallUrl,
                        data: {
                            "title": movieTitle,
                            "description": movieStoryLine,
                            "rating": rating,
                            "year": movieYear,
                            "duration": movieDuration,
                            "genreId": genreId,
                            "image": imgUrl,
                            "trailer": videoUrl,
                            "url":movieUrl
                        }
                    }).then(data => {
                        console.log(data.data)
                        movieId = data.data['_id']
                        console.log(movieId)
                    }).catch(err => {
                        console.log('in error')
                        console.log(err)
                    })
                    
                    const getCastLength = await imdbPage.evaluate(async () => {
                        try {
                            // return await document.querySelector('.ipc-sub-grid.ipc-sub-grid--page-span-2.ipc-sub-grid--wraps-at-above-l.ipc-sub-grid--4-unit-at-s.ipc-shoveler__grid').children.length
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
                                // return await document.querySelector('.ipc-sub-grid.ipc-sub-grid--page-span-2.ipc-sub-grid--wraps-at-above-l.ipc-sub-grid--4-unit-at-s.ipc-shoveler__grid').children[i].innerText;
                                return await document.querySelector('.ipc-sub-grid.ipc-sub-grid--page-span-2.ipc-sub-grid--wraps-at-above-l.ipc-shoveler__grid').children[i].innerText;
                            } catch (error) {
                                console.log(error)
                            }
                        }, i)
                        console.log(actorDeatils);
                        actorName = actorDeatils.substring(0, actorDeatils.indexOf('\n'));
                        actorDeatils = actorDeatils.substring(actorName.length + 1);
                        actorRole = actorDeatils;
                        console.log(actorName);
                        console.log(actorRole);
                        await axios({
                            method: 'POST',
                            url: castCallUrl,
                            data: {
                                "streamId": movieId,
                                "name": actorName,
                                "role": actorRole,
                                "episodes": "-",
                                "year": "-",
                                "detail": "-"
                            }
                        }).then(data => {
                            console.log(data.data)
                        }).catch(err => {
                            console.log('in error')
                            console.log(err)
                        })
                    }
                    justWatchPage.close();
                    imdbPage.close();
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