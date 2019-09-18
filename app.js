//app.js
App({
  onLaunch: function () {
    var _this = this;
    // wx.showModal({
    //   showCancel: false,
    //   title: '温馨提醒',
    //   content: '需要授权使用您的昵称等个人信息',
    //   success (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //       _this._getUserInfo();
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
  },
  _getUserInfo: function(){
    // 获取用户信息
    var _this = this;
    wx.getSetting({
      success: res => {
        console.log(res);     
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              _this.globalData.userInfo = res.userInfo;
              _this._gotoMyinfo();
            }
          })
        }else if(!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.getUserInfo',
            success() {
              wx.getUserInfo({
                success(result) {
                  console.log(res)
                  // 可以将 res 发送给后台解码出 unionId
                  _this.globalData.userInfo = res.userInfo;
                  _this._gotoMyinfo();
                }
              })
            }
          })
        }
      }
    })
  },
  _gotoMyinfo: function(){
    wx.navigateTo({
      url: '/pages/myinfo/index',
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  },  
  globalData: {
    userInfo: {
      avatarUrl: '/images/20190727180127.jpg',
      nickName: '未命名'
    }
  }
})