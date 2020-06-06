// pages/score/index.js
const util = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onGetOpenid();
    wx.setStorageSync('source', 'score');
    console.log(options);
    console.log(options.score)
    let score = options.score;
    Promise.all([
       this.getExam(),this.getSubject(), this.getQuestion(), this.getScore()
    ]).then(res => {
      console.log('Promise.all', res)
      this.setData({
        exam: res[0],
        subject: res[1],
        questions: res[2],
        answers: res[3],
        records: res[4],
        score
      },()=>{
        
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
  bindgoview: function(){
    this.onAdd();
   
  },
  getQuestion: function(){
    return new Promise(function (resolve, reject) {
      resolve(wx.getStorageSync('arr'))
    }).catch(res=>{
      console.log('catch',res)
    });
  },
  getCode: function(){
    return new Promise(function (resolve, reject) {
      resolve(wx.getStorageSync('code_arr'))
    }).catch(res=>{
      console.log('catch',res)
    });
  },
  getScore: function(){
    return new Promise(function (resolve, reject) {
      resolve(wx.getStorageSync('score_arr'))
    }).catch(res=>{
      console.log('catch',res)
    });
  },  
  getQuestion: function(){
    return new Promise(function (resolve, reject) {
      resolve(wx.getStorageSync('arr'))
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
  getSubject: function(){
    return new Promise(function (resolve, reject) {
      resolve(wx.getStorageSync('subject'))
    }).catch(res=>{
      console.log('catch',res)
    });
  },
  onAdd: function () {
    let time = util.formatTime(new Date(Date.now()));
    let {exam, subject,questions ,score} = this.data;
    
    const db = wx.cloud.database()
    db.collection('test').where({
      _openid: app.globalData.openid // 填入当前用户 openid
    }).count().then(res => {
      console.log(res.total)
      if(res.total==0){
        this.addTest();
      }
    })

    db.collection('history').add({
      data: {
        exam: JSON.stringify(exam),
        subject: JSON.stringify(subject),
        questions: JSON.stringify(questions),
        score: score,
        createTime: time
      },
      success: res => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '新增记录成功',
        })
        let url = '/pages/view/index';
        wx.navigateTo({
          url: url
        })
        
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
  addTest: function(){
    let time = util.formatTime(new Date(Date.now()));
    let {exam, subject, score} = this.data;
    const db = wx.cloud.database()
    db.collection('test').add({
      data: {
        code: subject.code,
        exam: JSON.stringify(exam),
        subject: JSON.stringify(subject),
        createTime: time
      },
      success: res => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        // 在返回结果中会包含新创建的记录的 _id
        
        
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
  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
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