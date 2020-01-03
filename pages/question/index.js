// pages/question/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx: 0,
    score: 0,
    score_arr:[0,0,0,0,0,0,0,0,0,0],
    code_arr:['M','M','M','M','M','M','M','M','M','M'],
    sortcode: '01'
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    let score_arr = this.data.score_arr;
    let code_arr = this.data.code_arr;
    let arr = e.detail.value.split('|');
    let idx = arr[0];
    let option = JSON.parse(arr[1]);
    let question = JSON.parse(arr[2]);
    
    let score = this.data.score;
    score += parseInt(e.detail.value);
    score_arr[idx] = parseInt(option.value);
    code_arr[idx] = option.code;
    console.log(score_arr);
    console.log(code_arr);
    wx.setStorageSync('score_arr', score_arr);
    wx.setStorageSync('code_arr', code_arr);
    this.setData({
      score,
      score_arr,
      code_arr
    });
  },  
  bindSubmitTap: function(){
    let score_arr = this.data.score_arr;
    let sum = score_arr.reduce((x,y)=>x+y)
    this.bindgoscore(sum);
    return;
    let _this = this;
    wx.showModal({
      showCancel: false,
      title: '温馨提醒',
      content: '您当前得分为：'+ sum,
      success (res) {
        if (res.confirm) {
          _this.bindgolistview()
        } else if (res.cancel) {

        }
      }
    })
  },
  bindgoscore: function(score){
    let url = '/pages/score/index?score='+score;
    wx.navigateTo({
      url: url
    })
  },  
  bindgolistview: function(){
    let url = '/pages/list/index';
    wx.navigateTo({
      url: url
    })
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let code = options.code;
    this.setData({
      code
    });
    this.getQuestions(code);
  },
  getQuestions: function(code){
    let _this = this;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=question/getquestionsbycode',
      method: 'post',
      data: {
        code: code
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        let arrayObject = res.data.result;
        let arr = [];
        arrayObject.forEach(element => {
          element.options = JSON.parse(element.options);
          arr.push(element.id);
        });
        _this.setData({
          questions: arrayObject
        },function(){
          wx.setStorageSync('questions', arrayObject);
          wx.setStorageSync('arr', arr);
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