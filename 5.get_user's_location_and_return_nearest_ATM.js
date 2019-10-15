// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, ActivityTypes } = require('botbuilder');
const { Activity } = require('botframework-schema')

const ATMS = [
    {
        "type": "location",
        "title": "Shibuya ATM",
        "address": "〒150-0002 東京都渋谷区渋谷２丁目２１−１",
        "latitude": 35.65910807942215,
        "longitude": 139.70372892916203
    },
    {
        "type": "location",
        "title": "Mita Ziro ATM",
        "address": "〒108-0073 東京都港区三田２丁目１６−４",
        "latitude": 35.6479527,
        "longitude": 139.7317562
    },
];

// Copied from https://qiita.com/kawanet/items/a2e111b17b8eb5ac859a
function distance(lat1, lng1, lat2, lng2) {
  lat1 *= Math.PI / 180;
  lng1 *= Math.PI / 180;
  lat2 *= Math.PI / 180;
  lng2 *= Math.PI / 180;
  return 6371 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
}
function findNearestAtm(latitude, longitude) {
    const distances = ATMS.map((atm) => distance(latitude, longitude, atm.latitude, atm.longitude));
    const result = distances.reduce((nearestAtmIndex, distance, index) => {
       if (index === 0) {
           return 0;
       }
       if (distance < distances[nearestAtmIndex]) {
           return index;
       } else {
           return nearestAtmIndex;
       }
    }, 0);
    return ATMS[result];
}

class EchoBot extends ActivityHandler {
  constructor() {
    super();
    // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
    this.onMessage(async (context, next) => {
      if (context.activity.text === 'Location') {
        const geo = context.activity.entities[0].Geo;
        const { Elevation, Latitude, Longitude } = geo;
        await context.sendActivity('Thank you! Nearest ATM is here!');

        const location = {
          "channelData": findNearestAtm(Latitude, Longitude)
        }
        await context.sendActivity(location);
      }
      else if (context.activity.text === 'MUFG' || context.activity.text === 'SMBC' || context.activity.text === 'Mizuho') {
        const message = {
          "channelData": {
            "type": "template",
            "altText": "This is a buttons template",
            "template": {
              "type": "buttons",
              "text": "Please send me your location",
              "actions": [
                {
                  "type": "uri",
                  "label": "Send location",
                  "uri": "line://nv/location"
                }
              ]
            }
          }
        }
        await context.sendActivity(message);
      } else if (context.activity.text.match(/ATM/)) {
        await context.sendActivity('Which credit card provider ATM are you looking for?');

        const reply = {
          "channelData": {
            "type": "template",
            "altText": "this is a carousel template",
            "template": {
              "type": "carousel",
              "columns": [
                {
                  "thumbnailImageUrl": "https://www.mufg.jp/dam_vcms/cmn/og_image.jpg",
                  "imageBackgroundColor": "#FFFFFF",
                  "text": "MUFG",
                  "actions": [
                    {
                      "type": "message",
                      "label": "Select",
                      "text": "MUFG"
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": "https://lh3.googleusercontent.com/jRBLKjECl0eGHRJVUthL3CP5aH8sTJ3535v1Yqe9eZFkP_tvJLcHp5VAJ6jeZ7KDkA",
                  "imageBackgroundColor": "#000000",
                  "text": "SMBC",
                  "actions": [
                    {
                      "type": "message",
                      "label": "Select",
                      "text": "SMBC"
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": "https://www.mizuho-fg.com/company/policy/brand/images/brand_logo.png",
                  "imageBackgroundColor": "#000000",
                  "text": "Mizuho",
                  "actions": [
                    {
                      "type": "message",
                      "label": "Select",
                      "text": "Mizuho"
                    }
                  ]
                }
              ],
              "imageAspectRatio": "rectangle",
              "imageSize": "cover"
            }
          }
        }

        await context.sendActivity(reply);
      } else if (context.activity.text === 'Hello' || context.activity.text === 'hello') {
        await context.sendActivity(`Hey`);
      } else {
        await context.sendActivity(`You said '${context.activity.text}'`);
      }

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
        if (membersAdded[cnt].id !== context.activity.recipient.id) {
          await context.sendActivity('Hello and welcome!');
        }
      }
      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });
  }
}

module.exports.EchoBot = EchoBot;
