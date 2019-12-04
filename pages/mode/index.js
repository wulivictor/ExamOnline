// pages/mode/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let code = options.code;
    this.setData({
      code
    });
    this.generate(code);
    this.getByCode(code);
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

  },
  bindSimpleModeTap: function(){
    let url = '/pages/simple/index';
    wx.navigateTo({
      url: url
    })
  },
  bindListModeTap: function(){
    let code = this.data.code;
    let url = '/pages/question/index?code='+code;
    wx.navigateTo({
      url: url
    })
  },
  getByCode: function(code){
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=exam/getbycode', //仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        code: code
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        wx.setStorageSync('exam', res.data.result);
      }
    });
  },
  generate: function(code){
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=question/generatedata', //仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        code: code
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        wx.setStorageSync('arr', res.data.result);
      }
    });
  }
})