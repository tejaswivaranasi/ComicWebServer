const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const amount = require('./modules/number');
const app = express();
const port = process.env.PORT || 3000;
//creating a database
const db = require('./modules/mongourl').mongoURI;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

mongoose
    .connect(db)
    .then(() => console.log('mongodb is connected'))
    .catch(err => console.log(err));


    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

//connecting with api
app.get('/',(req, res) => {
    const api = 'http://xkcd.com/info.0.json';
    apigetter(api, res, count);

}); 

app.get('/:num',(req, res) => {
    const num = req.params.num;
    console.log(num);
    const api = `https://xkcd.com/${num}/info.0.json`;
    apigetter(api, res, count)
});

function apigetter(url, res, count) {
        fetch(api)
            .then(resapi => resapi.json())
            .then(data => {
                amount.comic({num:data.num})
                    .then(count =>{
                    if(count){//we do this to check how many times we visited that page
                        count.count = count.count+1;
                        count.save()
                        .then(count => {
                            res.json({
                            "month" : data.month,
                            "num" : data.num,
                            "year" : data.year,
                            "title": data.title,
                            "img": data.img,
                            "count" : count.count
                            })
                        })
                        .catch(err => console.log(err));
                    }
                    else{
                        const newAmount = new amount({
                        num : data.num,
                        count : 1
                        });
                        newAmount.save()
                        .then(count => {
                            res.json({
                                "month" : data.month,
                                "num" : data.num,
                                "year" : data.year,
                                "title": data.title,
                                "img": data.img,
                                "count" : count.count
                            })
                        })
                        .catch(err => console.log(err));
                    }
                    })
                    .catch(err => console.log(err));
                }
            
            );
}



app.listen(port, () => console.log("port 3000"));
// app.use(express.static('public'))



