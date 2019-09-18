const app = getApp()
console.log('a00');
console.log(app.globalData.userInfo);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    src: "https://www.xiaomutong.com.cn/public/wechat/wechat.jpg",
  },
  onGotUserInfo: function(e) {

    if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
        //拒绝
        wx.showModal({
          showCancel: false,
          title: '提示',
          confirmText: '我知道了',
          content: '为了更好的体验，请您先通过',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })        

    } else if (e.detail.errMsg === 'getUserInfo:ok') {
        //允许
      this.goNext(e);
    }

  },
  goNext:function(e){
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    app.globalData.userInfo = e.detail.userInfo;
    let openid = this.data.openid;
    let userinfo = JSON.stringify(e.detail.userInfo)
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=userinfo/adduserinfo',
      method: 'post',
      data: {
        openid: openid,
        userinfo: encodeURIComponent(JSON.stringify(e.detail.userInfo))
      },
      success (res) {
        console.log(res.data);
      },
      fail (err){
        console.log(err);
      }
    })

    let score = this.data.score;
    let action = this.data.action;


    let _url;
    switch(action){
      case '1':
        _url = '/pages/challenge/index?openid='+openid+'&userinfo='+userinfo;
        wx.navigateTo({
          url: _url,
          success: res => {
            console.log(res);
          },
          fail: err => {
            console.log(err);
          }
        })
        break;
      case '2':
        wx.navigateTo({
          url: '/pages/result/index?score=' + score,
          success: res => {
            console.log(res);
          },
          fail: err => {
            console.log(err);
          }
        })
        break      
      default: 
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,20190717)
    console.log(options);
    let action = options.action;
    let score = options.score || 0;

    this.setData({
      action: action,
      score: score
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let _this = this;
    wx.login({
      success (res) {
        console.log(res);
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://www.xiaomutong.com.cn/web/index.php?r=wechat/getinfo2',
            method: 'post',
            data: {
              code: res.code
            },
            success (res) {
              console.log(res.data);
              if(res.data && res.data.code == 0){
                let result = JSON.parse(res.data.result);
                console.log(result);
                _this.setData({
                  openid: result.openid
                })
              }
            },
            fail (err){
              console.log(err);
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})