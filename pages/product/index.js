// pages/product/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'默认垃圾名称',
    type:'默认垃圾类别'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let _this = this;
    let id = options.id;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=site/querybyid&id=' + id, //仅为示例，并非真实的接口地址
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res);
        let data = res.data;
        if(data.code == 0 && data.result){
          _this.setData({
            name: data.result.name,
            type: data.result.type
          })
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

  }
})