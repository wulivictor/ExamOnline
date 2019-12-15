// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exams: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 在页面中定义插屏广告
    let interstitialAd = null

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-0066031106fafdda'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }

    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }    
    this.query();
  },
  query: function(){
    let _this = this;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=exam/getexams', //仅为示例，并非真实的接口地址
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
        let data = res.data;
        _this.setData({
          exams: data.result
        });
      }
    });
  },
  toQuestionPage: function(e){
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id;
    let url = '/pages/question/index?id='+id;
    wx.navigateTo({
      url: url
    })
  },
  toSubjectsPage: function(e){
    console.log(e.currentTarget.dataset.code);
    let code = e.currentTarget.dataset.code;
    let url = '/pages/subjects/index?code='+code;
    wx.navigateTo({
      url: url
    })
  }, 
  toEntryPage: function(e){
    console.log(e.currentTarget.dataset.code);
    let code = e.currentTarget.dataset.code;
    let url = '/pages/entry/index?code='+code;
    wx.navigateTo({
      url: url
    })
  },  
  toAttendPage: function(e){
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    let url;
    url = '/pages/question/index?id='+id +'&title=' +title;
    wx.navigateTo({
      url: url
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 1];
    console.log('开始输出');
    console.log(pages);
    console.log(prevPage);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.query();
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