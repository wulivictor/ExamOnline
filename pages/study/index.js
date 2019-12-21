// pages/mode/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    subjects: [],
    items: [
      { name: '0', value: '单题模式', checked: 'true' },
      { name: '1', value: '列表模式' }
    ],
    examcode: '',
    code: '0000'

  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      code: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options); 
    this.getByCode();
    this.generate();
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
  toEntryPage: function(){
    let code = this.data.code;
    if(code == '0000'){
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请先选择一个科目',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
    let url = '/pages/entry/index?code='+code;
    wx.navigateTo({
      url: url
    })
  },  
  toDetailPage: function(){
    let code = this.data.code;
    if(code == '0000'){
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请先选择一个科目',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
    let url = '/pages/detail/index?code='+code;
    wx.navigateTo({
      url: url
    })
  },    
  generate: function () {
    let _this = this;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=study/getall', //仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        let data = res.data.length == 0 ? [] : res.data;
        let items = [];
        data.map(function(item){
          items.push(item.quid)
        });
        wx.setStorageSync('study', items);
      }
    });
  },
  getByCode: function () {
    let _this = this;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=subjects/getall', //仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        wx.setStorageSync('subjects', res.data.result);
        let subjects = res.data.result;
        let code = _this.data.code;
        if(subjects.length == 1){
          subjects.map(function(obj) { 
            code  = obj['code'];
            obj.checked = 'true';
            return obj;
         });
        }
        _this.setData({
          subjects,
          code
        })
      }
    });
  }
})