// pages/query/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    products: [],
    logs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    // wx.request({
    //   url: 'https://www.xiaomutong.com.cn/web/index.php?r=site/getdata', //仅为示例，并非真实的接口地址
    //   method: 'post',
    //   data: {
    //     x: '',
    //     y: '',
    //     name: '1'
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success (res) {
    //     console.log(res.data)
    //   }
    // });
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=site/getproduct', //仅为示例，并非真实的接口地址
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
        let data = res.data;
        _this.setData({
          logs: data.result
        });
      }
    });
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },  
  bindClear: function(){
    console.log('clear')
    this.setData({
      inputValue: '',
      products: []
    })
  },
  bindButtonTap: function() {
    if(this.data.inputValue==''){
      this.setData({
        inputValue: '',
        products: []
      })
      return;
    }
    let _this = this;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=site/queryproduct&keywords=' + this.data.inputValue, //仅为示例，并非真实的接口地址
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
        let data = res.data;
        if(data.code == 0 && data.result.length>0){
          _this.setData({
            products: data.result
          })
        }else{
          _this.setData({
            products: []
          })
          wx.navigateTo({
            url: '/pages/empty/index',
            success: res => {
              console.log(res);
            },
            fail: err => {
              console.log(err);
            }
          })
        }
      }
    })
  },
  bindRule: function(){
    wx.navigateTo({
      url: '/pages/rule/index'
    })
  },
  bindRank: function(){
    wx.navigateTo({
      url: '/pages/rank/index'
    })
  },  
  bindChallenge: function(){
    let _this = this;
    // 查看是否授权
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              let userinfo = JSON.stringify(res.userInfo)
              wx.navigateTo({
                url: '/pages/challenge/index?userinfo='+userinfo,
                success: res => {
                  console.log(res);
                },
                fail: err => {
                  console.log(err);
                }
              })
            }
          })
        }else{
          let url = '/pages/authorize/index?action=1';
          wx.navigateTo({
            url: url
          })
        }
      }
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
  toProductPage: function(e){
    console.log(e);
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;

    let url = '/pages/product/index?id='+id;
    switch(type) {
      case '干垃圾':
        url = '/pages/residual/index?id='+id;
         break;
      case '湿垃圾':
        url = '/pages/household/index?id='+id;
         break;
      case '可回收物':
        url = '/pages/recyclable/index?id='+id;
        break;  
      case '有害垃圾':
        url = '/pages/hazardous/index?id='+id;
        break;                 
      default:
         
    } 
    wx.navigateTo({
      url: url,
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  hot: function(e){
    let type = e.currentTarget.dataset.type;
    let url = '';
    switch(type) {
      case '干垃圾':
        url = '/pages/residual/index';
         break;
      case '湿垃圾':
        url = '/pages/household/index';
         break;
      case '可回收物':
        url = '/pages/recyclable/index';
        break;  
      case '有害垃圾':
        url = '/pages/hazardous/index';
        break;                 
      default:
        wx.showModal({
          showCancel: false,
          title: '温馨提醒',
          content: '您查询的物品尚未收录，小编正在快马加鞭',
          success (res) {
            if (res.confirm) {

            } else if (res.cancel) {

            }
          }
        })
        return;
    } 
    wx.navigateTo({
      url: url,
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  }
})