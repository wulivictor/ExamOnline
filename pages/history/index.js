// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('source', 'history');
    this.getOpenid().then(res=>{
      console.log('resolve');
      console.log(res);
      this.query(res);
    });
  },
  getOpenid: function(){
    let _this = this;
    return new Promise(function(resolve,reject){
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
                  setTimeout(()=>{
                    resolve(result.openid);
                  },0);
                  
                }
              },
              fail (err){
                console.log(err);
                reject(err);
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      }) 
    });
    
  },
  query: function(openid){
    let _this = this;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=history/getbyopenid', //仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
        let data = res.data;
        let items = [];
        let arrayObject = data.result;
        if(arrayObject && arrayObject.length>0){
          items = arrayObject.slice(0,5);
        }
        items.map((item)=>{
          item.createTime = item.createTime.substr(0,10);
        })
        _this.setData({
          items
        });
      }
    });
  },
  toQuestionPage: function(e){
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id;
    let url = '/pages/question/index?id='+id;
    wx.navigateTo({
      url: url
    })
  },
  toModePage: function(e){
    console.log(e.currentTarget.dataset.code);
    let code = e.currentTarget.dataset.code;
    let examname = e.currentTarget.dataset.examname;

    let questions = JSON.parse(e.currentTarget.dataset.questions);
    let answers = JSON.parse(e.currentTarget.dataset.answers);
    let records = JSON.parse(e.currentTarget.dataset.records);

    wx.setStorageSync('code', code);
    wx.setStorageSync('name', examname);
    wx.setStorageSync('arr', questions);
    wx.setStorageSync('score_arr', answers);
    wx.setStorageSync('code_arr', records);

    let url = '/pages/view/index';
    wx.redirectTo({
      url: url
    })
  },  
  toAttendPage: function(e){
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    let url;
    url = '/pages/question/index?id='+id +'&title=' +title;
    wx.navigateTo({
      url: url
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

  }
})