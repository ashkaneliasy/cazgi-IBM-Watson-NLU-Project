const express = require('express');
const app = new express();

/*This tells the server to use the client 
folder for all static resources*/
app.use(express.static('client'));

/*This tells the server to allow cross origin references*/
const cors_app = require('cors');
app.use(cors_app());

/*Uncomment the following lines to loan the environment 
variables that you set up in the .env file*/

const dotenv = require('dotenv');
dotenv.config();

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

function getNLUInstance() {
    
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });

    return naturalLanguageUnderstanding;
}


//The default endpoint for the webserver
app.get("/",(req,res)=>{
    res.render('index.html');
  });

//The endpoint for the webserver ending with /url/sentiment
app.get("/url/emotion", (req,res) => {
   
    const analyzeParams = {
       "url": req.query.url,
       "features": {
           "entities": {
               "emotion": true,
               "sentiment": true,
               "limit": 1
           },
           "keywords": {
               "emotion": true,
               "sentiment": true,
               "limit": 1
           }
       }
   }
   
   const naturalLanguageUnderstanding = getNLUInstance();
   
   naturalLanguageUnderstanding.analyze(analyzeParams)
   .then(analysisResults => {
       console.log(analysisResults);
       console.log(JSON.stringify(analysisResults.result.keywords[0].emotion,null,2));
       return res.send(analysisResults.result.keywords[0].emotion,null,2);
   })
   .catch(err => {
       return res.send("Could not do desired operation "+err);
   });
});

app.get("/url/sentiment", (req,res) => {
    
    const analyzeParams = {
       "url": req.query.url,
       "features": {
           "entities": {
               "emotion": true,
               "sentiment": true,
               "limit": 1
           },
           "keywords": {
               "emotion": true,
               "sentiment": true,
               "limit": 1
           }
       }
   }
   
   const naturalLanguageUnderstanding = getNLUInstance();
   
   naturalLanguageUnderstanding.analyze(analyzeParams)
   .then(analysisResults => {
       console.log(analysisResults);
       console.log(JSON.stringify(analysisResults.result.keywords[1].sentiment,null,2));
       return res.send(analysisResults.result.keywords[1].sentiment,null,2);
   })
   .catch(err => {
       return res.send("Could not do desired operation "+err);
   });
});

//The endpoint for the webserver ending with /text/emotion
app.get("/text/emotion", (req,res) => {
    
     const analyzeParams = {
       "text": req.query.text,
       "features": {
           "entities": {
               "emotion": true,
               "sentiment": true,
               "limit": 1
           },
           "keywords": {
               "emotion": true,
               "sentiment": true,
               "limit": 1
           }
       }
   }
   
   const naturalLanguageUnderstanding = getNLUInstance();
   
   naturalLanguageUnderstanding.analyze(analyzeParams)
   .then(analysisResults => {
       console.log(analysisResults);
       console.log(JSON.stringify(analysisResults.result.keywords[0].emotion,null,2));
       let resultAnalysis = JSON.stringify(
                analysisResults.result.emotion.document.emotion
                , null, 2);
            return res.send(resultAnalysis);
   })
   .catch(err => {
       return res.send("Could not do desired operation "+err);
   });
});


app.get("/text/sentiment", (req,res) => {
    
     const analyzeParams = {
       "text": req.query.text,
       "features": {
           "entities": {
               "emotion": true,
               "sentiment": true,
               "limit": 1
           },
           "keywords": {
               "emotion": true,
               "sentiment": true,
               "limit": 1
           }
       }
   }
   
   const naturalLanguageUnderstanding = getNLUInstance();
   
   naturalLanguageUnderstanding.analyze(analyzeParams)
   .then(analysisResults => {
       console.log(analysisResults);
       console.log(JSON.stringify(analysisResults.result.keywords[1].sentiment,null,2));
       let resultAnalysis = JSON.stringify(
                analysisResults.result.sentiment.document.sentiment
                , null, 2);
            return res.send(resultAnalysis);
   })
   .catch(err => {
       return res.send("Could not do desired operation "+err);
   });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

