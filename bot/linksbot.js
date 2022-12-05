var express=require("express");
var router=express.Router();
var axios = require('axios');
var oneDriveAPI = require('onedrive-api');
let token="EwBoA8l6BAAUkj1NuJYtTVha%2bMogk%2bHEiPbQo04AAUeVY7sUHljNIoWpHCWN2%2bHYqAKf1R%2bKgbY44OyHIvS0oHYrf/Zq84lsT32uu34W0yeZjKCLeN1mLzcGK03bTOr09BHMg5Rko8RM3J8sx/CfAM2cBpFA8h45/21BZkcHHQd2cIMhxjTVNBe%2byx4yFhphrqwESOgKFcwX6fOwK6I/JbdyI9TC5y8DJZ/CYlHAOWCxYmPuioeuQaOcrLE6Ui0sIqrQBLUY%2bSBY1Ft5koQkFnFUJT/gSPSnSrPVZIsTiUbM%2bMbDhMoQzFoJTVtHYQAcEn7EEyt2lNTo4zMH%2bVc%2bHmWaKVcCTiWQDPUl1uNrINkHwIiMJJqHS%2bEOuAIAAwsDZgAACK/yGfxRLeHQOAIYQQF2v5ua66DgOUCpA4o6DVVk9xx6rbYzkFYMgnfES74jwym8x2oxddXMOFg9AgPQITLyPTR0MF8y/XaZZC4u0PEr2RrMvX9cNTo/BQ2eM4DWuzWK5l5KuU3oN2yzD37%2bKzlrd8MivGl20H0QfGu5M0CHz0CuPBKu51FqedF1cgAAd/UfWwRA%2bVduC8cWW3G1MOwx6HlsfGWZeLcf8xWOGfVmrIqTHO14eh5VmxrNp5Lp1UaVqoPi1AkoFkGHGPhT1WgzxHzCWL45LCONkF/4KYBGyNk6oe%2bK2WB1sgcpuTI/%2bbiUxO8S44hm49FD2iDqtx256QM5vSd%2bcjgC6MaO4gqtyg6u%2bhC2ORPp8WyKPCi6uVrA/P/xVJ4DtkpRBqiDIx0xOv1qmLY8u9vUxWfH/%2bp6BihBJyXTO9UoQpP6pB7dyiM0ud8ilnjkhnYDI7oxOiYPm%2bAJQBeQKF3BzprsrC310hpG1122InnIogy8QZF/qMzZIB7dEaWMkI1Q371MKUSojo6vCL7452iuqjBSrnVjypvRYwlCEyP/B9GcwaQ8Whh/3RYj%2b%2bB8hTOpnbEkzBzOMz2Q9uEHzGFrvSZaKArzgyV5qAhaeL/kjLdo0QpwwY34JBWAocRo38%2bGnw1xETqH5pY%2bqYjDiN5Ejz%2bVnusuoz9wP2QWCfx3mj5udYjmSZcTPwEfCWuaE8KuPwcVhQx7yyFYO7cgWw%2b3fzSBnsczpkpSyHZAJRC2e3L2JOybfVZcRrpZcgI%3d&token_type=bearer"
let fs=require("fs");
const { Router } = require("express");
const app=express()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.bodyParser());
var url = require('url');
var localUrl='http://localhost:3000/'
var serverUrl='https://discoveryplus.herokuapp.com/'
var baseUrl = serverUrl
var updateSeriesEpisodesLinksUrl = localUrl+'series/updateEpisodeLinks';
var updateOneEpisodeLink = localUrl+'series/updateOneEpisodeLink';
var seriesName
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
 
