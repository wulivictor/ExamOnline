// pages/question/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx: 0,
    score: 0,
    sortcode: '01'
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    let score = this.data.score;
    score += parseInt(e.detail.value);
    this.setData({
      score
    });
  },  
  bindSubmitTap: function(){
    wx.showModal({
      showCancel: false,
      title: '温馨提醒',
      content: '您当前得分为：'+ this.data.score,
      success (res) {
        if (res.confirm) {

        } else if (res.cancel) {

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.getQuestions();
  },
  getQuestions: function(){
    let _this = this;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=question/getquestions',
      method: 'post',
      data: {
  
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        let arrayObject = res.data.result;

        arrayObject.forEach(element => {
          element.options = JSON.parse(element.options);
        });
        _this.setData({
          questions: arrayObject
        },function(){
          wx.setStorageSync('questions', arrayObject);
        })
      }
    });
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