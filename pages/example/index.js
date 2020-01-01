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
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath,
    });
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
        let o1 = 'A：'+options[0]['content'];
        let o2 = 'B：'+options[1]['content'];
        let o3 = 'C：'+options[2]['content'];
        let o4 = 'D：'+options[3]['content'];   
        _this.setData({
          question: question,
          template: new Card().palette(question.title,o1,o2,o3,o4)
        },()=>{
          console.log('完成')
        })
      }
    });
  }
});
