// request
const request = require('request');
const iconv = require('iconv-lite');
// 类似jquery的一个库
const cheerio = require('cheerio');
// 文件管理模块
const fs = require('fs');
// 控制并发数
const async = require('async');
var URL = 'https://www.12zw.la/2/2197/';
var NUMBER = 0;
var start = new Date();
console.log("开始爬取首页......");
var Options = {
        method: 'GET',
        encoding: null,
        url:URL,
        timeout:100000
};
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
        var URLS = [];

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
        // console.log(URLS)
// URLS=[{
//             'index':0,
//             'url':"https://www.12zw.la/1/1257/619223.html",
//             'title':"第一章 陨落的天才"
//         },
        // {
        //     'index':1,
        //     'url':"https://www.12zw.la/10/10924/8062347.html",
        //     'title':"第二章"
        // },
        // {
        //     'index':2,
        //     'url':"https://www.12zw.la/10/10924/8062348.html",
        //     'title':"第三章"
        // }
    // ]
        async.mapLimit(URLS,MAXLIMIT,function(item,callback){
            getData(item,callback)
        },function(err,result){

            var end  = ( new Date() - start ) /1000;

            console.log(`爬取所有信息费时${end}秒`);

            result.sort(function(a,b){
                return a.index - b.index; 
            });
            result.map(function(item){
                write(TITLE,item.title,item.content);

                return item.title + '\n\r' + item.content;

            })
        //    let result2 = result.map(function(item){

        //         return item.title + '\n\r' + item.content;

        //     }).join('\n\r');
        //    let result1 = result.map(function(item){

        //         return item.title ;

        //     }).join('\n\r');
        //     write(TITLE,result1,result2);

            var end = (new Date() - start ) / 1000;
            console.log("共耗时"+end+"秒");
        })

});

var getData = function(item,callback){

    var start = new Date();
    Options.url = item.url;
    request(Options,function(err,res,body){
        var end = (new Date() - start) / 1000;
        var str;
        if(err){
            var str = `获取${item.url}失败,共耗时${end}秒\n\r`;
            callback(null,{
                'index':-1,
                'title':'异常',
                'content':'异常'
            });
            message(11,str);
        }else{
            body = iconv.decode(body,'gbk');
            var $ = cheerio.load(body);
            var content = $('#content').html();
               content=content?content.replace(/&nbsp;&nbsp;&nbsp;&nbsp;/g, "  "):content;
 

            var str = `获取${item.url}成功,共耗时${end}秒\n\r`;
            var data = {
                "index":item.index,
                "title":item.title,
                "content":content
            };
            callback(null,data);
            message(10,str);
            NUMBER++;
            console.log(`成功获取${NUMBER}个`);
        }   
    })
};

var write = function(bookname,result1,data){

    var start = new Date();
    console.log("开始写入文件");
    // let title=result1.substr(0,1);
    // if(title!="第"){
    //     title=`第${result1}`
    // }
    fs.appendFileSync(`./仙逆-耳根著.txt`,`${result1}\r${data}\r`,'utf-8');
    var end = ( new Date() - start ) / 1000;
    console.log(`写入文件成功,耗时${end}秒`);
}

// 每个请求的信息,success or false
var message = function(type,data){
    var name = 'success.txt';
    var options = {
        'flag':'a+',
        'encoding':'utf-8'
    }
    //success
    if(type == 11){
        name = 'error.txt'; 
    }
    fs.writeFile(name,data,options,function(err){
        if(err){
            console.log(err);   
        }   
    })
}
