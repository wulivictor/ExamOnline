// pages/simple/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    idx: 0,
    buttontext: '下一个',
    score: 0,
    score_arr:[0,0,0,0,0,0,0,0,0,0],
    code_arr:['M','M','M','M','M','M','M','M','M','M'],
    options: [],
    records: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let code = options.code;
    let idx = this.data.idx;
    this.onGetOpenid(code);
    
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
  onQuery: function(openid,code){
    const db = wx.cloud.database()
    db.collection('record').where({
      _openid: openid,
      code: code
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res);
        let records = res.data;
        records.map(function(obj) { 
          obj.question = JSON.parse(obj.question);
          return obj;
        });
        let record = [];
        let subject = [];
        let question = [];
        let options = [];
        let format_options = [];
        if(records.length>0){
          record = records[0];
          question = record.question;
          options = JSON.parse(question.options);
          format_options = options.map(function(item){
            item.checked = item.value == 1 ? true : false;
            return item;
          });
        }
        
        this.setData({
          records,
          record,
          question,
          options: format_options
        })
        
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    console.log(e);
    let score_arr = this.data.score_arr;
    let code_arr = this.data.code_arr;
    let quid_arr = this.data.quid_arr;
    let idx = this.data.idx;
    let score = this.data.score;
    score += parseInt(e.detail.value);
    console.log('20191221');
    console.log(JSON.parse(e.detail.value));
    score_arr[idx] = parseInt(JSON.parse(e.detail.value).value);
    code_arr[idx] = JSON.parse(e.detail.value).code;
    // quid_arr[idx] = JSON.parse(e.detail.value).qid;
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
  onNextTap: function(){
    let _this = this;
    let score = this.data.score;
    let arr = this.data.arr;
    let score_arr = this.data.score_arr;
    let code_arr = this.data.code_arr;

    let idx = this.data.idx;
  
    this.getNewOne();

       
  },
  getNewOne: function(){
    let _this = this;
    let arr = this.data.records;

    let idx = this.data.idx;

    let buttontext = this.data.buttontext;
    idx++;
    let length = arr.length;
    if(idx== length-1){
      buttontext = '完成';
    }
    if(idx==arr.length){
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '本次错题回顾已完成',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            _this.bindgoHome();
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
    },()=>{
      this.getQuestion();
    })
    
    

  },
  bindgoscore: function(score){
    let url = '/pages/score/index?score='+score;
    wx.navigateTo({
      url: url
    })
  },
  bindgoHome: function(){
    let url = '/pages/home/index';
    wx.switchTab({
      url: url
    })
  },
  getQuestion: function(){
    let idx = this.data.idx;
    let records = this.data.records;
    let record = [];
    let subject = [];
    let question = [];
    let options = [];
    let format_options = [];
    
    record = records[idx];
    question = record.question;
    options = JSON.parse(question.options);
    format_options = options.map(function(item){
      item.checked = item.value == 1 ? true : false;
      return item;
    });
  
    
    this.setData({
      records,
      record,
      question,
      options: format_options
    })
   
  },
  
  onGetOpenid: function(code) {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.onQuery(res.result.openid,code)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  }
})