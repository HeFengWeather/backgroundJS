//app.js
App({
    onLaunch: function() {
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    globalData: {
        selectedCity: '青岛',
        TabBar: 0
    },
    wave: function(x, y, z, that) {
        that.data.wave_list.push({
            tap_x: x,
            tap_y: y,
            z_index: z - 1
        });
        that.setData({
            wave_list: that.data.wave_list
        });
        that.setData({
            z_index: z
        });
        if (that.data.wave_list.length > 50) {
            that.setData({
                wave_list: [],
                z_index: 2
            });
        } // It will be cleaned if length more than 50
    }
})