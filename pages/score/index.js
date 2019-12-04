// pages/score/index.js
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
    console.log(options);
    console.log(options.score)
    let score = options.score;
    Promise.all([
      this.getOpenid(), this.getExam(), this.getQuestion(), this.getScore(), this.getCode()
    ]).then(res => {
      console.log('Promise.all', res)
      this.setData({
        openid: res[0],
        code: res[1]['code'],
        examname: res[1]['name'],
        questions: res[2],
        answers: res[3],
        records: res[4],
        score
      },()=>{
        this.addHistory();
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
    let url = '/pages/view/index';
    wx.navigateTo({
      url: url
    })
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
  getOpenid: function(){
    return new Promise(function(resolve, reject){
      let _this = this;
      wx.login({
        success (res) {
          console.log(res);
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'https://www.xiaomutong.com.cn/web/index.php?r=wechat/getinfo4',
              method: 'post',
              data: {
                code: res.code
              },
              success (res) {
                console.log(res.data);
                if(res.data && res.data.code == 0){
                  let result = JSON.parse(res.data.result);
                  console.log(result);
                  resolve(result.openid);
                }
              },
              fail (err){
                console.log(err);
                reject(err);
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
            reject(res)
          }
        }
      })  
    }).catch(res=>{
      console.log('catch',res);
      reject(res);
    })
  },
  addHistory: function(){
    let openid = this.data.openid;
    let code = this.data.code;
    let examname = this.data.examname;
    let questions = this.data.questions;
    let answers = this.data.answers;
    let records = this.data.records;
    let score = this.data.score;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=history/add',
      method: 'post',
      data: {
        openid,
        code,
        examname,
        questions: JSON.stringify(questions),
        answers: JSON.stringify(answers),
        records: JSON.stringify(records),
        score
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
      }
    });
  }
})