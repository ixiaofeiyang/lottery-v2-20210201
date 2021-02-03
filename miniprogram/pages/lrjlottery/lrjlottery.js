var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    auth: true,
    number: 2,//奖项数量 
    user1: [//一等奖获奖状况
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

    ],
    user3: [//三等奖获奖状况
      {
        pic: "/static/2.jpg",
        name: "李坤",
      }
    ],
    a: true,
    b:false,
    name: '',
    pic: '',
    height_screen: 0,
    top_height: 0,
    background: 'rgba(255, 255, 255, 1)',
    color: 'rgba(0, 0, 0, 1)',
    titleText: '导航栏',
    titleImg: '',
    backIcon: '',
    homeIcon: '',
    fontSize: 16,
    iconHeight: 19,
    iconWidth: 58,
    could_join: true,
    share_flag: false,
    join: false,
    cd: 7,
    canyu: ["/images/icn-zu@3x.png",
      "/images/icn-zu@3x.png",
      "/images/icn-zu@3x.png",
      "/images/icn-zu@3x.png",
      "/images/icn-zu@3x.png",
      "/images/icn-zu@3x.png",
      "/images/icn-zu@3x.png",
    ],
    level: '',//几等奖
    state: '', //个人对于奖项的状态
    awardid: '',
    imgurls: [],
    jpms: '',
    index: 1, //抽奖方式
    jpname: '',
    jpnum: 0,
    animation: '',
    date: '', //日期
    s: 1,
    status: 0, //奖项状态
    kpnum: 0, //开奖人数||最多抽奖人数
    userid: '', //用户登录
    navHeight: 0,
    prizes: [],
    luck: false
  },
  whole: function () {
    wx.navigateTo({
      url: '/pages/chakanrenshu/chakanrenshu?awardid=' + this.data.awardid,
    })
  },

  onQuery: function(){
    const db = wx.cloud.database()
    db.collection('lottery').doc(this.data.awardid)
    .get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let lottery = res.data;
      let pic = [];
      pic.push(lottery.pic1);
      this.setData({
        data_lottery: lottery,
        pic,
        index: lottery.way,
        kpnum: lottery.num,
        cd: lottery.total,
        status: lottery.status,
        state: lottery.state
      });
    })
  },
  onQueryRecord: function(){
    const db = wx.cloud.database()
    db.collection('record')
    .where({
      lottery:this.data.awardid,
    })
    .limit(10)
    .get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let records = res.data;
      let canyu = [];
      records.forEach(element => {
        canyu.push(element.userInfo.avatarUrl);
      });
      this.setData({
        canyu
      });
    })
  },
  onQueryPrize: function(){
    const db = wx.cloud.database()
    db.collection('prize')
    .where({
      lottery:this.data.awardid
    })
    .get().then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let prizes = res.data;
      let arr = [];
      prizes.forEach(prize => {
        arr.push(prize._openid);
      })
      let luck = false;
      if(arr.indexOf(app.globalData.openid) != -1){
        luck = true;
      }
      this.setData({
        prizes,
        luck
      });
    })
  },


