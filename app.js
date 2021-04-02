const Koa = require('koa');
const app = new Koa();
var cheerio = require('cheerio')
// const request = require('request') 
const https = require("https")
const iconv = require('iconv-lite');
const fs = require("fs")

var async = require('async')




// let urls = [];
// for (let index = 8062346; index <= 8062356; index++) {
//     let url = `https://www.12zw.la/10/10924/${index}.html`
//     urls.push(url)

// }
app.use((ctx) => {

    var i = 8062490;
    // var data = "";
    (function (j) {

        setInterval(() => {
            j = j + 1;
            https.get(`https://www.12zw.la/10/10924/${j}.html`, (res) => {
                res.on("data", (chunk) => {
                    // console.log(j)
                    let data = "";
                    data += iconv.decode(chunk, 'gbk').toString()
                    var $ = cheerio.load(data)
                    let title = $(".bookname h1").text()
                    let content = $("#content").html()

                    if (content) {
                        content = content.replace(/&nbsp;&nbsp;&nbsp;&nbsp;/g, "  ")

                        fs.writeFile(`./仙帝归来/${title}.txt`, content, (err) => {
                            if (!err) {
                                console.log(`${title}写入成功`);

                            }
                        })

                    } else {

                    }


                })
               
                res.on("end", () => {
                    
                })
            })
        }, 000);

    })(i);






})
app.listen(3011)