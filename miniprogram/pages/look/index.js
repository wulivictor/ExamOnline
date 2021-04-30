// pages/simple/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx: 0,
    buttontext: '下一个',
    options: [],
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
  },
  generate: function(){
    return new Promise(function (resolve, reject) {
      resolve(wx.getStorageSync('arr'))
    }).catch(res=>{
      console.log('catch',res)
    });
  },
  getSource: function(){
    return new Promise(function (resolve, reject) {
      resolve(wx.getStorageSync('source'))
    }).catch(res=>{
      console.log('catch',res)
    });
  },  
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    let score = this.data.score;
    score += parseInt(e.detail.value);
    this.setData({
      score
    });
  },  
  onNextTap: function(){
    let source = this.data.source;
    let score = this.data.score;
    let arr = this.data.arr;

    let idx = this.data.idx;
    let buttontext = this.data.buttontext;
    idx++;
    if(idx==9){
      buttontext = '返回';
    }
    if(idx==10){
      this.bindgoHistory();
      return;
    }
    this.setData({
      idx,
      buttontext
    })
    
    this.getQuestion(arr[idx]);  
  },
  bindgohome: function(){
    let url = '/pages/home/index';
    wx.switchTab({
      url: url
    })
  },  
  bindgoHistory: function(){
    let url = '/pages/history/index';
    wx.redirectTo({
      url: url
    })
  },    
  getQuestion: function(_id){
    const db = wx.cloud.database()
    db.collection('question').doc(_id).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        let question = res.data;
        let options = JSON.parse(question.options);
        let format_options = options.map(function(item){
          item.checked = item.value == 1 ? true : false;
          
          return item;
        });
        this.setData({
          question: question,
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
  }
})