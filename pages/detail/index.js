// pages/simple/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    idx: 0,
    buttontext: '下一个',
    score: 0,
    score_arr:[0,0,0,0,0,0,0,0,0,0],
    code_arr:['M','M','M','M','M','M','M','M','M','M'],
    options: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let idx = this.data.idx;
    this.generate().then(res=>{
      let arr = res;
      this.setData({
        arr
      }, function() {
        // this is setData callback
        this.getQuestion(arr[idx]);
        this.getOptions(arr[idx]);
      })
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getOpenid().then(res=>{
      this.setData({
        openid: res
      })
    });
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
  generate: function(){
    return new Promise(function (resolve, reject) {
      resolve(wx.getStorageSync('study'))
    }).catch(res=>{
      console.log('catch',res)
    });
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    console.log(e);
    let score_arr = this.data.score_arr;
    let code_arr = this.data.code_arr;
    let quid_arr = this.data.quid_arr;
    let idx = this.data.idx;
    let score = this.data.score;
    score += parseInt(e.detail.value);
    console.log('20191221');
    console.log(JSON.parse(e.detail.value));
    score_arr[idx] = parseInt(JSON.parse(e.detail.value).value);
    code_arr[idx] = JSON.parse(e.detail.value).code;
    // quid_arr[idx] = JSON.parse(e.detail.value).qid;
    console.log(score_arr);
    console.log(code_arr);
    wx.setStorageSync('score_arr', score_arr);
    wx.setStorageSync('code_arr', code_arr);
    this.setData({
      score,
      score_arr,
      code_arr
    });
  },  
  onNextTap: function(){
    let _this = this;
    let score = this.data.score;
    let arr = this.data.arr;
    let score_arr = this.data.score_arr;
    let code_arr = this.data.code_arr;

    let idx = this.data.idx;
  
    this.getNewOne();

       
  },
  addStudy: function(openid,quid){
    let _this = this;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=study/add',
      method: 'post',
      data: {
        openid,
        quid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
      }
    });
  },
  getNewOne: function(){
    let _this = this;
    let score = this.data.score;
    let arr = this.data.arr;
    let score_arr = this.data.score_arr;
    let code_arr = this.data.code_arr;

    let idx = this.data.idx;

    let buttontext = this.data.buttontext;
    idx++;
    let length = arr.length;
    if(idx== length-1){
      buttontext = '完成';
    }
    if(idx==arr.length){
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '本次错题回顾已完成',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            _this.bindgoHome();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
    this.setData({
      idx,
      buttontext
    })
    
    this.getQuestion(arr[idx]);
    this.getOptions(arr[idx]); 
  },
  bindgoscore: function(score){
    let url = '/pages/score/index?score='+score;
    wx.navigateTo({
      url: url
    })
  },
  bindgoHome: function(){
    let url = '/pages/home/index';
    wx.switchTab({
      url: url
    })
  },
  getQuestion: function(id){
    let _this = this;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=question/getquestionbyid',
      method: 'post',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        let question = res.data.result;
        _this.setData({
          question: question
        })
      }
    });
  },
  getOptions: function(id){
    let _this = this;
    wx.request({
      url: 'https://www.xiaomutong.com.cn/web/index.php?r=answer/getanswersbyqid',
      method: 'post',
      data: {
        qid: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        let options = res.data.result;
        let format_options = options.map(function(item){
          item.checked = item.value == 1 ? true : false;
          return item;
        });
        _this.setData({
          options: format_options
        })
      }
    });
  }
})