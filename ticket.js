const request = require('request');
var url="https://m.suanya.cn/restapi/soa2/14666/json/GetBookingByStationV3ForPC"
requestData={
    ArriveStation: "沈丘",
ChannelName: "ctrip.pc",
DepartDate: "2021-04-03",
DepartStation: "宁波",
}
var Options = {
    method: "POST",
    url:url,
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: requestData,

    timeout:100000
};
request(Options,function(err,res,body){
    console.log(res.body.ResponseBody)
    // console.log(body.toString())
})