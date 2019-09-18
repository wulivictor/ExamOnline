// pages/rank/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: ['干垃圾','湿垃圾','可回收物','有害垃圾'],
    answers: [],
    products:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let score = options.score;
    let answers =JSON.parse(options.answers);
    let rights =JSON.parse(options.rights);

    let length = answers.length;
    let _this = this;
    wx.getStorage({
      key: 'products',
      success (res) {
        console.log(res.data)
        _this.setData({
          score: score,
          answers: answers,
          rights: rights,
          products: res.data.slice(0,length)
        })
      }
    })
  },
  toNext: function(){
    wx.redirectTo({
      url: '/pages/challenge/index'
    })
  },
  toHome: function(){
    wx.switchTab({
      url: '/pages/query/index'
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