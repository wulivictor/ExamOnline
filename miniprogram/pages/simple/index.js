// pages/simple/index.js
const util = require('../../utils/util.js')
const app = getApp()
console.log('a00');
console.log(app.globalData.userInfo);

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
      })
    });

    this.getSubject().then(res=>{
      console.log('subject');
      console.log(res);
      this.setData({
        subject: res
      })
    })

    this.getExam().then(res=>{
      console.log('exam');
      console.log(res);
      this.setData({
        exam: res
      })
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
  generate: function(){
    return new Promise(function (resolve, reject) {
      resolve(wx.getStorageSync('arr'))
    }).catch(res=>{
      console.log('catch',res)
    });
  },
  getSubject: function(){
    return new Promise(function (resolve, reject) {
      resolve(wx.getStorageSync('subject'))
    }).catch(res=>{
      console.log('catch',res)
    });
  },
  getExam: function(){
    return new Promise(function (resolve, reject) {
      resolve(wx.getStorageSync('exam'))
    }).catch(res=>{
      console.log('catch',res)
    });
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
    if(score_arr[idx] == 0){
      let openid = this.data.openid;
      let quid = arr[idx];
      let question = this.data.question;

      this.add(question);
    }
    if(code_arr[idx]=='M'){
      wx.showActionSheet({
        itemList: ['放弃该题', '容我三思'],
        success (res) {
          console.log(res.tapIndex);
          if(res.tapIndex == 1){
            return;
          }else{
            _this.getNewOne();
          }
        },
        fail (res) {
          console.log(res.errMsg)
        }
      })
    }else{
      _this.getNewOne();
    }
       
  },
  add: function(question){
    let {exam ,subject } = this.data;
    let time = util.formatTime(new Date(Date.now()));
    const db = wx.cloud.database()
    db.collection('record').add({
      data: {
        code: subject.code,
        exam: JSON.stringify(exam),
        subject: JSON.stringify(subject),
        question: JSON.stringify(question),
        createTime: time
      },
      success: res => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  getNewOne: function(){
    let score = this.data.score;
    let arr = this.data.arr;
    let score_arr = this.data.score_arr;
    let code_arr = this.data.code_arr;

    let idx = this.data.idx;

    let buttontext = this.data.buttontext;
    idx++;
    if(idx==9){
      buttontext = '提交';
    }
    if(idx==10){
      let _this = this;
      let sum = score_arr.reduce((x,y)=>x+y)
      this.bindgoscore(sum);
      return;
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
  },
  bindgoscore: function(score){
    let url = '/pages/score/index?score='+score;
    wx.navigateTo({
      url: url
    })
  },
  bindgoview: function(){
    let url = '/pages/view/index';
    wx.navigateTo({
      url: url
    })
  },
  getQuestion: function(_id){
    const db = wx.cloud.database()
    db.collection('question').doc(_id).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        let question = res.data;
        this.setData({
          question: question,
          options: JSON.parse(question.options)
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
  onGotUserInfo: function(e) {
    let _this = this;
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    app.globalData.userInfo = e.detail.userInfo;
    setTimeout(function(){
      _this.bindGenerate();
    },1000)
  },
  onGotUserInfo2: function(e) {
    let _this = this;
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    app.globalData.userInfo = e.detail.userInfo;
    setTimeout(function(){
      _this.bindGenerate2();
    },1000)
  },  
  bindGenerate: function(){
    let question = this.data.question;
    wx.navigateTo({
      url: '/pages/example/index?id='+question.id
    })
  },
  bindGenerate2: function(){
    let question = this.data.question;
    wx.navigateTo({
      url: '/pages/generate/index?id='+question.id
    })
  }
})