//index.js
//获取应用实例
const app = getApp()
var common = require("../../common/common.js")
var util = require('../../utils/util.js')
Page({
  data: {
    status: 0,
    navHeight: 0,
    pages_index: 1,
    bindtap_1: 1,


    home_show_data: [],
    user_list: [],

    avatarUrl: '',
    nickname: '',
  },


  onQuery: function(){
    const db = wx.cloud.database()
    db.collection('lottery')
    .where({
      _openid: app.globalData.openid
    })
    .orderBy('createTime', 'desc')
    .get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let arr = res.data;
      this.setData({
        home_show_data: arr
      });
    })
  },
  onLoad: function () {
    console.log(app.globalData, 'index')
    this.setData({
      avatarUrl: app.globalData.avatarUrl,
      nickname: app.globalData.nickname,
    })
    this.onQuery();
    this.setNavSize()
    return;

    //获取
    var that = this
    wx.request({
      url: app.globalData.url + 'mysaward',
      data: {
        userid: app.globalData.userid,

      },
      success: function (res) {
        console.log(res.data.two)
        var data = [];
        for (var i = 0; i < res.data.two.length; i++) {
          var middle = {};
          middle.pic1 = app.globalData.url_uploads + res.data.two[i].pic1;
          middle.id = res.data.two[i].id;
          middle.number = res.data.two[i].number;
          middle.name1 = res.data.two[i].name1;
          middle.name2 = res.data.two[i].name2;
          middle.name3 = res.data.two[i].name3;
          middle.num1 = res.data.two[i].num1;
          middle.num2 = res.data.two[i].num2;
          middle.num3 = res.data.two[i].num3;
          middle.status = res.data.two[i].status;
          middle.way = res.data.two[i].way;
          middle.time = res.data.two[i].time;
          if (middle.way == 1) {
            middle.time = util.tsFormatTime(middle.time * 1000, 'Y-M-D h:m:s')
          }
          else {
            middle.num = res.data.two[i].num;
          }

          data.push(middle);
        }
        that.setData({
          home_show_data: data,
        })



      }
    })




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