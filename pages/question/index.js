// pages/question/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx: 0,
    sortcode: '01'
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    let idx = this.data.idx;
    let users = this.data.users;
    users[idx]= e.detail.value;
    this.setData({
      users: users
    })

  },
  bindButtonTap2: function(){
    wx.showModal({
      showCancel: false,
      title: '温馨提醒',
      content: '小编正在给您计算分数，请稍后',
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
          element.options = [{
            'code':'A',
            'value':'5'
          },{
            'code':'B',
            'value':'6'
          },{
            'code':'C',
            'value':'7'
          },{
            'code':'D',
            'value':'8'
          }];
        });
        _this.setData({
          questions: arrayObject
        })
      }
    });
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