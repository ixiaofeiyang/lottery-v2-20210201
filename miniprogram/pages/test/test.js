const app=getApp()
Page({
  data: {
    image:[],

    image1: [],
    image2: [],
    image3: [],

  },
  
  onLoad:function(){
    

  },

  choosepic1: function () {
    var that = this;

    wx.chooseImage({
      count: 1,
      success: function (res) {
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 1000
        })
        var tempFilePaths = res.tempFilePaths;

        var image = that.data.image1;
        image.splice(0, 1);
        that.setData({
          image1: image
        })
        that.setData({
          image1: that.data.image1.concat(tempFilePaths),
        });
      }
    })
  },
 

  upload:function(){
    var that =this
    wx.request({
      url: app.globalData.url + 'startaward',
      data: {
        userid: 1,
        award_number:3,
        name: ['都1', '都2', '都3'],
        num: [1, 32, 421],
        way: 2,
        information: 'hhhhh',
        overtime: '',
        overnum: 30,
        pic: that.data.image1,

      },
      success: (res) => {
        console.log(res)

      },
    })
  }
})