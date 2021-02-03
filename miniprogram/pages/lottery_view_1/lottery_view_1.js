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



  onLoad: function () {
    console.log(app.globalData, 'index')
    this.setData({
      avatarUrl: app.globalData.userInfo.avatarUrl,
      nickname: app.globalData.userInfo.nickname,
    })
    this.setNavSize()
    this.onQuery();
    return;
    //获取
    var that = this
    wx.request({
      url: app.globalData.url + 'mysaward',
      data:{
        userid:app.globalData.userid,

      },
      success: function (res) {
        console.log(res.data.one)
        var data=[];
        for(var i=0;i<res.data.one.length;i++){
          var middle={};
          middle.pic1 = app.globalData.url_uploads + res.data.one[i].award__pic1;
          middle.id = res.data.one[i].award__id;
          middle.number = res.data.one[i].award__number;
          middle.name1 = res.data.one[i].award__name1;
          middle.name2 = res.data.one[i].award__name2;
          middle.name3 = res.data.one[i].award__name3;
          middle.num1 = res.data.one[i].award__num1;
          middle.num2 = res.data.one[i].award__num2;
          middle.num3 = res.data.one[i].award__num3;
          middle.level = res.data.one[i].level;
          middle.way = res.data.one[i].award__way;
          middle.time = res.data.one[i].award__time;
          if(middle.way==1){
            middle.time = util.tsFormatTime(middle.time * 1000, 'Y-M-D h:m:s')
          }
          else{
            middle.num = res.data.one[i].award__num;
          }

          data.push(middle);
        }
        that.setData({
          home_show_data:data,
        })

        

      }
    })




  },
  onQuery: function(){
    const db = wx.cloud.database()
    db.collection('lottery').orderBy('createTime', 'desc')
    .get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let arr = res.data;
      let newArr = arr.filter(item=>app.globalData.participate.indexOf(item._id) != -1)
      this.setData({
        home_show_data: newArr
      });
    })
  },
  onShow: function () {



  },
  lottery:function(e){
    console.log(e.currentTarget.dataset.awardid)
    var id = e.currentTarget.dataset.awardid;
    wx.navigateTo({
      url: '/pages/lrjlottery/lrjlottery?awardid='+id,
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