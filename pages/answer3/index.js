// pages/answer1/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    objecttypes: ['干垃圾','湿垃圾','可回收物','有害垃圾'],
    objects: [],
    users: [],
    answers: []
  },
  viewRight: function(e){
    let objecttypes = this.data.objecttypes;
    let objects = this.data.objects;

    let answers = this.data.answers;

    let idx = e.currentTarget.dataset.idx;
    let right = answers[idx];

    let objectname = objects[idx];
    let message = objectname + '属于' + objecttypes[right-1];
    wx.showModal({
      showCancel: false,
      title: '提示',
      content: message,
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.getStorage({
      key: 'answers',
      success (res) {
        console.log(res.data)
        _this.setData({
          answers: res.data
        })
      }
    })
    wx.getStorage({
      key: 'users',
      success (res) {
        console.log(res.data)
        _this.setData({
          users: res.data
        })
      }
    })
    wx.getStorage({
      key: 'objects',
      success (res) {
        console.log(res.data)
        _this.setData({
          objects: res.data
        })
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

  }
})