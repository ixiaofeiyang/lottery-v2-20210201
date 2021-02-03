const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    a:false,
    name:'',
    pic:'',
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
    could_change:true,
    share_flag:false,
    cd:7,
    cd1:0,
    canyu: ["/images/icn-zu@3x.png", 
      "/images/icn-zu@3x.png", 
      "/images/icn-zu@3x.png", 
      "/images/icn-zu@3x.png", 
      "/images/icn-zu@3x.png", 
      "/images/icn-zu@3x.png", 
      "/images/icn-zu@3x.png", 
    
     ],
    state:'',//个人对于奖项的状态
    awardid:'',
    imgurls:[],
    jpms:'',
    index: 1,//抽奖方式
    jpname: '',
    jpnum: 0,
    animation:'',
    date: '',//日期
    s:1,
    status: 0,
    navHeight: 0,
    level:0,//奖项状态
    kpnum:0,//开奖人数||最多抽奖人数
    into_number:0,    //参与抽奖人数

      
          
  },
  whole: function () {
    wx.navigateTo({
      url: '/pages/chakanrenshu/chakanrenshu?awardid=' + this.data.awardid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight)
        that.setData({
          height_screen: res.windowHeight
        })
      }
    })
    this.setNavSize()

    this.setData({
      top_height: app.globalData.top_height
    })
    this.attached()
    wx.hideShareMenu();

    var jpname=options.jpname;
    var jpnum= options.jpnum;
    var images = options.jmages;
    images=images.split(",");
    jpname=jpname.split(",");
    jpnum=jpnum.split(",");

    var s = options.s;
    console.log(s);
    console.log(images);
    if(s==1)images=[images[0]];
    else if(s==2)images=[images[0],images[1]];
    else images=[images[0],images[1],images[2]];
    console.log(images);
    this.setData({
      index:options.index,
      jpname:jpname,
      jpnum:jpnum,
      date:options.date,
      kpnum:options.kpnum,
      s:options.s,
      jpms:options.jpms,
      imgurls:images,
      awardid:options.awardid
    })

    console.log(this.data.jpname)
    console.log(this.data.awardid)
    console.log(images)
    var that=this

    wx.request({
      url: app.globalData.url + 'getAwardPeople',
      data: {
        'id': that.data.awardid
      },
      method: 'GET',
      success: function (res) {
       console.log(res.data)
        var cd=[];
        for (var i = 0; i < res.data.data.length;i++){
          cd[i] = res.data.data[i].user__picture
        }
        
        that.setData({
          canyu: cd,
          cd1:cd.length
        })
        if (cd.length<=7)
        that.setData({
          cd: cd.length
        })
        else that.setData({
          cd: 7
        })
        console.log(that.data.canyu)
      },
      fail: function (res) {
        console.log('fail')
      },
    })
    // this.lower()//动画
  },
  handopen: function () {
    var that = this;
    
    if (that.data.into_number == 0) wx.showToast({
      title: '没有人参与',
      icon: "loading"
    })
    else
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
              wx.navigateTo({
                url: '/pages/awardconfirm/awardconfirm?awardid=' + that.data.awardid
              })
              console.log(res)
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
    this.animation = wx.createAnimation();
    this.setData({
      name: app.globalData.nickname,
      pic: app.globalData.avatarUrl,
    })
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
    var that = this;
    console.log('data:', that.data)
    return {
      // title: '转发',
      path: '/pages/awardconfirm/awardconfirm?awardid=' + that.data.awardid,
      title: that.data.name + '发起了抽奖,' + that.data.jpname[0] + '等你来抽！',
      imageUrl: that.data.imgurls[0],

      success: function (res) {
        wx.showToast({
          title: '已转发',
        })
      }

    }
  },
  // 返回事件
  back: function () {
wx.navigateTo({
  url: '/pages/index/index',
})

  },


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
    if (that.data.could_join)
    wx.showModal({
      title: '提示',
      content: '有人参与抽奖后，你将无法再编辑抽奖信息，是否确认参与该抽奖？',
      confirmText: '确认参与',
      cancelText: '我再看看',
      confirmColor: 'darkred',
      cancelColor: 'darkgray',
      success(res) {
        if (res.confirm) {
     
          console.log(that.data.awardid)
          wx:wx.request({
            url: app.globalData.url + 'getAwardPeople',
            data: {
              id: that.data.awardid
            },
            success: function (re) {
              console.log(re.data)
              that.setData({
                could_change:false
              })

      
            }
          })
     

         wx.request({
           url: app.globalData.url +'intoLottery',
           data:{
             'userid': app.globalData.userid,
             'id': that.data.awardid
           },
           method: 'GET',
           success:function(res){
             console.log(res.data)
                that.setData({
                  into_number:res.data.award_data[0].into_number,
                  state: res.data.state,
                  level: res.data.data[0].level
                })
             if (that.data.state == '1')
               that.setData({
                 could_join: false
               })
             if (that.data.into_number != 0&&that.data.index == 3){
               that.setData({
                 a:true
               })
             }
           },
            fail: function (res) {
             console.log('fail')
           },
         })



          console.log('用户点击确定分享')
       

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }

    })
   

    
  },

  go_to_lotteryCreate:function(){
  wx.navigateBack({
    delt:0
  })
  },
  showmodels_tips:function(){
    var that = this
    if (that.data.state != 'success')
    wx.showModal({
      title: '提示',
      content: '有人参与抽奖后，你将无法再编辑抽奖信息，是否确认分享该抽奖？',
      confirmText:'确认分享',
      cancelText:'我再看看',
      confirmColor:'darkred',
      cancelColor:'darkgray',
      success(res) {
        if (res.confirm) {
        
          wx.request({
            url: app.globalData.url + 'intoShare',
            data: {
              'id': that.data.awardid
            },
            method: 'GET',
            success: function (res) {
              console.log(res.data.state)
              that.setData({
                state: res.data.state
              })
              if (that.data.state == 'success')
                that.setData({
                  could_change: false
                })
            }
          })
         
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  share_lottery:function(){
    this.setData({
      share_flag:true,
    })
    this.translate()

  },

  translate: function () {
    this.animation.translate(0, -110.5).step()
    this.setData({ animation: this.animation.export() })
  },



  cancel_share:function(){
    this.setData({
      share_flag: false,
    })
    this.translate_no()
  },

  translate_no: function () {
    this.animation.translate(0, 110.5).step()
    this.setData({ animation: this.animation.export() })
  },
  share1:function(res){
    if(this.data.awardid){
    if (res.from === 'button') {
    }
    return {
      title: '转发',
      path: '/pages/awardconfirm/awardconfirm?awardid='+this.data.awardid,
      success: function (res) {
        console.log('成功', res)
      }
    }
    }else wx.showModal({
      title: '请稍后重试',
      content: '网络出现异常请稍后重试',
    })
  },

  go_to_advice:function(){
    wx.navigateTo({
      url: '/pages/advice/advice',
    })
  }
})