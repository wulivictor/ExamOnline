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
  bindgohome: function(){
    let url = '/pages/home/index';
    wx.switchTab({
      url: url
    })
  },  
  bindSubmitTap: function(){
    this.bindgohome();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.getResult().then(res=>{
      this.setData({
        score_arr: res
      })
    });
    this.getCodeResult().then(res=>{
      this.setData({
        code_arr: res
      })
    });
    
    this.getQuestions();
  },
  generate: function(){
    return new Promise(function (resolve, reject) {
      resolve(wx.getStorageSync('arr'))
    }).catch(res=>{
      console.log('catch',res)
    });
  },
  generate: function(){
    return new Promise(function (resolve, reject) {
      resolve(wx.getStorageSync('questions'))
    }).catch(res=>{
      console.log('catch',res)
    });
  },
  getQuestions: function(){
    this.generate().then(res=>{
      this.setData({
        questions: res
      });
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
  getResult: function(){
    return new Promise(function (resolve, reject) {
      resolve(wx.getStorageSync('score_arr'))
    }).catch(res=>{
      console.log('catch',res)
    });
  },
  getCodeResult: function(){
    return new Promise(function (resolve, reject) {
      resolve(wx.getStorageSync('code_arr'))
    }).catch(res=>{
      console.log('catch',res)
    });
  }  

})