//index.js
//获取应用实例
const app = getApp()
wx.switchTab({
    url: 'pages/lifeInf/lifeInf',
    success: function(e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
    }
})
var curCity = app.globalData.selectedCity
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
var address;
var result;
var list = [],
    result, forarray, jsonData
var curCity = app.globalData.selectedCity //curCity为当前选择的城市，使用全局变量
Page({
    data: {
        now_weather: "0",
        region: ['山东省', '青岛市', '崂山区'],
        z_index: 2,
        wave_list: []
    },
    bindRegionChange: function(e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            region: e.detail.value
        })
        curCity = e.detail.value[1]
        app.globalData.selectedCity = curCity

        console.log(app.globalData.selectedCity)

        var that = this
        wx.request({ //根据选择了的城市重新获取并加载信息
            url: 'https://free-api.heweather.com/s6/weather?location=' + curCity + '&key=fd29112697d54606bd9499e54b05cf1d',
            headers: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                if (!res.data.HeWeather6[0].basic) {
                    wx.showModal({
                        title: '提示',
                        content: '网络错误，加载失败，请检查您的网络',
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else {
                                console.log('用户点击取消')
                            }
                        }
                    })
                } else {
                    app.globalData.windData.wind_dir = res.data.HeWeather6[0].now.wind_dir;
                    app.globalData.windData.sc = res.data.HeWeather6[0].now.sc;
                    app.globalData.windData.spd = res.data.HeWeather6[0].spd;
                    that.setData({
                        now_weather: res.data.HeWeather6[0].now.tmp,
                        now_cond: res.data.HeWeather6[0].now.cond_txt,
                        high_tmp: res.data.HeWeather6[0].daily_forecast[0].tmp_max,
                        low_tmp: res.data.HeWeather6[0].daily_forecast[0].tmp_min,
                        for_array: res.data.HeWeather6[0].daily_forecast,
                        result: 1,
                        jsonData: JSON.stringify(res.data.HeWeather6[0].daily_forecast)
                    })
                }
            }
        })
    },
    //事件处理函数
    onLoad: function() {
        var that = this
        getGPS()
        var times = setInterval(function() { //初始根据GPS逆定位进行请求
            if (result) {
                console.log('https://free-api.heweather.com/s6/weather?location=' + address + '&key=fd29112697d54606bd9499e54b05cf1d', )
                wx.request({
                    url: 'https://free-api.heweather.com/s6/weather?location=' + address + '&key=fd29112697d54606bd9499e54b05cf1d',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: function(res) {
                        if (!res.data.HeWeather6[0].basic) {
                            that.setData({
                                now_cond: '定位失败，请手动定位',
                            })
                        } else {

                            app.globalData.windData.wind_dir = res.data.HeWeather6[0].now.wind_dir;
                            app.globalData.windData.sc = res.data.HeWeather6[0].now.sc;
                            app.globalData.windData.spd = res.data.HeWeather6[0].spd;
                            that.setData({
                                now_weather: res.data.HeWeather6[0].now.tmp,
                                now_cond: res.data.HeWeather6[0].now.cond_txt,
                                high_tmp: res.data.HeWeather6[0].daily_forecast[0].tmp_max,
                                low_tmp: res.data.HeWeather6[0].daily_forecast[0].tmp_min,
                                for_array: res.data.HeWeather6[0].daily_forecast,
                                result: 1,
                                jsonData: JSON.stringify(res.data.HeWeather6[0].daily_forecast)
                            })
                        }
                    } //加载图片，未完成
                }, 2000)
                clearTimeout(times); //清除计数器
            }
        })
    },
    onPullDownRefresh: function () {
      var that = this
      getGPS()
      var times = setInterval(function () { //初始根据GPS逆定位进行请求
        if (result) {
          wx.request({
            url: 'https://free-api.heweather.com/s6/weather?location=' + curCity + '&key=fd29112697d54606bd9499e54b05cf1d',
            headers: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              if (!res.data.HeWeather6[0].basic) {
                that.setData({
                  now_cond: '定位失败，请手动定位',
                })
              } else {

                app.globalData.windData.wind_dir = res.data.HeWeather6[0].now.wind_dir;
                app.globalData.windData.sc = res.data.HeWeather6[0].now.sc;
                app.globalData.windData.spd = res.data.HeWeather6[0].spd;
                that.setData({
                  now_weather: res.data.HeWeather6[0].now.tmp,
                  now_cond: res.data.HeWeather6[0].now.cond_txt,
                  high_tmp: res.data.HeWeather6[0].daily_forecast[0].tmp_max,
                  low_tmp: res.data.HeWeather6[0].daily_forecast[0].tmp_min,
                  for_array: res.data.HeWeather6[0].daily_forecast,
                  result: 1,
                  jsonData: JSON.stringify(res.data.HeWeather6[0].daily_forecast)
                })
              }
            } //加载图片，未完成
          }, 2000)
          clearTimeout(times); //清除计数器
          wx.stopPullDownRefresh() 
        }
      })
    },  
    wave: function(e) {
        app.wave(e.detail.x, e.detail.y, this.data.z_index + 1, this);
    }
})

function getGPS() {
    var that = this
    var qqmapsdk = new QQMapWX({
        key: 'OMFBZ-7FNKG-YBSQT-ILJ3Y-6EZ2K-WDBRU' // 必填
    });
    wx.getLocation({
        type: 'wgs84',
        success: function(res) {
            console.log(res)
            //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
            qqmapsdk.reverseGeocoder({
                location: {
                    latitude: res.latitude,
                    longitude: res.longitude
                },
                success: function(addressRes) {
                    address = addressRes.result.address_component.city;
                    console.log(address)
                    result = 1;
                }
            })
        }
    })
}