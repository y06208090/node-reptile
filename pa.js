// request
const request = require('request');
const iconv = require('iconv-lite');
// 类似jquery的一个库
const cheerio = require('cheerio');
// 文件管理模块
const fs = require('fs');
// 控制并发数
const async = require('async');
var URL = 'https://www.12zw.la/10/10924/';
var NUMBER = 0;
var start = new Date();
console.log("开始爬取首页......");
var Options = {
        method: 'GET',
        encoding: null,
        url:URL,
        timeout:100000
};
var URLS = [];

request(Options,function(err,res,body){
        if(err){
            console.log('首页爬取失败');
            console.log(err);
            return ;
        }
        console.log("首页爬取成功,费时" + (new Date() - start) / 1000 + '秒');
        // 处理爬取的信息
        body = iconv.decode(body,'gbk');
        var $ = cheerio.load(body);
        var MAXLIMIT = 5;
        var TITLE = $('#info>h1').text() + '.txt';
        var urls = $('#list>dl>dd>a');
// console.log(body)
        urls.each( function(index,ele){
            var a = $(this);
            var url = URL + a.attr('href');
            var data = {
                'index':index,
                'url':url,
                'title':a.text()
            };
            URLS.push(data);
        });
        console.log(URLS)
// URLS=[{
//             'index':0,
//             'url':"https://www.12zw.la/10/10924/8062346.html",
//             'title':"第一章"
//         },
//         {
//             'index':1,
//             'url':"https://www.12zw.la/10/10924/8062347.html",
//             'title':"第二章"
//         },
//         {
//             'index':2,
//             'url':"https://www.12zw.la/10/10924/8062348.html",
//             'title':"第三章"
//         }
//     ]
var start1 = new Date();
   
    async.every(URLS, function(item,callback){ 
        let option = {
            method: 'GET',
            encoding: null,
            url:item.url,
            timeout:100000
    };
        request(option,(err,res)=>{
            // console.log(res.body)
            if(res &&res.body){
                let body=res.body
                body=iconv.decode(body, 'gbk')
            var $ = cheerio.load(body);
            let title = $(".bookname h1").text()
            var content = $('#content').html()
            content = content?content.replace(/&nbsp;&nbsp;&nbsp;&nbsp;/g, "  "):content
            write(title,content)
            }
            
        })
    })
console.log((new Date()-start1)/1000,`共${URLS.length}章`)

});

var write=function(title,content){
    var start = new Date();
    // console.log("开始写入文件");
    fs.writeFileSync(`./book/${title}.txt`,content,'utf-8',(err)=>{
        if(err){
            console.log("写入失败")
        }
    });
    var end = ( new Date() - start ) / 1000;
    // console.log(`写入文件成功,耗时${end}秒`);
}