/**
* 生命周期函数--监听页面加载
*/
  onLoad: function (options) {
    this.setNavSize()
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight)
        that.setData({
          height_screen: res.windowHeight
        })
      }
    })
    this.setData({
      top_height: app.globalData.top_height
    })
    this.attached()
    wx.hideShareMenu();
    //options.awardid
    var source = options.source;
    var awardid = options.awardid;
    var userid = app.globalData.userid;

    that.setData({
      source,
      awardid: awardid
    },()=>{
      this.onQuery();
      this.onQueryRecord();
      this.onQueryPrize();
    })

    return;
    //获取参与人员
    wx.request({
      url: app.globalData.url + 'getAwardPeople',
      data: {
        'id': awardid
      },
      method: 'GET',
      success: function (res) {
        console.log("打印数据")
        console.log(res.data.data)
        var data1=[];
        var data2=[];
        var data3=[];
        var number=1;
        var cd = [];
        for (var i = 0; i < res.data.data.length; i++) {
          cd[i] = res.data.data[i].user__picture;
          var middle={};
          if(res.data.data[i].level==1){
            middle.pic = res.data.data[i].user__picture;
            middle.name = res.data.data[i].user__nickname;
            data1.push(middle);
          }
          if (res.data.data[i].level == 2) {
            middle.pic = res.data.data[i].user__picture;
            middle.name = res.data.data[i].user__nickname;
            data2.push(middle);
            if(number!=3){
              number=2;
            }
          }
          if (res.data.data[i].level == 3) {
            middle.pic = res.data.data[i].user__picture;
            middle.name = res.data.data[i].user__nickname;
            data3.push(middle);
            number=3;
          }
        }
        //先默认为7
        that.setData({
          canyu: cd,
          cd: cd.length,
          user1:data1,
          user2:data2,
          user3:data3,
          number:number,
        })
      },
      fail: function (res) {
        console.log('fail')
      },
    })

    wx: wx.request({
      url: app.globalData.url + 'getUserAwardState',
      data: {
        'awardid': awardid,
        "userid": userid
      },
      method: 'GET',
      success: function (res) {
        var join = false;
        var f3 = res.data.user_data;
        var f1 = res.data.award_data;
        var f2 = res.data.interpret;
        var f4 = res.data.userWithaward;
        console.log(f1, f2, f3, f4)

        var jpname = [f1[0].name1, f1[0].name2, f1[0].name3];
        var jpnum = [f1[0].num1, f1[0].num2, f1[0].num3];
        var images = [f1[0].pic1, f1[0].pic2, f1[0].pic3];
        var date = f1[0].time * 1000;
        date = util.tsFormatTime(date, 'Y/M/D h:m:s');
        that.setData({
          index: f1[0].way, //开奖方式
          jpname: jpname,
          jpnum: jpnum,
          date: date, //开奖时间
          kpnum: f1[0].num, //开奖人数
          s: f1[0].number, //奖品个数
          jpms: f1[0].information,
          imgurls: images,
          status: f1[0].status, //抽奖状态
          name: f3.nickname,
          pic: f3.picture,
        })
        that.setData({
          number:that.data.s
        })
        var index = that.data.index;
        var status = that.data.status;
        var fuser = f3.userid;
        if (index == 3 && status == 1 && fuser == userid) that.setData({ a: false });
        else that.setData({ a: true });
        //判断是否可以手动开奖

        if ( status == 2 && fuser == userid) that.setData({ b: true });
        else that.setData({ b: false });
        //判断是否展示给发起人中奖者名单的联系方式
  
        if (f4 != '')
          that.setData({
            level: f4[0].level
          })
        else that.setData({
          level: 0
        })
        var s = f1[0].number;

        var image = that.data.imgurls;
        if (s == 1) image = [app.globalData.iurl + image[0]];
        else if (s == 2) image = [app.globalData.iurl + image[0], app.globalData.iurl + image[1]];
        else image = [app.globalData.iurl + image[0], app.globalData.iurl + image[1], app.globalData.iurl + image[2]];
        that.setData({
          imgurls: image
        })
      },
      fail: function (res) {
        console.log('fail')
      },

    })

    //判断是否可以抽奖
    var state = 0;
    wx.request({
      url: app.globalData.url + 'checkLottery',
      data: {
        'userid': userid,
        'id': awardid
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        state = res.data.state;
        that.setData({
          state: state,
        })
        if (state == 0)
          that.setData({
            could_join: false,
          })
      },
      fail: function (res) {
        console.log('fail');
      },
    })
    var timer = setInterval(function () {
      userid = app.globalData.userid
      if (that.data.jpname == '') {

        wx: wx.request({
          url: app.globalData.url + 'getUserAwardState',
          data: {
            'awardid': awardid,
            "userid": userid
          },
          method: 'GET',
          success: function (res) {
            var join = false;
            var f3 = res.data.user_data;
            var f1 = res.data.award_data;
            var f2 = res.data.interpret;
            var f4 = res.data.userWithaward;
            console.log(f1, f2, f3, f4)

            var jpname = [f1[0].name1, f1[0].name2, f1[0].name3];
            var jpnum = [f1[0].num1, f1[0].num2, f1[0].num3];
            var images = [f1[0].pic1, f1[0].pic2, f1[0].pic3];
            var date = f1[0].time * 1000;
            date = util.tsFormatTime(date, 'Y/M/D h:m:s');
            that.setData({
              index: f1[0].way, //开奖方式
              jpname: jpname,
              jpnum: jpnum,
              date: date, //开奖时间
              kpnum: f1[0].num, //开奖人数
              s: f1[0].number, //奖品个数
              jpms: f1[0].information,
              imgurls: images,
              status: f1[0].status, //抽奖状态
              name: f3.nickname,
              pic: f3.picture,
            })
            var index = that.data.index;
            var status = that.data.status;
            var fuser = f3.userid;
            if (index == 3 && status == 1 && fuser == userid) that.setData({ a: false });
            else that.setData({ a: true });
            if (f4 != '')
              that.setData({
                level: f4[0].level
              })
            else that.setData({
              level: 0
            })
            var s = f1[0].number;
            that.setData({
              number: that.data.s
            })
            var image = that.data.imgurls;
            if (s == 1) image = [app.globalData.iurl + image[0]];
            else if (s == 2) image = [app.globalData.iurl + image[0], app.globalData.iurl + image[1]];
            else image = [app.globalData.iurl + image[0], app.globalData.iurl + image[1], app.globalData.iurl + image[2]];
            that.setData({
              imgurls: image
            })
          },
          fail: function (res) {
            console.log('fail')
          },

        })
        //判断是否可以抽奖
        var state = 0;
        wx.request({
          url: app.globalData.url + 'checkLottery',
          data: {
            'userid': userid,
            'id': awardid
          },
          method: 'GET',
          success: function (res) {
            console.log(res)
            state = res.data.state;
            that.setData({
              state: state,
            })
            if (state == 1)
              that.setData({
                could_join: false,
              })
          },
          fail: function (res) {
            console.log('fail');
          },
        })
      }

      else clearInterval(timer);
    }, 2500);


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
      statusHeight: statusHeight,
      navHeight: navHeight
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.animation = wx.createAnimation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      auth: app.globalData.auth
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

    var awardid = this.data.awardid;
    var userid = app.globalData.userid;
    var that = this;
    console.log(awardid, userid);
    return;

    wx: wx.request({
      url: app.globalData.url + 'getUserAwardState',
      data: {
        'awardid': awardid,
        "userid": userid
      },
      method: 'GET',
      success: function (res) {
        var join = false;
        var f3 = res.data.user_data;
        var f1 = res.data.award_data;
        var f2 = res.data.interpret;
        var f4 = res.data.userWithaward;
        console.log(f1, f2, f3, f4)

        var jpname = [f1[0].name1, f1[0].name2, f1[0].name3];
        var jpnum = [f1[0].num1, f1[0].num2, f1[0].num3];
        var images = [f1[0].pic1, f1[0].pic2, f1[0].pic3];
        var date = f1[0].time * 1000;
        date = util.tsFormatTime(date, 'Y/M/D h:m:s');
        that.setData({
          index: f1[0].way, //开奖方式
          jpname: jpname,
          jpnum: jpnum,
          date: date, //开奖时间
          kpnum: f1[0].maxnum, //开奖人数
          s: f1[0].number, //奖品个数
          jpms: f1[0].information,
          imgurls: images,
          status: f1[0].status, //抽奖状态
          name: f3.nickname,
          pic: f3.picture,
          level: f4[0].level
        })
        var s = f1[0].number;
        var image = that.data.imgurls;
        if (s == 1) image = [app.globalData.iurl + image[0]];
        else if (s == 2) image = [app.globalData.iurl + image[0], app.globalData.iurl + image[1]];
        else image = [app.globalData.iurl + image[0], app.globalData.iurl + image[1], app.globalData.iurl + image[2]];
        that.setData({
          imgurls: image
        })
      },
      fail: function (res) {
        console.log('fail')
      },

    })

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
    var that = this;
    console.log('data:', that.data)
    return {
      // title: '转发',
      path: '/pages/index/index',
      //path: '/pages/awardconfirm/awardconfirm?awardid=' + that.data.awardid,
      title: that.data.name + '邀你参与[' + that.data.data_lottery.name1 + '等]抽奖！',
      imageUrl: that.data.imgurls[0],

      success: function (res) {
        wx.showToast({
          title: '已转发',
        })
      }

    }
  },
  // 返回事件

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
      statusHeight: statusHeight,
      navHeight: navHeight
    })
  },


  setStyle: function () {
    var that = this,
      containerStyle, textStyle, iconStyle;
    containerStyle = [
      'background:' + that.data.background
    ].join(';');
    textStyle = [
      'color:' + that.data.color,
      'font-size:' + that.data.fontSize + 'px'
    ].join(';');
    iconStyle = [
      'width: ' + that.data.iconWidth + 'px',
      'height: ' + that.data.iconHeight + 'px'
    ].join(';');
    that.setData({
      containerStyle: containerStyle,
      textStyle: textStyle,
      iconStyle: iconStyle
    })
  },

  attached: function () {
    var that = this;
    that.setNavSize();
    that.setStyle();
  },

  join: function () {
    var that = this
    var state = that.data.state;
    console.log(state);

    wx.request({
      url: app.globalData.url + 'intoLottery',
      data: {
        'userid': app.globalData.userid,
        'id': that.data.awardid
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        wx.showModal({
          title: res.data.interpret,
          content: '',
        })
        that.setData({
          could_join: true
        })
        wx.startPullDownRefresh()
      },
      fail: function (res) {
        console.log('fail')
      },
    })


  },

  handopen: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '你确定你要开奖了？',
      confirmText: '确认开奖',
      cancelText: '我再看看',
      confirmColor: 'darkred',
      cancelColor: 'darkgray',
      success(res) {
        if (res.confirm) {

          wx.request({
            url: app.globalData.url + 'openlottery',
            data: {
              'awardid': that.data.awardid
            },
            method: 'GET',
            success: function (res) {

              console.log('lalalalalalal' + res)
              wx.startPullDownRefresh();
              setTimeout(function () {




                wx.stopPullDownRefresh();


              }, 800)
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  go_to_lotteryCreate: function () {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  share_lottery: function (res) {
    if (this.data.awardid) {
      if (res.from === 'button') {
      }
      return {
        title: '转发',
        path: '/pages/awardconfirm/awardconfirm?awardid=' + this.data.awardid,
        success: function (res) {
          console.log('成功', res)
        }
      }
    } else wx.showModal({
      title: '请稍后重试',
      content: '网络出现异常请稍后重试',
    })
  },


  go_to_advice: function () {
    wx.navigateTo({
      url: '/pages/advice/advice',
    })
  },

  oook:function(){
    wx.navigateTo({
      url: '/pages/look_lucky_user/look_lucky_user?awardid='+this.data.awardid,
    })
  }

})