// pages/simple/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx: 1,
    options: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let arr = this.generate();
    let arr = [1,2,3,4,5,6,7,8,9,10]
    let idx = this.data.idx;
    this.getQuestion(arr[idx]);
    this.getOptions(arr[idx]);
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
  onNextTap: function(){
    let idx = this.data.idx;
    idx++;
    this.setData({
      idx
    })
  },
  getQuestion: function(id){
    let _this = this;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=question/getquestionbyid',
      method: 'post',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        let question = res.data.result;
        _this.setData({
          question: question
        })
      }
    });
  },
  getOptions: function(id){
    let _this = this;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=answer/getanswersbyqid',
      method: 'post',
      data: {
        qid: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        let options = res.data.result;
        _this.setData({
          options: options
        })
      }
    });
  }
})