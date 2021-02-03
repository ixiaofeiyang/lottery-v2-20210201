// miniprogram/pages/auth/auth.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
    this.onGetTime();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      openid: app.globalData.openid
    })
  },
  youkeGo: function(){
    wx.navigateBack({
      delta: 1
    })
  },
  onGotUserInfo: function(e) {
    let that = this;
    console.log(e);

    if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
        //拒绝
        wx.showModal({
          showCancel: false,
          title: '提示',
          confirmText: '我知道了',
          content: '确定使用游客身份体验吗',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')

              that.goHome();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })       

    } else if (e.detail.errMsg === 'getUserInfo:ok') {
        //允许
      
        let userInfo = e.detail.userInfo;
  
        app.globalData.userInfo = userInfo;
        this.data.userInfo = userInfo;


        const db = wx.cloud.database();
        const _ = db.command;
        db.collection('profiles').doc(app.globalData.openid).update({
          // data 字段表示需新增的 JSON 数据
          data: {
            userInfo,
            auth: 1
          }
        })
        .then(res => {
          app.globalData.auth = true;
          console.log(res)
          console.log('[数据库] [查询记录] 成功: ', res);

          wx.navigateBack({
            delta: 1
          })
        })
        .catch((err)=>{
          console.log(err)
        })

    }

  },
  update: function(){
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'update',
      data: {
        userInfo: this.data.userInfo
      }
    })
    .then(res=>{
      console.log('[云函数] [update]: ', res)

    })
    .catch(err=>{
      console.error('[云函数] [update] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })

  },
  goHome: function(){
    wx.navigateTo({
      url: '../role/role',
    })
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
  onGetTime: function() {
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getTime',
      data: {}
    })
    .then(res=>{
      console.log('[云函数] [getTime]: ', res)
      that.setData({
        time: res.result.time,
        today: res.result.today
      })
    })
    .catch(err=>{
      console.error('[云函数] [getTime] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  }
})