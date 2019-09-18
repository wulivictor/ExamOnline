const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = true;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordFilePath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

    recorderManager.onStart(() => {
      console.log('recorder start')
    })
    recorderManager.onPause(() => {
      console.log('recorder pause')
    })
    recorderManager.onStop((res) => {
      // {"tempFilePath":"http://tmp/wxc06cce902e600a75.o6zAJs-iilboZOrrMisOj_2ECmXU.VY7VJyBouzft9dc5de13792e0a9a58c09ab94f1122e7.durationTime=2719.aac","fileSize":91772,"duration":2719}
      console.log('recorder stop', res)
      const { tempFilePath } = res
      this.setData({
        recordFilePath : tempFilePath
      })
      
      innerAudioContext.src = tempFilePath;
      innerAudioContext.play();
      wx.playVoice({
        filePath: tempFilePath,
        success () {
          console.log('success')
        },
        complete () { 
          console.log('complete')
        },
        fail () {
          console.log('fail')
        }
      })
    })
    recorderManager.onFrameRecorded((res) => {
      const { frameBuffer } = res
      console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    })

    //音频播放
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

  },
  startRecord() {
    const options = {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'aac',
      frameSize: 50
    }
    
    recorderManager.start(options)
  },
  stopRecord() {
    recorderManager.stop();
  },
  playVoice: function(){
    const tempFilePath = this.data.recordFilePath;
    console.log(tempFilePath);
    wx.playVoice({
      filePath: tempFilePath,
      success () {
        console.log('success')
      },
      complete () { 
        console.log('complete')
      },
      fail () {
        console.log('fail')
      }
    })
  },
  stopVoice: function(){
    wx.stopVoice()
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