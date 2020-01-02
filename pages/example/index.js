import Card from '../../palette/card';

// src/pages/xml2can/xml2can.js
Page({
  imagePath: '',

  /**
   * 页面的初始数据
   */
  data: {
    template: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let id = options.id;
    this.getQuestion(id);
  },

  onImgOK(e) {
    this.imagePath = e.detail.path;
    this.setData({
      image: this.imagePath
    })
    console.log(e);
  },

  saveImage() {
    // wx.saveImageToPhotosAlbum({
    //   filePath: this.imagePath,
    // });
    this.save({
      tempFilePath: this.imagePath
    })
  },
  save: function(data){
    wx.getSetting({
      success: res => {
        console.log(res);     
        if (res.authSetting['scope.writePhotosAlbum']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.saveImageToPhotosAlbum({
            filePath: data.tempFilePath,
            success(result) {
              wx.hideLoading()
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: '图片已保存到本地',
                success (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
              console.log(result)
            }
          })
        }else if(!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(result) {
              wx.saveImageToPhotosAlbum({
                filePath: data.tempFilePath,
                success(result) {
                  wx.hideLoading()
                  wx.showModal({
                    showCancel: false,
                    title: '提示',
                    content: '海报已保存到本地',
                    success (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                  console.log(result)
                },
                fail: function(err){
                  wx.showModal({
                    showCancel: false,
                    title: '提示',
                    content: JSON.stringify(err),
                    success (res) {
                     
                    }
                  })
                }
              })
            },
            fail: function(err){
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: JSON.stringify(err),
                success (res) {
                 
                }
              })
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let question = this.data.question;
    
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
        let options = JSON.parse(question.options);

        let title = question.title;
        console.log(title.length); 

        let o1 = 'A：'+options[0]['content'];
        let o2 = 'B：'+options[1]['content'];
        let o3 = 'C：'+options[2]['content'];
        let o4 = 'D：'+options[3]['content'];   
        let l0 = parseInt(Math.ceil(parseInt(title.length)/20));
        let l1 = parseInt(Math.ceil(parseInt(o1.length)/20));
        let l2 = parseInt(Math.ceil(parseInt(o2.length)/20));
        let l3 = parseInt(Math.ceil(parseInt(o3.length)/20));
        let l4 = parseInt(Math.ceil(parseInt(o4.length)/20));
        console.log(l0,l1,l2,l3,l4);
        _this.setData({
          question: question,
          template: new Card().palette(question.title,o1,o2,o3,o4,l0,l1,l2,l3,l4)
        },()=>{
          console.log('完成')
        })
      }
    });
  }
});
