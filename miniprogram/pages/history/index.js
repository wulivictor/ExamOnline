// pages/home/index.js
const app = getApp();
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
    this.onGetOpenid();
  },
  query: function(openid){
    const db = wx.cloud.database()
    db.collection('historys').where({
      _openid: openid
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res);
        let arrayObject = res.data;
        let items = [];
        if(arrayObject && arrayObject.length>0){
          items = arrayObject.slice(0,5);
        }
        items.map((item)=>{
          item.createTime = item.createTime.substr(0,10);
        })
        this.setData({
          items
        });
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
  toReviewPage: function(e){
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id;
    let url = '/pages/review/review?id='+id;
    wx.navigateTo({
      url: url
    })
  },
  toModePage: function(e){
    console.log(e.currentTarget.dataset.questions);
    wx.setStorageSync('arr', JSON.parse(e.currentTarget.dataset.questions));
    let url = '/pages/look/index';
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

  },
  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.query(res.result.openid)
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