// pages/lifeInf/lifeInf.js
//获取应用实例
const app = getApp()
var switchTabBar = app.globalData.TabBar
var curCity
var list2 = ["/image/movie-0.jpg", "/image/movie-0.jpg", "/image/movie-0.jpg", "/image/movie-0.jpg", "/image/movie-0.jpg", "/image/movie-0.jpg", "/image/movie-0.jpg", "/image/movie-0.jpg"],
    list1 = [],
    list = [] //初始每一条生活信息的图片路径
var item_tittle = ['舒适度指数', '穿衣指数', '感冒指数', '运动指数', '旅游指数', '紫外线指数', '洗车指数', '空气污染条件扩散指数']
var result //判定是否setImage函数执行完成
var jsonData //生活信息的json数据
var sunJson //日出时间的json数据
var forsr, forss //日出，日落
Page({
    data: {
        now_weather: "0",
        for_sr: "06:00",
        for_ss: "18:00", //初始日出日落时间
        z_index: 2,
        wave_list: []
    },

    //事件处理函数
    onLoad: function() {
        curCity = app.globalData.selectedCity
        var that = this
        setImage()
        console.log(curCity)
        var times = setInterval(function() {
                if (result == -1) {
                    clearTimeout(times);
                    that.setData({
                        now_weather: "网络错误，请尝试重新进入",
                        for_sr: "0:00",
                        for_ss: "0:00"
                    })
                    wx.showModal({
                        title: '提示',
                        content: '网络错误，请尝试重新进入',
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
                if (result == 1) {
                    console.log(jsonData)
                    for (var i = 0; i < 8; i++) { //根据json对象找出每一个需要的值，重新建立对象，赋值list数组
                        var object1 = new Object();
                        var json = JSON.parse(jsonData);
                        // console.log(json)
                        object1.index = json[i].type
                        object1.brf = json[i].brf
                        object1.txt = json[i].txt
                        object1.img = list2[i]
                        list[i] = object1
                        //console.log(i)
                        //console.log(list[i])
                        console.log(list[i].img)
                    }
                    var json2 = JSON.parse(sunJson);
                    console.log(json2)
                    forsr = json2.sr
                    forss = json2.ss
                    console.log(json2)
                    clearTimeout(times);
                }
                that.setData({
                    for_array: that.set_tittle(list),
                    for_sr: forsr,
                    for_ss: forss
                })
            },
            2000
        )
    },
    onShow: function() {
        curCity = app.globalData.selectedCity
        var that = this
        setImage()
        console.log(curCity)
        var times = setInterval(function() {
                if (result == -1) {
                    clearTimeout(times);
                    that.setData({
                        now_weather: "网络错误，请尝试重新进入",
                        for_sr: "0:00",
                        for_ss: "0:00"
                    })
                    wx.showModal({
                        title: '提示',
                        content: '网络错误，请尝试重新进入',
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
                if (result == 1) {
                    console.log(jsonData)
                    for (var i = 0; i < 8; i++) { //根据json对象找出每一个需要的值，重新建立对象，赋值list数组
                        var object1 = new Object();
                        var json = JSON.parse(jsonData);
                        // console.log(json)
                        object1.index = json[i].type
                        object1.brf = json[i].brf
                        object1.txt = json[i].txt
                        object1.img = list2[i]
                        list[i] = object1
                        //console.log(i)
                        //console.log(list[i])
                        console.log(list[i].img)
                    }
                    var json2 = JSON.parse(sunJson);
                    console.log(json2)
                    forsr = json2.sr
                    forss = json2.ss
                    console.log(json2)
                    clearTimeout(times);
                }

                that.setData({
                    for_array: that.set_tittle(list),
                    for_sr: forsr,
                    for_ss: forss
                })
                console.log(list)
            },
            2000
        )
    },
    wave: function(e) {
        app.wave(e.detail.x, e.detail.y, this.data.z_index + 1, this);
    },
    set_tittle: function(list) {
        for (var i = 0; i < 8; i++)
            list[i].index = item_tittle[i];
        return list
    }
})

function setImage() { //拉取生活信息，并转成json对象
    var that = this
    wx.request({
        url: 'https://free-api.heweather.com/s6/weather?location=' + curCity + '&key=fd29112697d54606bd9499e54b05cf1d',
        headers: {
            'Content-Type': 'application/json'
        },
        success: function(res) {
            console.log(curCity)
            if (!res.data.HeWeather6[0].basic) {
                result = -1;
            } else {
                result = 1
                jsonData = JSON.stringify(res.data.HeWeather6[0].lifestyle)
                sunJson = JSON.stringify(res.data.HeWeather6[0].daily_forecast[0])
            }
        }
    })
}