//index.js
//获取应用实例
const app = getApp()
var common = require("../../common/common.js")
var util = require('../../utils/util.js')

// 在页面中定义插屏广告
let interstitialAd = null


Page({
  data: {
    auth: 0,
    navHeight: 0,
    pages_index: 1,
    bindtap_1: 1,
    navData: [{
      name: "首页", //文本
      current: 1, //是否是当前页，0不是  1是
      style: 0, //样式
      ico: '', //不同图标
      fn: 'to_home' //对应处理函数
    }, {
      name: "发起抽奖",
      current: 0,
      style: 1,
      ico: '',
      fn: 'to_lottery'
    }, {
      name: "我的",
      current: 0,
      style: 2,
      ico: '',
      fn: 'to_me'
    }, ],

    home_show_data: [],
    user_list: [],

    avatarUrl: '',
    nickname: '',
  },



  onLoad: function() {
    console.log(app.globalData,'index')

      // 在页面onLoad回调事件中创建插屏广告实例
      if (wx.createInterstitialAd) {
        interstitialAd = wx.createInterstitialAd({
          adUnitId: 'adunit-1f2e645b8a36f033'
        })
        interstitialAd.onLoad(() => {})
        interstitialAd.onError((err) => {})
        interstitialAd.onClose(() => {})
      }

      // 在适合的场景显示插屏广告
      if (interstitialAd) {
        interstitialAd.show().catch((err) => {
          console.error(err)
        })
      }

    // this.setData({
    //   avatarUrl: app.globalData.userInfo.avatarUrl,
    //   nickname: app.globalData.userInfo.nickName,
    // })
    this.setNavSize()

    this.onQuery();
    return;
    //获取
    var that =this
    wx.request({
      url: app.globalData.url +'getHomeShow',
      success: function (res) {
        
        for (var i = 0; i < res.data.award_data.length;i++)
        {
          if (res.data.award_data[i].time!='')
            {
            res.data.award_data[i].time = util.tsFormatTime(res.data.award_data[i].time * 1000, 'Y-M-D h:m:s')
            }
          res.data.award_data[i].pic1 =app.globalData.url_uploads+res.data.award_data[i].pic1

        }

        common.home_lottery = res.data.award_data
        console.log(common.home_lottery )


        that.setData({
          home_show_data: res.data.award_data
        })

      }
    })


   

  },
  onQuery: function(){
    const db = wx.cloud.database()
    db.collection('lottery')
    .where({
      status: 0
    })
    .orderBy('createTime', 'desc')
    .get()
    .then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let arr = res.data;
      this.setData({
        home_show_data: res.data
      });
    })
  },
  onShow: function() {
    this.onGetOpenid();
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

  onQueryMyLottery: function(){
    const db = wx.cloud.database()
    db.collection('lottery')
    .where({
      _openid: this.data.openid
    })
    .orderBy('createTime', 'desc')
    .get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let records = res.data;
      let create = [];
      records.forEach(element => {
        create.push(element.lottery);
      });
      app.globalData.create = create;
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
      that.setData({
        openid:openid
      },async ()=>{
        that.onQueryPrize();
        that.onQueryRecord();
        this.onQueryMyLottery();
        const db = wx.cloud.database();
        const res = await db.collection('profiles').where({
          _openid: openid
        }).count();
         
        that.setData({
          total: res.total
        })
        console.log(res);
        if(res.total == 0){
            that.addProfile();
        }
        if(res.total > 0){
            that.queryProfile();
        }
      });
      
    }).catch(err => {
      console.error('[云函数] [login] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  },
  onQueryPrize: function(){
    const db = wx.cloud.database()
    db.collection('prize')
    .where({
      _openid: this.data.openid
    })
    .get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let prizes = res.data;
      let lucks = [];
      prizes.forEach(prize => {
        lucks.push(prize.lottery);
      })
      app.globalData.lucks = lucks;
      app.globalData.prizes = prizes;
      this.setData({
        prizes
      });
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
      app.globalData.auth = false;
      this.setData({
        auth: 0
      })
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
  onReady:function(){
    console.log("ready")
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

  onPullDownRefresh(e) {
    if (this.data.navData[0].current == 1) {
      setTimeout(function() {
        // 下拉刷新
        wx.stopPullDownRefresh()
      }, 2000)
    } else {
      setTimeout(function() {
        // 下拉刷新
        wx.stopPullDownRefresh()
      }, 1)
    }


  },

  lottery: function(e) {

    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/lottery_detail/lottery_detail?'+'id='+e.currentTarget.dataset.id,
    })
  },

  to_home: function() {
    let temp = this.data.navData

    temp[0].current = 1
    temp[1].current = 0
    temp[2].current = 0

    this.setData({
      navData: temp,
      pages_index: 1,
    })
  },

  to_lottery: function() {

    this.onQueryAdmin();
    return;
    wx.navigateTo({
      url: '/pages/award/award',
    })
  },
  onQueryAdmin: function(){
    let that = this;

    const db = wx.cloud.database()
    db.collection('admin')
    .doc('28ee4e3e601abe3c02c19541433ca3b0')
    .get()
    .then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let items = res.data.items;
      let admin = false;
      if(items.indexOf(this.data.openid) != -1){
        admin = true;
      }
      this.setData({
        admin: admin
      },()=>{
        if(this.data.admin){
          wx.navigateTo({
            url: '/pages/award/award',
          })
        }else{
          wx.navigateTo({
            url: '/pages/tip/tip',
          })
        }
      })

    })
    .catch(err=>{
      console.error('[数据库] [查询记录] 失败：', err)
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      
    })
  },
  to_me: function() {
    let temp = this.data.navData

    temp[0].current = 0
    temp[1].current = 0
    temp[2].current = 1

    this.setData({
      navData: temp,
      pages_index: 3
    })
  },

  aspiration: function() {
    wx.navigateTo({
      url: '/pages/aspiration/aspiration',
     
    })
  },//心愿

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {

    // let users = wx.getStorageSync('user');

    var that = this;

    return {
      // title: '转发',
      path: '/pages/index/index',
      title: '等你来抽奖',
      imageUrl: 'https://6875-huomaochoujiang-5gi6hhkub9205fc7-1304231741.tcb.qcloud.la/default-prize-pic.png?sign=2e0bcb120856192389dda65ec940e392&t=1605853592',

      success: function(res) {
        wx.showToast({
          title: '已转发',
        })
      }

    }


  },
})