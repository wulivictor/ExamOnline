// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: true,
    name: "",
    type: "",
    array: ['请选择类别','干垃圾', '湿垃圾', '可回收物', '有害垃圾'],
    objectArray: [
      {
        id: 0,
        name: '请选择类别'
      },
      {
        id: 1,
        name: '干垃圾'
      },
      {
        id: 2,
        name: '湿垃圾'
      },
      {
        id: 3,
        name: '可回收物'
      },
      {
        id: 4,
        name: '有害垃圾'
      }
    ],
    index: 0
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  }, 

  bindKeyInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  bindButtonTap: function() {
    console.log(this.data);
    var name = this.data.name;
    var type = this.data.type;
    var array = this.data.array;
    var index = this.data.index;
    type = array[index];
    if(name == ''){
      wx.showToast({
        title: '请先输入',
        icon: 'success',
        duration: 2000
      })
      return;
    }
    if(index == 0){
      wx.showToast({
        title: '请先选择',
        icon: 'success',
        duration: 2000
      })
      return;
    }
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=site/addproduct&name='+ name +'&type='+type,
      method: 'post',
      data: {
        name: name,
        type: type
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        
        // wx.showModal({
        //   showCancel: false,
        //   title: '温馨提醒',
        //   content: '谢谢您提交，小编会在24小时之内审核',
        //   success (res) {
        //     if (res.confirm) {

        //     } else if (res.cancel) {

        //     }
        //   }
        // })
 
      }
    })
  }
})