# NHentai Image Google Drive Uploader

A simple Node.js app to upload images from NHentai to your google drive storage

## Running Locally

Make sure you have [Node.js](http://nodejs.org/)  installed.
client_secret.json file from [OAuth 2.0 Client IDs](https://console.developers.google.com/apis/credentials).

```
npm install
```


## NPM Install

```
$ npm i nhentai-gdrive-uploader
```

## Usage

```js
const nHGet = require('nhentai-gdrive-uploader')
let urls = ['https://nhentai.net/g/267195/','https://nhentai.net/g/267191/'];
nHGet.Save(urls,(err) =>{
    if(err) console.log(err)
    console.log('Upload successfully')
})
```

## Contributors

For more information about me

- [GitHub](https://github.com/minhlk)
- [MKProduction-Youtube]( https://www.youtube.com/mkproductionpresent)
