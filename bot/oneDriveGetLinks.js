const express = require('express');
const res = require('response');
const bodyParser = require('body-parser');
var oneDriveAPI = require('onedrive-api');
var axios = require('axios');
const url = require('url');
fs = require('fs')
var seriesArray= new Array();
var seasonsArray= new Array();
var episodesArray= new Array();
var episodeLinksArray= new Array();
var timedelay=920000000
var localUrl='http://localhost:3000/'
    var serverUrl='https://discoveryplus.herokuapp.com/'
    var baseUrl = serverUrl
    var updateSeriesEpisodesLinksUrl = localUrl+'series/updateEpisodeLinks';
var token='EwBwA8l6BAAUkj1NuJYtTVha%2bMogk%2bHEiPbQo04AASDbA2x75b5Px7KePpeJjUJfQSi0%2bd78n197Vygd3xAZrU/ByD2v6QMOWhsYx5REe6oGDYqxwjvbyIDLXOi8zoRceXeO/8R1WXpv0SrmZQ0Q4ahdrY3ZYV5mUQd7/KyKSdYQ0YeijF63xTlDPeaCd9Cbs305KWOslaJHGMT2KNyPUbr7QV9l9ppI4XYfsuix8al/Pk%2balMbZaffoxBbjHilzWIvbQ4sTWaAP2UKoz06jmjlMXx%2bl4QWmHOhUaIRcAnjMo82CARl/TEQ2YMnQbaoKSBPYooxySyJUZd2qJrPNdZA1Bc4d2WHh8r4CobVElDylxo0vphx56DiW19eD1msDZgAACB0RAsfDwxDWQAIRMltlUq766CSn7u6O/pXAJdeHTV7WorTFZyXODSIKs0H%2bU64iBBZu6hIlsY%2bqlJWH9hMvvuaTLpOr/pajGoRcc/PY2ShBqVcPpf0Si5J2zYorFAx0mWFhlP6KN/Lp/h2KCUzFnk6gUoGgbkw1aFHAfPGzhdzmBEeIXp30r7L3MnRWCW7fXYm4mNmcCbUBnhRLO0SdGc%2bWkJADPs6yPWqogu6Jxll0wo4zlmd6upVWMoo8g5ZF9IvaZLY7sEWt%2bBYNM2yoXNt/GTbE2TR991cmObBuc9VNgajleoH9zROrdQeNOoNEHMrEzt0YLQnivMPptN3lW3z9GYTgmFymdtXubXuUVWKjrhREYwuwpGakov3uFq8TtXZl8rmntU2uu51RW2I5JgfcNnNKWV3dQXLextWBBieSJjsRMLm%2bUc8wKcDINPV5EQM1bEuTRxkuhHUjgT6Ce%2bnWUDLynV4HIBmyK9L08VY8RtS91HE82Cj1X3MEcrEUk2%2bwYZiOGUh9tbMZIDmFZAxvle/03GF8TxDoiaI0GzzZf694Co8pWvfJlZVKDOOY0W/Y2l2MdyhYDtzq5nPrfbtT8OdS%2bDRyjpXmkRp6jR5Sx%2bGinZZH399SA23gAhjYvCzxs290/SB/gKKPCKQsUGZjMtS1yPERRs8V5NcZkv6xuD26X7JavV1QE31MLr%2b3rhy86zW6kVB1Tj6snLF7W0/Rtg5VFrGwCNRrN8dJ/ka1JPbzaEBgwne6tLB8pRAtLqOcqz0FnjLj6GxyAg%3d%3d&token_type=bearer'
const app = express();
app.listen(8000, (req,res) => {
  console.log("Server is listening on port 8000");
  uploadSeriesToTextFile();
});
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.get('/', (req, res) => {
  // res.send("<html> <head>server Response</head><body><h1> This page was render direcly from the server <p>Hello there welcome to my website</p></h1></body></html>");
        axios({
            method: 'get',
            url: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=1f1dc83b-29c6-45c1-a5ba-183d4addcf87&scope=files.readwrite&response_type=token&redirect_uri=http://localhost:8000/getAuth',
            // url: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=b9543efb-d40b-4cad-a50c-a84e0f5aefb2&scope=files.readwrite&response_type=token&redirect_uri=http://localhost:8000/getAuth',
             headers: { 
                  'Cookie': 'buid=0.AScCDQSIkWdsW0yxEjajBLZtrTvIHR_GKcFFpboYPUrdz4czAAA.AQABAAEAAAD--DLA3VO7QrddgJg7WevrNTcXn6Qd4XHekEVFCbQG_uedL8Kp4dK3ITVqdMFE1msnVj41egC_h20q6l-mJ74HIRVpuqwW1OVvYXb4_IO8atW92ZLvKbP_VfgXzTae6VYgAA; esctx=AQABAAAAAAD--DLA3VO7QrddgJg7WevrBqOfQL_WqB-gXvgO-IDIJS9gntVsXQ8q4QxkD4eh_txs5hlMioSKEIWNRlIse2GTqgka4bDVZxCrgR9r9zvXNBrPuPovmQsYJwDyQhS2RGquh45Wwpvv9NDxkBChOrY6gTtdMRrjZc23nPA2bYhInv8xDaw91nh9DBhvrKHYvecgAA; fpc=AjkVxaJKJI5Lq1hbpXcfLDc9CUIPAQAAALtXoNoOAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd'
              }
        }).then(data => {
            res.send(data.data)
        }).catch(err => {
            console.log('in error')
            console.log(err)
        })
});
app.get('/getAuth', (req, res) => {
  const path = url.parse(req.url).path;
  console.log(path);
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  var fullUrl1 = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(req.params)
  console.log(req.body)
  // var currentUrl = window.location.href;
  console.log(fullUrl)
  console.log(fullUrl1)
  console.log(url.href)
  // console.log(currentUrl)
  res.json({"message": "Token Generated Succesfully"});
});

  
  async function getSeries(seriesName,seasonName){
    setTimeout(() => {
      console.log("Delayed for 1 second.");
    }, timedelay)
  return new Promise(async (resolve)=> {

    try {
      var getSeries,getSeasons,getEpisodes,getEpisodeIframUrl;
      var getIframeLink;
        oneDriveAPI.items
      .listChildren({
        accessToken: token,
       
      })
      .then((item) => {
        fs.createWriteStream('public/seriesData.txt', { overwrite: true });
        for(let i=0;i<item.value.length;i++){
          if(item.value[i].name==="Mercurysols"){
            console.log(item.value[i].name)
            console.log(seriesName)
            res(item.value[i].id)
            getSeriesFolders(item.value[i].id,seriesName,seasonName)
            break;
            }
          }
        // resolve(item.response)/
        }).catch(e => {
          if(e.response.statusCode==401){
            console.log("Token Is Expired Kindly generate the token again : ")
          }
      });

    } catch(e) {
      console.log('Error:', e.stack);
    }

  });
 }

 async function getSeriesFolders(cloudFolderId,seriesName,seasonName){
  setTimeout(() => {console.log("This is the first function")}, timedelay);
  return new Promise(async (resolve)=> {

    console.log(cloudFolderId)
      var getSeries;
        oneDriveAPI.items
      .listChildren({
        accessToken: token,
        itemId: cloudFolderId,
      })
      .then((item) => {
        getSeries=item;
        setTimeout(() => {console.log("This is the first function")}, timedelay);
        for(let i=0;i<getSeries.value.length;i++){
          if(getSeries.value[i].name===seriesName){
            console.log(getSeries.value[i].name)
            console.log(getSeries.value[i].id)
            setTimeout(() => {console.log("This is the first function")}, timedelay);
            getSeasonsFolderInSeriesFolder(getSeries.value[i].id,getSeries.value[i].name,seasonName)
            setTimeout(() => {console.log("This is the first function")}, timedelay);
            // break;
          }
        }
      });

  });
    
}
async function getSeasonsFolderInSeriesFolder(seriesFolderId,seriesName,seasonName){
  setTimeout(() => {console.log("This is the first function")}, timedelay);
  return new Promise(async (resolve)=> {
      var getSeasons;
      oneDriveAPI.items
    .listChildren({
      accessToken: token,
      itemId: seriesFolderId,
    })
    .then((item) => {
      setTimeout(() => {console.log("This is the first function")}, timedelay);
      getSeasons=item;
      for(let i=0;i<getSeasons.value.length;i++){ 
        setTimeout(() => {console.log("This is the first function")}, timedelay);
        if(getSeasons.value[i].name===seasonName){
          getEpisodesInSeasonFolder(getSeasons.value[i].id,getSeasons.value[i].name,seriesName)
          setTimeout(() => {console.log("This is the first function")}, timedelay);
        }
        setTimeout(() => {console.log("This is the first function")}, timedelay);
      }
    });
  });
 
}
async function getEpisodesInSeasonFolder(seasonFolderId,seasonName,seriesName){
  setTimeout(() => {console.log("This is the first function")}, timedelay);
  return new Promise(async (resolve)=> {
    var getEpisodes;
    oneDriveAPI.items
  .listChildren({
    accessToken: token,
    itemId: seasonFolderId,
  })
  .then((item) => {
    setTimeout(() => {console.log("This is the first function")}, timedelay);
    getEpisodes=item;
    for(let i=0;i<getEpisodes.value.length;i++){
      setTimeout(() => {console.log("This is the first function")}, timedelay);
      getEpisodeUrlAndName(getEpisodes.value[i].id,getEpisodes.value[i].name,seasonName,seriesName)
      setTimeout(() => {console.log("This is the first function")}, timedelay);
    }
   });
 });
  
}
async function getEpisodeUrlAndName(videoId,episodeName,seasonName,seriesName){
  setTimeout(() => {console.log("This is the first function")}, timedelay);
  return new Promise(async (resolve)=> {
    var getOneDriveVideoLink
    var data = JSON.stringify({
      "type": "embed"
    });
    var config={
      method: 'post',
      url: 'https://graph.microsoft.com/v1.0/me/drive/items/'+videoId+'/createLink',
      headers: { 
        'Authorization': 'Bearer '+token+'', 
        'Content-Type': 'application/json'
      },
      data : data
    };
    setTimeout(() => {console.log("This is the first function")}, timedelay);
      axios(config)
      .then(function (response) {
        setTimeout(() => {console.log("This is the first function")}, timedelay);
        var seriesData
        getOneDriveVideoLink=response.data
        response.data.link.webUrl=response.data.link.webUrl.replace(/embed/g, "download")
        response.data.link.webHtml=response.data.link.webHtml.replace(/embed/g, "download")
        console.log(seriesName+"::"+seasonName+"::"+episodeName+"::"+response.data.link.webUrl)
        seriesData=seriesName+"::"+seasonName+"::"+episodeName+"::"+response.data.link.webUrl+"\r\n"
        fs.appendFile('public/seriesData.txt', seriesData, function (err,seriesData) {
            if (err) {
              return console.log(err);
            }
          });
        })
      .catch(function (error) {
        console.log(error);
      });  
      
 });
}

