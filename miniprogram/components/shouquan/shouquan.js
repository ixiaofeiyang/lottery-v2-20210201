// component/shouquan/shouquan.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    hq: true,

  },
  ready: function () {
    console.log("app.globalData", app.globalData)
    
  },
  /**
   * 组件的方法列表
   */
  methods: {

    onGotUserInfo(e) {
      
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
                that.setData({
                  hq: false,
                })
               
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
            that.setData({
              hq: false,
            })
            wx.reLaunch({
              url: '../index/index'
            })
          })
          .catch((err)=>{
            console.log(err)
          })
  
      }
       
    },






  }
})