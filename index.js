const request = require('request');
const express = require('express');
var axios = require("axios");
const schedule = require('node-schedule');
require('dotenv').config();
const moment = require('moment');


const app = express();

const rule = new schedule.RecurrenceRule()
rule.second = [10,30,50]

let now = moment(parseInt("1658066100000") + 0 * 60 * 1000).format("hh:mm");
rule.minute = [now.slice(3)-5,20+2,20+5]
console.log(now.slice(3)-5);

var messages = '';

schedule.scheduleJob(rule, function () {
    axios.get('https://api.openweathermap.org/data/2.5/weather?q=prachin buri&appid=76a5fd9779d2cd32c52aef182e657372').then(function (response) {
        let Weatherdata = [];

        console.log(response.data)
        tmp = response.data['main'].temp - 273.15
        Weatherdata.push({
            weather: response.data['weather'][0].main,
            description: response.data['weather'][0].description,
            temp: tmp.toFixed(2),
            name: response.data.name
        })

        // console.log(Weatherdata);
        messages = `อากาศ ${Weatherdata[0].name} วันนี\nสภาวะ ${Weatherdata[0].weather} , ${Weatherdata[0].description} \nอุณหภูมิ ${Weatherdata[0].temp} celcius`
        request({
            method: 'POST',
            url: 'https://notify-api.line.me/api/notify',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
                bearer: process.env.Token, //token
            },
            form: {
                message: messages, //ข้อความที่จะส่ง
            },
        }, (err, httpResponse, body) => {
            if (err) {
                console.log(err)
            } else {
                console.log(body)
            }
        })
            ;
        // Weathermain = response.data['weather']
        // console.log(Weathermain.main);

        console.log(messages);

    }).catch(function (error) {
        console.error(error);
    });
})

app.get('/', (req, res) => {
    res.send({ 'OK': true, 'Message': messages });
})

app.listen((process.env.PORT || 3000), () => { console.log(`server running at port ${process.env.PORT || 3000}`); });



