//app.js
App({
    onLaunch: function() {
    },
    globalData: {
        selectedCity: '青岛',
        TabBar: 0,
        windData: {
            wind_dir: '',
            wind_sc: '',
            wind_spd: ''
        }
    },
    wave: function(x, y, z, that) {
        that.data.wave_list.push({
            tap_x: x,
            tap_y: y,
            z_index: z - 1
        });
        that.setData({
            wave_list: that.data.wave_list,
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