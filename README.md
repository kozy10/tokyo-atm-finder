# tokyo-atm-finder
How to create LINE chat bot with Azure Bot service

https://tech-blog.cloud-config.jp/2019-10-17-azure-bot-service/

(Sorry but In Japanese.. plz use google translation)

## How to use
Open bot.js in web source code editor
![image](https://user-images.githubusercontent.com/6829495/100686651-1ab9fa80-33c2-11eb-91fe-5eb4e4d5886b.png)
![image](https://user-images.githubusercontent.com/6829495/100686447-b1d28280-33c1-11eb-9a37-09332e631a92.png)

Replace below part with any files in this repository
```js
const { ActivityHandler, ActivityTypes } = require('botbuilder');
// ....
module.exports.EchoBot = EchoBot;
```

New soure code will be refrelcted to chatbot in several seconds.
