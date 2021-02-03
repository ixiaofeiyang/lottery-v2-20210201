// pages/look_lucky_user/look_lucky_user.js



const app = getApp()
var util = require('../../utils/util.js')
var common = require("../../common/common.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:0,
    awardid:'',
    data_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      height: app.globalData.top_height,
      awardid:options.awardid
    })


    var that =this
    //获取参与人员
    wx.request({
      url: app.globalData.url + 'getAwardPeople',
      data: {
        'id': options.awardid
      },
      method: 'GET',
      success: function (res) {
        console.log("打印数据")
        console.log(res)
        that.setData({
          data_list:res.data.data
        })
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

  look_address:function(){
    wx.navigateTo({
      url: '/pages/look_address/look_address',
    })
  }
})