app.listen(8000, (req,res) => {
    console.log("Server is listening on port 8000");
});
app.get("/getSeriesFolder",async (req,res)=>{
 try{
  
var url_parts = url.parse(req.url, true);
var query = url_parts.query;
  console.log(query['seriesName'])
    let rootDir=await oneDriveAPI.items
    .listChildren({
      accessToken: token,
    })
    let mainFolderItem="";
    for(let i=0;i<rootDir.value.length;i++){
      
      if(rootDir.value[i].name==="Mercurysols"){
        mainFolderItem=rootDir.value[i]
      }
    }
    //********************************get all series names */
    try{
        let seriesList=await oneDriveAPI.items
        .listChildren({
        accessToken: token,
        itemId: mainFolderItem.id,
        })
        mainFolderItem.serieslist=seriesList.value

        //*******************************************get seasons list of single series list */

     

try{
    for(let i=0;i<mainFolderItem.serieslist.length;i++){
        let seasonArr=await oneDriveAPI.items
            .listChildren({
            accessToken: token,
            itemId: mainFolderItem.serieslist[i].id,
            })
            mainFolderItem.serieslist[i].seasonlist=seasonArr.value
    }
    console.log(mainFolderItem)
    //***********************************get videos of every season */
    for(let i=0;i<mainFolderItem.serieslist.length;i++){
        let seriesName=mainFolderItem.serieslist[i].name
        let seasonName;seasonName
        let sesonlistdemo=mainFolderItem.serieslist[i].seasonlist
            for(let j=0;j<sesonlistdemo.length;j++){
              seasonName=sesonlistdemo[j].name
                // if(seriesName===query['seriesName']){
                  let vaideoArr=await oneDriveAPI.items
                .listChildren({
                accessToken: token,
                itemId: sesonlistdemo[j].id,
                })
                // mainFolderItem.serieslist[i].seasonlist[j].episodes={
                //   count: vaideoArr.value.length,
                //   episodes: vaideoArr.value
                // };
                mainFolderItem.serieslist[i].seasonlist[j].episodes=vaideoArr.value
              // }
            }
            //break;
    }
    
    //******************************************Get embed links */
    // for(let i=0;i<mainFolderItem.serieslist.length;i++){
    //   //***condition for series check */
    //   if(mainFolderItem.serieslist[i].name===query['seriesName']){
    //     await delay(150000) /// waiting 1 second.
    //     let sesonlistdemo=mainFolderItem.serieslist[i].seasonlist
    //     for(let j=0;j<sesonlistdemo.length;j++){

    //       if(sesonlistdemo[j].name===query['seasonName']){
    //         let episodesListDemo=sesonlistdemo[j].episodes
    //         for(let k=0;k<episodesListDemo.length;k++){
    //           console.log(episodesListDemo[k].id)
    //             var data = JSON.stringify({
    //                 "type": "embed"
    //               });
    //               var config={
    //                 method: 'post',
    //                 url: 'https://graph.microsoft.com/v1.0/me/drive/items/'+episodesListDemo[k].id+'/createLink',
    //                 headers: { 
    //                   'Authorization': 'Bearer '+token+'', 
    //                   'Content-Type': 'application/json'
    //                 },
    //                 data : data
    //               };
    //               try{
    //                 let axisoResp=await axios(config);
    //                 mainFolderItem.serieslist[i].seasonlist[j].episodes[k].embedLink=axisoResp.data
    //               }catch(err3){

    //               }    
    //         } 
    //       }
              
    //       // break;
    //     }
    //   }
       
    //         //break;
    // }


    //=========================save data in csv
fs.createWriteStream('public/seriesData.csv', { overwrite: true });
    let countEpisodes=0;
    data=`seriesName,seasonNo,episodeNo,episodeId`;
    let seriesName,seasonNo,episodeNo,episodeLink,seasonArray,episodesArray,oneEpisodeData,episodeId
    for(let i=0;i<mainFolderItem.serieslist.length;i++){
      seasonArray=mainFolderItem.serieslist[i]
      console.log("series name")
      seriesName=seasonArray.name
      console.log(seriesName)

     // if(seriesName===query['seriesName']){
        for(let j=0;j<seasonArray.seasonlist.length;j++){
           seasonName=seasonArray.seasonlist[j].name
          // console.log(seasonNo)
         // if(seasonName===query['seasonName']){
            episodesArray=seasonArray.seasonlist[j].episodes
            console.log(episodesArray.length)
            for(let k=0;k<episodesArray.length;k++){
              var re = new RegExp('_S(.*)_');
              let regexData = episodesArray[k].name.match(re);
              regexData = regexData[1].split('E')
              if(regexData[0][0]==='0') {
                seasonNo = regexData[0].replace('0', '');
              }
              else{
                seasonNo = regexData[0];
              }
              if(regexData[1][0]==='0') {
                episodeNo = regexData[1].replace('0', '');
              }
              else{
                episodeNo = regexData[1];
              }
              console.log("seasonNo", seasonNo)
              console.log("episodeNo", episodeNo)
              episodeId=episodesArray[k].id
              // if(episodeLink=episodesArray[k].embedLink){
              //   episodeLink=episodesArray[k].embedLink.link.webUrl
              //   episodeLink=episodeLink.replace(/embed/g, "download")
              // }
              
              oneEpisodeData='\r\n'+seriesName+','+seasonNo+','+episodeNo+','+episodeId+'';
              data=data+oneEpisodeData
            }
            console.log(oneEpisodeData)
         // }
          
        }
     // }
    }
    fs.writeFile("public/seriesData.csv", data, "utf-8", (err) => {
      if (err) console.log(err);
          else console.log("Data saved");
      });
  //  console.log(countEpisodes)



    // fs.createWriteStream('public/seriesData.csv', { overwrite: true });
    // let countEpisodes=0;
    // data=`seriesName,seasonName,episodeName,episodeLink`;
    // let seriesName,seasonName,episodeName,episodeLink,seasonArray,episodesArray,oneEpisodeData
    // for(let i=0;i<mainFolderItem.serieslist.length-21;i++){
    //   seasonArray=mainFolderItem.serieslist[i]
    //   console.log("series name")
    //   seriesName=seasonArray.name
    //   console.log(seriesName)
    //   for(let j=0;j<seasonArray.seasonlist.length;j++){
    //     console.log("season name")
    //     seasonName=seasonArray.seasonlist[j].name
    //     console.log(seasonName)
    //     episodesArray=seasonArray.seasonlist[j].episodes
    //     console.log(episodesArray.length)
    //     for(let k=0;k<episodesArray.length;k++){
    //       episodeName=episodesArray[k].name
    //       console.log(episodeName)
    //       // episodeLink=episodesArray[k]['@microsoft.graph.downloadUrl']
    //       episodeLink=episodesArray[k].embedLink.link.webUrl
    //       episodeLink=episodeLink.replace(/embed/g, "download")
    //       oneEpisodeData='\r\n'+seriesName+','+seasonName+','+episodeName+','+episodeLink+'';
    //       data=data+oneEpisodeData
    //     }
    //     console.log(oneEpisodeData)
    //   }
    // }
    // fs.writeFile("public/seriesData.csv", data, "utf-8", (err) => {
    //   if (err) console.log(err);
    //       else console.log("Data saved");
    //   });
    // console.log(countEpisodes)
    
    res.send(mainFolderItem)
    

    //******************************************End of embed link */

    //***********************************End  videos of every season */


}catch(err2){
    console.log(err2.message)
}

        //*****************************************End seasons list of single series list */

    }catch(err1){
        console.log(err1.message)
    }

    //**********************************End all series names */

 }catch(err){
    console.log(err.message)
 }
   
})
module.exports=router;