function uploadSeriesToTextFile(){
  const prompt = require('prompt-sync')();
  var seriesName = prompt('Enter The Series Name :');
  var seasonName = prompt('Enter The Season Number :');
  var getcloudFolderId=getSeries(seriesName,seasonName)
}
// listen for requests

app.post('/uploadToCsv', (req, res) => {
    uploadToCsv()
    res.json({"message": "Data is Uploading tocsv"});
});

app.post('/uploadToDatabase', (req, res) => {
  uploadToDatabase()
  res.json({"message": "Data is Uploading database"});
});
function getSeriesFoldersName(cloudFolderId,seriesName){
  console.log(cloudFolderId)
    var getSeries;
      oneDriveAPI.items
    .listChildren({
      accessToken: token,
      itemId: cloudFolderId,
    })
    .then((item) => {
      getSeries=item;
      console.log(getSeries)
      for(let i=0;i<getSeries.value.length;i++){
        if(getSeries.value[i].name===seriesName){
          console.log(getSeries.value[i].name)
          console.log(getSeries.value[i].id)
          getSeriesFolders(item.value[i].id)
          getSeasonsFolderInSeriesFolder(getSeries.value[i].id,getSeries.value[i].name)
        }
      }
    });
}
function uploadToDatabase(){
  var seriesId,seasonNumber
  var seriesData = fs.readFileSync('public/seriesData.csv').toString();
  console.log(seriesData)
  seriesId=seriesData.split('\n')
  seriesId=seriesId[1].split(',')
  seriesId=seriesId[6]
  seasonNumber=seriesId[7]
  console.log(seriesId)
  requestData={
    "id":seriesId,
    "season_number":seasonNumber,
    seriesData
  }
  axios({
    method: 'POST',
    url: updateSeriesEpisodesLinksUrl,
    data: requestData
  }).then(data => {
      console.log(data.data)
  }).catch(err => {
      console.log('in error')
      console.log(err)
  })
  var series,seasonNumber,episodeNumber,retriveSeasonNumberAndEpisodeNumber
  var data=`series,season,episode,link,season_number,episode_number,series_id`;
  console.log("Series Uploades to Database") 
 
}

