// pages/activity/index.js
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
  goQuestion: function(){
    wx.navigateTo({
      url: '/pages/question/index',
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  goQuestion1: function(){
    wx.navigateTo({
      url: '/pages/question1/index',
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  goQuestion2: function(){
    wx.navigateTo({
      url: '/pages/question2/index',
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  goQuestion3: function(){
    wx.navigateTo({
      url: '/pages/question3/index',
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  }  
})