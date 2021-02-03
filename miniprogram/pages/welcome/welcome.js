// miniprogram/pages/welcome/welcome.js
var app = getApp()
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
    wx.showLoading({
      title: '加载中',
    })
    this.setNavSize();
    this.setData({
      mode: options.mode || '1',
      awardid: options.awardid || 'ce805e786000d205045f18df2dde6b7e'
    },()=>{
      this.onGetOpenid();
    })
  },
  // 通过获取系统信息计算导航栏高度
  setNavSize: function() {
    var that = this,
      sysinfo = wx.getSystemInfoSync(),
      statusHeight = sysinfo.statusBarHeight,
      isiOS = sysinfo.system.indexOf('iOS') > -1,
      navHeight;
    if (!isiOS) {
      navHeight = 48;
    } else {
      navHeight = 44;
    }
    that.setData({
      status: statusHeight,
      navHeight: navHeight
    })
    // console.log(that.data.status,that.data.navHeight)
    app.globalData.top_height = that.data.status + that.data.navHeight
    console.log(app.globalData.top_height)
  },
  onQueryRecord: function(){
    const db = wx.cloud.database()
    db.collection('record')
    .where({
      _openid: app.globalData.openid
    })
    .get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let records = res.data;
      let participate = [];
      records.forEach(element => {
        participate.push(element.lottery);
      });
      app.globalData.participate = participate;
    })
  },

  onGetOpenid: function() {
    // 调用云函数
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      data: {

      }
    })
    .then(res => {
      console.log('[云函数] [login]: ', res)
      let openid = res.result.openid;
      app.globalData.openid = openid;
      this.setData({
        openid: openid
      },async ()=>{
        const db = wx.cloud.database();
        const res = await db.collection('profiles').where({
          _openid: openid
        }).count();
        
        console.log(res);
        if(res.total == 0){
            that.addProfile();
        }
        if(res.total > 0){
            that.queryProfile();
        }
      })

      this.onQueryRecord();
      switch(this.data.mode + ''){
        case '1':
          wx.reLaunch({
            url: '../lrjlottery/lrjlottery?source=welcome&awardid=' + this.data.awardid
          })
          break;
        case '2':
          wx.reLaunch({
            url: '../lottery_detail/lottery_detail?source=welcome&id=' + this.data.awardid
          })
          break;
      }
      


        
    }).catch(err => {
      console.error('[云函数] [login] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  },

  addProfile: function(){
    console.log(app.globalData);
    const db = wx.cloud.database();
    db.collection('profiles').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        _id: this.data.openid,
        userInfo: app.globalData.userInfo,
        auth: 0,
        time: new Date()
      }
    })
    .then(res => {
      console.log(res)
      console.log('[数据库] [查询记录] 成功: ', res);
      app.globalData.auth =  false;
    })
    .catch((err)=>{
      console.log(err)
     
    })
  },
  queryProfile: function(){
    let that = this;
    const db = wx.cloud.database()
    db.collection('profiles')
    .doc(this.data.openid)
    .get()
    .then((res)=>{
      console.log('[数据库] [查询记录] 成功: ', res);
      let {userInfo,auth} = res.data;

      app.globalData.userInfo = userInfo;
      app.globalData.auth = auth;
      this.setData({
          auth: auth,
          userInfo: Object.assign({}, this.data.userInfo, userInfo)
      })
    })
    .catch((err)=>{
      console.log(err)
      console.error('[数据库] [查询记录] 失败：', err)
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
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
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    
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