function uploadToCsv(){
  fs.createWriteStream('public/seriesData.csv', { overwrite: true });
  var seriesData = fs.readFileSync('public/seriesData.txt').toString();
  seriesData=seriesData.split('\n')
  // console.log(seriesData);
  var series,seasonNumber,episodeNumber,retriveSeasonNumberAndEpisodeNumber
  var data=`series,season,episode,link,season_number,episode_number,series_id,season_number`;
  var re = new RegExp('_S(.*)_');
  for(let i=0;i<seriesData.length-1;i++){
    seriesData[i]=seriesData[i].split('::')
    seriesData[i][3]=seriesData[i][3].replace('\r', '')
    console.log(seriesData[i][2])
    retriveSeasonNumberAndEpisodeNumber=seriesData[i][2].match(re)
    retriveSeasonNumberAndEpisodeNumber=retriveSeasonNumberAndEpisodeNumber[1].split('E')
    seasonNumber=retriveSeasonNumberAndEpisodeNumber[0]
    episodeNumber=retriveSeasonNumberAndEpisodeNumber[1]
    console.log(seasonNumber)
    console.log(episodeNumber)
    series='\r\n'+seriesData[i][0]+','+seriesData[i][1]+','+seriesData[i][2]+','+seriesData[i][3]+'';
    console.log(series)
    series='\r\n'+seriesData[i][0]+','+seriesData[i][1]+','+seriesData[i][2]+','+seriesData[i][3]+','+seasonNumber+','+episodeNumber+','+" "+'';
    console.log(series)
    data=data+series
  }
  fs.writeFile("public/seriesData.csv", data, "utf-8", (err) => {
  if (err) console.log(err);
      else console.log("Data saved");
  });
  console.log("Series Uploades to Csv") 
 
}

 app.get('/getSeriesData', (req, res) => {
  var getSeries,getSeasons,getEpisodes,getEpisodeIframUrl;
  var getIframeLink;
    oneDriveAPI.items
  .listChildren({
    accessToken: token,
    itemId: "6C853C24785D1AF9",
  })
  .then((item) => {
    fs.createWriteStream('public/seriesData.txt', { overwrite: true });
    console.log(item)
    for(let i=0;i<item.value.length;i++){
      console.log(item.value[i].name)
      if(item.value[i].name==="mercurysols"){
        console.log(item.value[i].name)
        console.log(item.value[i].id)
        getSeriesFolders(item.value[i].id)
      }
    }
    res.json(item)
  });
});