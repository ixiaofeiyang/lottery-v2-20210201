//index.js
//获取应用实例
const app = getApp()
var common = require("../../common/common.js")
var util = require('../../utils/util.js')
Page({
  data: {
    number:1,//奖项数量 
    user1:[//一等奖获奖状况
      {
        pic: "/static/2.jpg",
        name:"李坤",
      },
      {
        pic: "/static/2.jpg",
        name: "李坤",
      },
      
      {
        pic: "/static/2.jpg",
        name: "李坤",
      },
    
      


    ],
    user2: [//二等奖获奖状况
      {
        pic: "/static/2.jpg",
        name: "李坤",
      },
      {
        pic: "/static/2.jpg",
        name: "李坤",
      },

      {
        
        pic: "/static/2.jpg",
        name: "李坤",
      },




    ],
    user3: [//三等奖获奖状况
      {
        pic: "/static/2.jpg",
        name: "李坤",
      },
      {
        pic: "/static/2.jpg",
        name: "李坤",
      },

      {

        pic: "/static/2.jpg",
        name: "李坤",
      },




    ],
    pic:"/static/2.jpg",
    status: 0,
    navHeight: 0,
    pages_index: 1,
    bindtap_1: 1,


    home_show_data: [],
    user_list: [],

    avatarUrl: '',
    nickname: '',
  },



  onLoad: function () {
    console.log(app.globalData, 'index')
    this.setData({
      avatarUrl: app.globalData.avatarUrl,
      nickname: app.globalData.nickname,
    })
    this.setNavSize()

   
   




  },

  onShow: function () {



  },
  lottery: function (e) {
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/lrjlottery/lrjlottery?awardid=' + id,
    })

  },




  // 通过获取系统信息计算导航栏高度
  setNavSize: function () {
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














})