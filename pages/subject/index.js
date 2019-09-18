// pages/album/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: "https://www.xiaomutong.com.cn/public/subject/subject101.png",
    imgArr:[
      "https://www.xiaomutong.com.cn/public/subject/subject101.png",
      "https://www.xiaomutong.com.cn/public/subject/subject102.png",
      "https://www.xiaomutong.com.cn/public/subject/subject103.png",
      "https://www.xiaomutong.com.cn/public/subject/subject104.png",
      "https://www.xiaomutong.com.cn/public/subject/subject105.png",
      "https://www.xiaomutong.com.cn/public/subject/subject106.png",
      "https://www.xiaomutong.com.cn/public/subject/subject107.png"
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.login({
      success(res) {
        console.log(res);
        if (res.code) {
          // 发起网络请求

        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
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

  },
  previewImg:function(e){
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.imgArr;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {
        console.log(res)
      },
    })
  }    
})