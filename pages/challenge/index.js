// pages/challenge/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx: 0,
    score: 0,
    total: 10,
    product: null,
    products: [],
    rights: [],
    answers: []
  },
  bindSelect: function(e){
    let _this = this;
    console.log(e.currentTarget.dataset.type);
    let type = e.currentTarget.dataset.type;
    let rights = this.data.rights;
    rights.push(type);
    
    let score = this.data.score;
    let answers = this.data.answers;
    let idx = this.data.idx;
    let products = this.data.products;
    let right = products[idx]['type'];
    if(type == right){
      score++;
      answers.push(1);
      console.log(score);
      wx.showToast({
        title: '正确',
        image: '/icons/smile.png',
        duration: 500
      })
    }
    if(type != right){
      answers.push(0);
      wx.showToast({
        title: '错误',
        image: '/icons/Error_Icon.png',
        duration: 500,
        success: function(){
          _this.addScore(score,answers,rights);
        }
      })
    }
    idx++;
    setTimeout(()=>{
      
      if(idx==10){
        // this.showModal();
        this.addScore(score,answers,rights);
        return;
      }
      this.setData({
        score: score,
        idx: idx,
        answers: answers,
        rights: rights,
        product: products[idx]
      })
    },1000)

  },
  addScore: function(score,answers,rights){
    
    let openid = this.data.openid;
    let userinfo = this.data.userinfo;
    let _this = this;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=score/addscore',
      method: 'post',
      data: {
        openid: openid,
        userinfo: encodeURIComponent(userinfo),
        score: score
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        wx.redirectTo({
          url: '/pages/benchmark/index?score='+score+'&answers='+JSON.stringify(answers)+'&rights='+JSON.stringify(rights)
        })
      }
    });
  },
  showModaltoContinue: function(){
    let _this = this;
    wx.showModal({
      showCancel: false,
      title: '提示',
      content: '您可以查看排名',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          // _this.getImages();
          // _this.setData({
          //   idx: 0
          // })
          wx.redirectTo({
            url: '/pages/rank/index'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(options);
    let userinfo = options.userinfo;
    this.setData({
      userinfo: userinfo
    })
    this.getImages();
  },
  getImages: function(){
    let _this = this;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=images/getimages',
      method: 'post',
      data: {
  
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        let arrayObject = res.data.result;
        let new_arrayObject = arrayObject.slice(0,10);
        let product = new_arrayObject[0];
        wx.setStorage({
          key:"products",
          data:new_arrayObject
        })
        _this.setData({
          product: product,
          products: new_arrayObject
        },()=>{
          wx.hideLoading();
        })
      }
    });
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
      this.showModaltoContinue();
    }.bind(this), 200)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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