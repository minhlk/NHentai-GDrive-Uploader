'use strict'
const { google } = require('googleapis')
const client = require('./oath')
const download = require('image-downloader');
const nhentai_api = require('./nhentai_api')
//USE TO REMOVE FOLDER WITH FILES INSIDE
var rimraf = require("rimraf");
//
const fs = require('fs');
//
const drive = google.drive({
  version: 'v3',
  auth: client.oAuth2Client,
});

async function runSample(query) {

  const params = { pageSize: 10 };
  params.q = query;
  const res = await drive.files.list(params);
  console.log(res.data);
  return res.data;

}

async function createDriveFolder(folderName) {
  return new Promise((resolve, reject) => {
    var fileMetadata = {
      'name': folderName,
      'mimeType': 'application/vnd.google-apps.folder'
    };
    drive.files.create({
      resource: fileMetadata,
      fields: 'id'
    }, function (err, file) {
      if (err) {
        // Handle error
        // console.error(err);
        reject(err)
      } else {
        console.log('Folder Id: ', file.data.id);
        resolve(file.data.id)
      }
    });
  })

}
async function downloadFileFromUrl(url, dest) {
  try {
    const { filename, image } = await download.image({
      url: url,
      dest: dest,
    })
    return filename  // => /path/to/dest/image.jpg 
  } catch (e) {
    console.error(e)
  }
}

async function uploadFileToDrive(path, folderName, folderContainsId) {
  // const fileSize = fs.statSync(path).size;

  return await drive.files.create(
    {
      resource: {
        'name': path.split(folderName + '/')[1],
        parents: [folderContainsId]
      },
      media: {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(path),

      },
    },
    // {
    //   // Use the `onUploadProgress` event from Axios to track the
    //   // number of bytes uploaded to this point.
    //   onUploadProgress: evt => {
    //     const progress = (evt.bytesRead / fileSize) * 100;
    //     readline.clearLine();
    //     readline.cursorTo(0);
    //     process.stdout.write(`${Math.round(progress)}% complete \n`);
    //   },
    // }
  );
}

async function uploadFile(urls, folderName = 'tmp_images') {

  folderName = folderName.replace('.', ' ')
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName)
  }
  let folderId = await createDriveFolder(folderName)
  console.log('UPLOADING ...')
  return Promise.all(urls.map(async url => {

    let path = await downloadFileFromUrl(url, './' + folderName)
    await uploadFileToDrive(path, folderName, folderId)
  })).then(() => {
    console.log(folderName + " is uploaded")
    //REMOVE TEMP FOLDER FOR IMAGES
    rimraf.sync(folderName)
  })

}


if (module === require.main) {


}

async function Save(urls, callback) {
  //let urls = ['https://nhentai.net/g/267195/','https://nhentai.net/g/267191/']
  const scopes = ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/drive.file'];
  await client.authenticate(scopes, false)

  urls.map((url) => {
    nhentai_api.GetImageUrls(url)
      .then((data) => {
        if (data.status === 200) {
          // sampleClient
          // .authenticate(scopes, false)
          uploadFile(data.imageUrls, data.title)
            .catch((err) => {
              // //INVALID TOKEN OR EXPIRED TOKEN 
              // if (err.code === 401 || err.code === 400){
              //   sampleClient.authenticate(scopes).then(() => console.log('Token updated,please run again')).catch(console.err)
              // }else
              callback(err)
            })
            .then(() => callback());
        }
      })
  })

}

module.exports = {
  Save,
  client: client.oAuth2Client,
};