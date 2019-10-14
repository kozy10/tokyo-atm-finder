// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, ActivityTypes } = require('botbuilder');
const { Activity } = require('botframework-schema')

class EchoBot extends ActivityHandler {
  constructor() {
    super();
    // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
    this.onMessage(async (context, next) => {
      if (context.activity.text.match(/atm/)) {
        const reply =
        {
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
                      "type": "postback",
                      "label": "Select",
                      "data": "action=buy&itemid=111"
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": "https://lh3.googleusercontent.com/jRBLKjECl0eGHRJVUthL3CP5aH8sTJ3535v1Yqe9eZFkP_tvJLcHp5VAJ6jeZ7KDkA",
                  "imageBackgroundColor": "#000000",
                  "text": "SMBC",
                  "actions": [
                    {
                      "type": "postback",
                      "label": "Select",
                      "data": "action=buy&itemid=222"
                    }
                  ]
                },
                {
                  "thumbnailImageUrl": "https://www.mizuho-fg.com/company/policy/brand/images/brand_logo.png",
                  "imageBackgroundColor": "#000000",
                  "text": "Mizuho",
                  "actions": [
                    {
                      "type": "postback",
                      "label": "Select",
                      "data": "action=buy&itemid=222"
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
