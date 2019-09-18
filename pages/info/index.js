const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    nickName: '',
    avatarUrl: '',
    userInfo: {
      nickName: '',
      avatarUrl: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.userInfo);
    this.setData({
      userInfo: app.globalData.userInfo
    })

    let _this = this;
    wx.login({
      success (res) {
        console.log(res);
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://www.xiaomutong.com.cn/web/index.php?r=wechat/getinfo2',
            method: 'post',
            data: {
              code: res.code
            },
            success (res) {
              console.log(res.data);
              if(res.data && res.data.code == 0){
                let result = JSON.parse(res.data.result);
                console.log(result);
                _this.Getuserinfobyopenid(result.openid);
                _this.setData({
                  openid: result.openid
                })
              }
            },
            fail (err){
              console.log(err);
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })    
  },
  Getuserinfobyopenid: function(openid){
    let _this = this;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=userinfo/getuserinfobyopenid',
      method: 'post',
      data: {
        openid: openid
      },
      success (res) {
        console.log(res.data);
        if(res.data && res.data.code == 0 && res.data.result){
          console.log(res.data);
          let userInfo = JSON.parse(decodeURIComponent(res.data.result.userinfo));
          let avatarUrl = userInfo.avatarUrl;
          let nickName = userInfo.nickName;
          _this.setData({
            userInfo: userInfo,
            avatarUrl: avatarUrl,
            nickName: nickName
          })
        }
      },
      fail (err){
        console.log(err);
      }
    })
  },
  bindMakeFriend: function(){
    let url = '/pages/friend/index';
    wx.navigateTo({
      url: url
    })
  },
  bindGiveHongbao: function(){
    let url = '/pages/sponsor/index';
    wx.navigateTo({
      url: url
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

  }
})