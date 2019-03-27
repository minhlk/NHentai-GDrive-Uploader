const WebRequest = require('web-request')
const cheerio = require('cheerio')


function GetImageUrls(url) {
    return new Promise(async (resolve ,reject ) =>{
        try {
            let images = []
            var html = await WebRequest.get(url);
            const $ = cheerio.load(html.content)
            let title = $('#info h1').text()
            if( !title )
                throw new Error('Link error')
            $('.thumb-container ').each((i, e) => {
                images.push($('.gallerythumb noscript', e).text()
                    .split('"')[1]
                    .replace('t.', 'i.')
                    .replace('t.', '.'))
            })
            // console.log(images)
            resolve( { status: 200, title, imageUrls: images } )
        }
        catch (e) {
            reject( { status: 400, msg: 'Link address is not support' })
        }
    })
    
}
// if(require.main == module){
//     GetImageUrls('https://nhentai.net/g/264637/').then((rs) => console.log(rs))
// }
module.exports = {
    GetImageUrls
}