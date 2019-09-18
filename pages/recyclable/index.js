Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgArr: [
      "https://www.xiaomutong.com.cn/public/icons/icon3.png"
    ]
  },
  goHome: function(){
    wx.switchTab({
      url: '/pages/query/index'
    })
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