//============================================================================start code for token generation


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
    res.json({"message": "Token Generated Succesfully"});
  });
  app.post('/uploadToDatabase', (req, res) => {
    uploadToDatabase()
    res.json({"message": "Data is Uploading database"});
  });
  app.post('/uploadLinkToDatabse', (req, res) => {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log(query['seriesName']);
    var resData={
      "seriesName":query['seriesName'],
      "seasonNumber":query['seasonNumber'],
      "episodeNumber":query['episodeNumber'],
      "episodeLink":query['episodeLink'],
    }
      axios({
        method: 'POST',
        url: updateOneEpisodeLink,
        data: resData
      }).then(data => {
          console.log(data.data)
      }).catch(err => {
          console.log('in error')
          console.log(err)
      })
    
    res.json({"message": "Data is Uploading database"});
  });
  function uploadToDatabase(){
    var seriesData = fs.readFileSync('public/seriesData.csv').toString();
    seriesData=seriesData.split('\n')
    axios({
      method: 'POST',
      url: updateSeriesEpisodesLinksUrl,
      data: seriesData
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
  

  function loopOnedrive(id){
    return new Promise((resolve,reject)=>{
        oneDriveAPI.items
        .listChildren({
        accessToken: token,
        itemId: id,
        })
        .then((item) => {
        resolve(item)
        }).catch(e=>{
            reject(e.message)
        });
      })
  }

  //=============================================================================   end code for token generation