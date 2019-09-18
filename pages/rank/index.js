const app = getApp()
console.log('a00');
console.log(app.globalData.userInfo);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=score/getscore',
      method: 'post',
      data: {
  
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        res.data.result.forEach(element => {
          element.userinfo = JSON.parse(decodeURIComponent(element.userinfo))
        });
        _this.setData({
          items: res.data.result
        })
      }
    });
  },
  onGotUserInfo: function(e) {
    let _this = this;
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    app.globalData.userInfo = e.detail.userInfo;
    setTimeout(function(){
      _this.bindGenerate();
    },1000)
  },
  bindGenerate: function(){
    wx.navigateTo({
      url: '/pages/generate/index'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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