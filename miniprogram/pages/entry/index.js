// pages/mode/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false,
    name: '',
    modes: [
      { id: '0', title: '单题模式' },
      { id: '1', title: '列表模式'}
    ],
    mode: '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let id = options.id;
    this.setData({
      id
    });
    this.generate(id);
    this.onQuery(id);
  },

  goByMode: function(e){
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id;
    switch(id){
      case '0':
        this.goExam();
        break;
      case '1':
      this.goQuesList();
        break;
      default:
        console.log('异常');
    }
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
  goExam: function () {
    let url = '/pages/exam/exam';
    wx.navigateTo({
      url: url
    })
  },
  goQuesList: function () {
    let url = '/pages/simple/index';
    wx.navigateTo({
      url: url
    })
  },
  goQuesList: function () {
    let id = this.data.id;
    let url = '/pages/question/index?id=' + id;
    wx.navigateTo({
      url: url
    })
  },
  onQuery: function (id) {

    const db = wx.cloud.database()
    db.collection('subjects').doc(id).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        wx.setStorageSync('subject', res.data);
        this.setData({
          name: res.data.name
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
  generate: function (pid) {

    const db = wx.cloud.database()
    db.collection('questions').where({
      examid: pid
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        let items = res.data;
        let arr = [];
        items.forEach(element => {
          arr.push(element._id);
        });
        wx.setStorageSync('arr', arr);
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