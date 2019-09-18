// pages/attend/index.js
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
  onShareAppMessage: function (res) {
    //if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    //}
    return {
      title: '',
      path: '/pages/query/index',
      imageUrl: '/images/defaultHeader.jpg',
      success: function (res) {
        // 转发成功
        console.log('转发成功')
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        })

      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  bindDataSubmit: function(){
    wx.navigateTo({
      url: '/pages/home/index',
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  bindSponsor: function(){
    wx.navigateTo({
      url: '/pages/sponsor/index',
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  bindMakeFriend: function(){
    wx.navigateTo({
      url: '/pages/friend/index',
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  }
})