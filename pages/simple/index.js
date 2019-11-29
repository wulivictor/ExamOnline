// pages/simple/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx: 0,
    buttontext: '下一个',
    score: 0,
    score_arr:[0,0,0,0,0,0,0,0,0,0],
    options: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let idx = this.data.idx;
    this.generate().then(res=>{
      let arr = res;
      this.setData({
        arr
      }, function() {
        // this is setData callback
        this.getQuestion(arr[idx]);
        this.getOptions(arr[idx]);
      })
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

  },
  generate: function(){
    return new Promise(function (resolve, reject) {
      resolve(wx.getStorageSync('arr'))
    }).catch(res=>{
      console.log('catch',res)
    });
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    let score_arr = this.data.score_arr;
    let idx = this.data.idx;
    let score = this.data.score;
    score += parseInt(e.detail.value);
    score_arr[idx] = parseInt(e.detail.value);
    console.log(score_arr);
    this.setData({
      score,
      score_arr
    });
  },  
  onNextTap: function(){
    let score = this.data.score;
    let arr = this.data.arr;
    let score_arr = this.data.score_arr;

    let idx = this.data.idx;
    let buttontext = this.data.buttontext;
    idx++;
    if(idx==9){
      buttontext = '提交';
    }
    if(idx==10){
      let _this = this;
      let sum = score_arr.reduce((x,y)=>x+y)
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '您本次答题分数为'+sum,
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            _this.bindgoview();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
    this.setData({
      idx,
      buttontext
    })
    
    this.getQuestion(arr[idx]);
    this.getOptions(arr[idx]);    
  },
  bindgoview: function(){
    let url = '/pages/view/index';
    wx.navigateTo({
      url: url
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
        let format_options = options.map(function(item){
          // item.checked = 'false';
          return item;
        });
        _this.setData({
          options: format_options
        })
      }
    });
  }
})