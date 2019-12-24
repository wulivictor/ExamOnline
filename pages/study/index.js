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
    let code = e.detail.value;
    this.setData({
      code
    })
    this.getOpenid().then(res=>{
      this.generate(res,code);
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options); 
    this.getByCode();

    
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
  generate: function (openid,code) {
    let _this = this;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=study/getitems', //仅为示例，并非真实的接口地址
      method: 'post',
      data: {
          openid,
          code
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        let data = res.data.result;
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