// pages/question/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx: 0,
    sortcode: '01',
    buttonText: "下一题",
    image: 'https://www.xiaomutong.com.cn/public/question/01/001.jpg',
    items: [
      { name: '1', value: '' },
      { name: '2', value: '' },
      { name: '3', value: '' },
      { name: '4', value: '' }
    ],
    objects: ['西瓜','梨子','火柴','甜芦黍','地栗','生枣','荔枝','西瓜','柚子','尿片'],
    users: [],
    answers: ['2', '2', '1', '2', '2', '2', '2', '2', '2', '1'],
    imgArr: [
      "https://www.xiaomutong.com.cn/public/question/01/001.jpg",
      "https://www.xiaomutong.com.cn/public/question/01/002.jpg",
      "https://www.xiaomutong.com.cn/public/question/01/003.jpg",
      "https://www.xiaomutong.com.cn/public/question/01/004.jpg",
      "https://www.xiaomutong.com.cn/public/question/01/005.jpg",
      "https://www.xiaomutong.com.cn/public/question/01/006.jpg",
      "https://www.xiaomutong.com.cn/public/question/01/007.jpg",
      "https://www.xiaomutong.com.cn/public/question/01/008.jpg",
      "https://www.xiaomutong.com.cn/public/question/01/009.jpg",
      "https://www.xiaomutong.com.cn/public/question/01/010.jpg"
    ]
  },
  bindCheck1: function(){
    let items = [
      {name: '1', value: ''},
      {name: '2', value: ''},
      {name: '3', value: ''},
      {name: '4', value: ''}
    ];
    console.log(items);
    items[0]['checked'] = 'true';
    console.log(items);
    let idx = this.data.idx;
    let users = this.data.users;
    users[idx]= 1;
    this.setData({
      items: items,
      users: users
    })
  },
  bindCheck2: function(){
    let items = [
      {name: '1', value: ''},
      {name: '2', value: ''},
      {name: '3', value: ''},
      {name: '4', value: ''}
    ];
    items[1]['checked'] = 'true';
    let idx = this.data.idx;
    let users = this.data.users;
    users[idx]= 2;
    this.setData({
      items: items,
      users: users
    })
  },
  bindCheck3: function(){
    let items = [
      {name: '1', value: ''},
      {name: '2', value: ''},
      {name: '3', value: ''},
      {name: '4', value: ''}
    ];
    items[2]['checked'] = 'true';
    let idx = this.data.idx;
    let users = this.data.users;
    users[idx]= 3;
    this.setData({
      items: items,
      users: users
    })
  },
  bindCheck4: function(){
    let items = [
      {name: '1', value: ''},
      {name: '2', value: ''},
      {name: '3', value: ''},
      {name: '4', value: ''}
    ];
    items[3]['checked'] = 'true';
    let idx = this.data.idx;
    let users = this.data.users;
    users[idx]= 4;
    this.setData({
      items: items,
      users: users
    })
  },    
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    let idx = this.data.idx;
    let users = this.data.users;
    users[idx] = e.detail.value;
    this.setData({
      users: users
    })

  },
  bindButtonTap: function () {
    console.log(this.data.items);
    let idx = this.data.idx;
    let imgArr = this.data.imgArr;
    let users = this.data.users;
    if(typeof users[idx] === 'undefined'){
      wx.showToast({
        title: '请先选择',
        icon: 'success',
        duration: 2000
      })
      return;
    }
    console.log(idx);
    if (idx < 8) {
      let j = idx + 1;
      this.setData({
        idx: j,
        sortcode: '0' + (j+1),
        image: imgArr[j],
        items: [
          { name: '1', value: '' },
          { name: '2', value: '' },
          { name: '3', value: '' },
          { name: '4', value: '' }
        ]
      })
    }
    if (idx == 8) {
      let j = idx + 1;
      this.setData({
        idx: j,
        sortcode: j+1,
        buttonText: "提交",
        image: imgArr[j],
        items: [
          { name: '1', value: '' },
          { name: '2', value: '' },
          { name: '3', value: '' },
          { name: '4', value: '' }
        ]
      })
    }
    let score = 0;
    if (idx == 9) {
      let answers = this.data.answers;
      let users = this.data.users;
      let objects = this.data.objects;
      wx.setStorage({
        key:"answers",
        data: answers
      })
      wx.setStorage({
        key:"users",
        data: users
      })
      wx.setStorage({
        key:"objects",
        data: objects
      })
      for (let index = 0; index < 10; index++) {
        let ele1 = answers[index];
        let ele2 = users[index];
        if (ele1 == ele2) {
          score += 10;
        }
      }
      wx.showModal({
        showCancel: false,
        title: '温馨提醒',
        content: '您本次答题为' + score,
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              //url: '/pages/result/index?score=' + score,
              url: '/pages/authorize/index?action=2&score=' + score,
              success: res => {
                console.log(res);
              },
              fail: err => {
                console.log(err);
              }
            })
          } else if (res.cancel) {

          }
        }
      })
    }


  },
  bindButtonTap2: function () {
    wx.showModal({
      showCancel: false,
      title: '温馨提醒',
      content: '小编正在给您计算分数，请稍后',
      success(res) {
        if (res.confirm) {

        } else if (res.cancel) {

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorage({
      key:"index",
      data: '003'
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