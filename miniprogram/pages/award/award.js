// pages/award/award.js
var util = require('../../utils/util.js')
const app = getApp()
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    t:'',
    monthDay:'',
    year:'',
    month:'',
    day:'',
    hour:'',
    minute:'',
//picker
    startDate: "请选择日期",
    multiArray: [['今天', '明天', '3-2', '3-3', '3-4', '3-5'], [0, 1, 2, 3, 4, 5, 6], [0, 10, 20]],
    multiIndex: [0, 0, 0],

    s:1,
    np:'奖品名称',
    datem:'',
    image1:['../../static/1.jpg'],
    image2: ['../../static/1.jpg'],
    image3: ['../../static/1.jpg'],
    z:'开奖时间',
    status: 0,
    navHeight: 0,
    showModalStatus: false,
    animationData: {},
    methord:'到达设定时间自动开奖',
    select:false,
    animationData: {},
    date1:[
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ],
    date2: [

      "",
0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,
      ""
    ],

    date3: [
      "", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, ""
    ],
    // idate:0,
    // ihour:0,
    // imin:0,
    // dindex:0,
    color:'rgba(80,80,80,0.6)',
//数据统计
   awardid:'',
   file1: 'https://6c6f-lottery-8g671615349097af-1304754004.tcb.qcloud.la/default-prize.jpg?sign=afef1c8543dcf08a35bd87896cc17a64&t=1610553075',
    image1: ['/images/default-prize@3x.jpg'],
    image2: ['/images/default-prize@3x.jpg'],
    image3: ['/images/default-prize@3x.jpg'],
    title:1,//抽奖编号
    jpname:["","",""],
    jpnum:["","",""],
    index: 1,//开奖条件三个
    jpms:'',//奖品描述
    //monthDay + " " + hours + ":" + minute;
    startDate: "请选择日期",
    s: 1,//开奖个数
    //index=2||index=3
    kpnum:0,//开奖人数||最多抽奖人数
  },
  add:function(){
    var s=this.data.s;
    s++;
    if(s<=3){
      this.setData({
        s:s,
        np:'一等奖名称'
      })
    }
  },
  cancel:function(){
    var s = this.data.s;
    s--;
    if (s >= 0) {
      this.setData({
        s: s,
      })
    }
    if (s == 1) {
      this.setData({
        np:'奖品名称'
      })
    }
  }
  ,
  //上传图片
  uploadDIY(filePaths, successUp, failUp, i, length,awardid) {
    console.log("保存图片")
    console.log(filePaths)
    console.log(filePaths[0])
    wx.uploadFile({
      url: app.globalData.url+'savepic',
      filePath: filePaths[i][0],
      name: 'file',
      formData: {
        'awardid': awardid,
        'i': i,
      },
      success: (resp) => {
        successUp++;
      },
      fail: (res) => {
        failUp++;
      },
      complete: () => {
        i++;
        if (i == length) {
          // wx.showToast('总共' + successUp + '张上传成功,' + failUp + '张上传失败！');
        }
        else {  //递归调用uploadDIY函数
          this.uploadDIY(filePaths, successUp, failUp, i, length,awardid);
        }
      },
    });
  },
  //发起抽奖
  start:function(){
    var jpms=this.data.jpms;
    if(jpms=='请输入本次抽奖活动的说明')this.setData({jpms:''})
    var images=[this.data.image1,this.data.image2,this.data.image3]
    var s=this.data.s;
    var that=this;
    if(s==1){
      var si=this.data.jpname;
      var s0=['','',''];
      s0[0]=si[0];
      this.setData({
        jpname:s0
      })
    }
    if (s == 2) {
      var si = this.data.jpname;
      var s0 = ['', '', ''];
      s0[0] = si[0];
      s0[1] = si[1];
      this.setData({
        jpname: s0
      })
    }
    var h = util.h(new Date());
    var m = util.m(new Date());
    var right=true
       //check
       
       if(this.data.jpname[0]==''||this.data.jpnum[0]==''){
           right=false;
           wx.showModal({
             title: '请输入必须信息',
             content: '未输入奖品信息',
       })
       }else right=true

 if(right)
    if (this.data.s == 2 && (this.data.jpname[1] == '' || this.data.jpnum[1] == '')){
      right = false;
      wx.showModal({
        title: '请输入必须信息',
        content: '未输入奖品信息',
      })
    }else right=true

    if (right)
      if (this.data.s == 3 && (this.data.jpname[0] == '' || this.data.jpnum[0] == '' || this.data.jpname[1] == '' || this.data.jpnum[1] == '' || this.data.jpname[2] == '' || this.data.jpnum[2] == '')) {
        right = false;
        wx.showModal({
          title: '请输入必须信息',
          content: '未输入奖品信息',
        })
      } else right = true

       if(right)
       if(this.data.index==1||this.data.index==3){
         //monthDay + " " + hours + ":" + minute;
         //选择1，3时间不对
         if (this.data.startDate == '请选择日期') {
           wx.showModal({
             title: '请选择时间',
             content: '未选择时间',
           })
           right = false
         } else right=true
         var min = this.data.minute;
         
         m=parseInt(m)
         var hour = parseInt(this.data.hour);
         h = parseInt(h);
         console.log(this.data.t)
         if(right)
           if(this.data.t=='今天'){
             console.log(h, m)
             console.log(hour, min)
             if(hour < h || (hour == h && min < m)){
               right = false
           wx.showModal({
           title: '时间信息有误',
           content: '请仔细检查开奖信息',
         })
             }
           }
       } else right=true;
       //选择2 3 开奖时间不对
       if(right)
         if (this.data.index == 2 || this.data.index == 3) {
           if (!this.data.kpnum){
           wx.showModal({
             title: '开奖信息有误',
             content: '请仔细检查开奖信息',
           })
             right = false
           }
         } else right=true;
         //这就对了
         var that=this
         if(right){
         wx.showModal({
           title: '确定开奖',
           content: '请确定这么开奖',
          //  & jpnum=this.data.jpnum & date=this.data.date & hour=this.data.hour & min=this.data.min & kpnum=this.data.kpnum
           success(res){
             if(res.confirm){
               var year = that.data.year
               var m = that.data.month
               var d = that.data.day
               m = parseInt(m)
               d = parseInt(d)
               var hour = that.data.hour
               var min = that.data.minute
               var monday = that.data.monthDay
               console.log(year, m, d, hour, min, monday)
               var sec = 0;
               var da = year + '/' + m + '/' + d + ' ' + hour + ':' + min + ':' + sec;

               app.globalData.time = da;

               var timestamp = Math.round(new Date(da).getTime() / 1000)

               console.log(timestamp)
               console.log(timestamp)
               console.log(that.data.jpname)
               console.log(that.data.jpnum)
               console.log(that.data.index)
               console.log(that.data.jpms)
               console.log(timestamp)
               console.log(that.data.s)
               console.log(that.data.kpnum)
               console.log(images)

               //文本安全检测
                wx.cloud.callFunction({
                  name: "msgSecCheck",
                  data: {
                      content: JSON.stringify({
                        userInfo: app.globalData.userInfo,
                        way: that.data.index,
                        name1: that.data.jpname[0] || '',
                        num1: that.data.jpnum[0] || 1,
                        jpname: that.data.jpname,
                        jpnum: that.data.jpnum,
                        num: that.data.kpnum,
                        number: that.data.s,
                        pic1: that.data.file1,
                        wechat_inform: app.globalData.awardprofile1,
                        wechat_name: app.globalData.awardprofile2 || app.globalData.userInfo.nickName,
                        information: that.data.jpms || '你来便是晴天',
                        time: app.globalData.time,
                        createTime: that.data.time,
                        status: 0,//0-初始化；1-已结束
                        state: 0,//0-初始化；1-待开奖；2-已开奖
                        send: 0,//0-初始化；1-已推送
                        total: 0
                      })
                  }
                }).then((res) => {
                  wx.showLoading({
                    title: '处理中',
                  })

                  console.log('msgSecCheck =', res)
                  // 检测到文本错误时,做一些业务
                  if (res.result.error) {
                    // wx.showToast({ // 当内容违规时,做一些用户提示
                    //   title: '您输入的文本内容含有敏感内容,请重新输入',
                    // })
                    setTimeout(function () {
                      wx.hideLoading()
                    }, 2000)
                    
                    wx.showModal({
                      showCancel: false,
                      title: '提示',
                      confirmText: '我知道了',
                      content: '内容含有违法违规内容',
                      success (res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                      
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    }) 

                  }else{
                    that.addlottery();
                  }
                })

              
               return;
             wx:wx.request({
               url: app.globalData.url +'startaward',
               data: {
                 'userid': app.globalData.userid,
                 'number':that.data.s,//奖项个数
                 'jpname':that.data.jpname,
                 'jpnum':that.data.jpnum,
                 'way':that.data.index,
                 'time':timestamp,
                 'information':that.data.jpms,
                 'images':images,
                 'num': that.data.kpnum,
                 'wechat_inform': app.globalData.awardprofile1,
                 'wechat_name': app.globalData.awardprofile2,
               },
               method: 'GET',
               success: function(res){
                 that.setData({
                   awardid:res.data.awardid
                 })
                 that.uploadDIY(images,0,0,0,that.data.s,res.data.awardid);
                 console.log(that.data.awardid);
                 wx.navigateTo({
                   url: '/pages/lottery_create/lottery_create?index=' + that.data.index + '&jpname=' + that.data.jpname + '&jpnum=' + that.data.jpnum + '&date=' + that.data.startDate + '&kpnum=' + that.data.kpnum + '&s=' + that.data.s + '&jpms=' + that.data.jpms + '&jmages=' + images + '&awardid=' + that.data.awardid,
                 })
               },
               fail: function(res) {
                 console.log('fail')
               },

             })
           
              
             }
             else{
              // monthDay + " " + hours + ":" + minute;
               //console.log(that.data.startDate)
               var year = that.data.year
               var m = that.data.month
               var d = that.data.day
               m = parseInt(m)
               d = parseInt(d)
               var hour = that.data.hour
               var min = that.data.minute
               var monday = that.data.monthDay
               console.log(year, m, d, hour, min, monday)
               var sec = 0;
               var da = year + '/' + m + '/' + d + ' ' + hour + ':' + min + ':' + sec;
               console.log(da)
               var timestamp = Math.round(new Date(da).getTime() / 1000)
              //  var timestamp1 = Date.parse(new Date());
              //  console.log(timestamp1/1000)
             }
           }
         })
       }

  },
  addlottery: function(){
    let that = this;
    const db = wx.cloud.database();


    db.collection('lottery').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        userInfo: app.globalData.userInfo,
        way: parseInt(that.data.index),
        name1: that.data.jpname[0] || '',
        num1: that.data.jpnum[0] || 1,
        jpname: that.data.jpname,
        jpnum: that.data.jpnum,
        num: that.data.kpnum,
        number: that.data.s,
        pic1: that.data.file1,
        wechat_inform: app.globalData.awardprofile1,
        wechat_name: app.globalData.awardprofile2 || app.globalData.userInfo.nickName,
        information: this.data.jpms || '你来便是晴天',
        time: app.globalData.time,
        createTime: this.data.time,
        status: 0,//0-初始化；1-已结束
        state: 0,//0-初始化；1-待开奖；2-已开奖
        send: 0,//0-初始化；1-已推送
        total: 0
      }
    })
    .then(res => {
      console.log(res)
      console.log('[数据库] [查询记录] 成功: ', res);
      wx.reLaunch({
        url: '../index/index'
      })

    })
    .catch((err)=>{
      console.log(err)
     
    })
  },
  //奖品名字
  jpname:function(e){
    var that=this;
    var index=e.target.dataset.index;
    console.log(index);
    var jpname=this.data.jpname;
    jpname[index-1] = e.detail.value
    console.log(jpname)
     that.setData({
       jpname:jpname
     })
  },
  jpnum: function (e) {
    var index = e.target.dataset.index;
    var jpnum=this.data.jpnum;
    jpnum[index-1]=e.detail.value
    this.setData({
      jpnum: jpnum
    })
  },
  kpnum: function (e) {
    this.setData({
      kpnum: e.detail.value
    })
  },
  jpms: function () {
      var m=this.data.jpms;
      var color=this.data.color;
      wx.navigateTo({
        url: '../awardprofile/awardprofile',
      })
    this.setData({
      jpms: app.globalData.awardprofile
    })
  },
  select: function () {
        var that = this;
        // 鍒涘缓涓€涓ª鍔ㄧ敾瀹炰緥
         var animation = wx.createAnimation({
      // 鍔ㄧ敾鎸佺画鏃堕棿
              duration: 200,
              // 瀹氫箟鍔ㄧ敾鏁堟灉锛屽綋鍓嶆槸鍖€閫
              timingFunction: 'linear'
            })
      // 灏嗚¯ュ彉閲忚祴鍊肩粰褰撳墠鍔ㄧ敾
      that.animation = animation
        // 鍏堝湪y杞村亸绉伙紝鐒跺悗鐢╯tep()瀹屾垚涓€涓ª鍔ㄧ敾
        animation.translateY(-100).step()
        // 鐢╯etData鏀瑰彉褰撳墠鍔ㄧ敾
        that.setData({
      // 閫氳繃export()鏂规硶瀵煎嚭鏁版嵁
            animationData: animation.export(),
            select: !that.data.select
          })
     console.log(this.data.animationData)
        // 璁剧疆setTimeout鏉ユ敼鍙榶杞村亸绉婚噺锛屽疄鐜版湁鎰熻§夌殑婊戝姩
        setTimeout(function () {
            animation.translateY(0).step()
         that.setData({
 animationData: animation.export(),
                })
        }, 200)
  },
  datef: function(e) {
      var c = e.detail.current + 1;
      this.setData({
 date: this.data.date1[c],
 dindex:c
        })
  //   let time = util.formatTime(new Date());
  //   let date = util.getDates(1, time);
  //   var date1 = this.data.date
  //  date1 = date[0].time + ' ' + date[0].week
  //       if (this.data.date == date1) this.setData({
  // today: '今天'
  //         })
  //         else this.setData({
  // today: ""
  //           })
          },
  hourf: function (e) {
      var c = e.detail.current + 1;
      this.setData({
  hour: this.data.date2[c]
        })
  },
  minf: function (e) {
      var c = e.detail.current + 1;
      this.setData({
 min: this.data.date3[c]
        })
  },
  // 閫夋嫨棰滆壊--寮规¡ 
    showModal: function() {
    
          this.setData({
      // animationData: animation.export(),
              showModalStatus: true
            })

   },
  hideModal: function (e) {
    
      
        var index = e.currentTarget.dataset.index;
        if(!index)index=this.data.index
         this.setData({
         index: index
           })
       var m;
     if (index == 1) {
          m='到达设定时间自动开奖';
          this.setData({z:'开奖时间'})

           }
     else if (index == 2) {
         this.setData({
 select: false
           })
       m='3天内到达设定人数自动开奖';
       
         }
     else {
         this.setData({
 select: false
           })
       m='手动开奖';
       this.setData({ z: '抽奖截止时间' })
         }
     this.setData({
       //  animationData: animation.export(),
         showModalStatus: false,
         methord: m
  
       })
       // }.bind(this), 200)
     },
  setNavSize: function () {
    var that = this
      , sysinfo = wx.getSystemInfoSync()
      , statusHeight = sysinfo.statusBarHeight
      , isiOS = sysinfo.system.indexOf('iOS') > -1
      , navHeight;
    if (!isiOS) {
      navHeight = 48;
    } else {
      navHeight = 44;
    }
    that.setData({
      status: statusHeight,
      navHeight: navHeight
    })
    console.log(that.data.status, that.data.navHeight)
  },
  choosepic1: function () {
    var that = this;

    wx.chooseImage({
      count: 1,
      success:function(res){
        wx.showLoading({
          title: '处理中',
        })
        // wx.showToast({
        //   title: '正在上传...',
        //   icon: 'loading',
        //   mask: true,
        //   duration: 1000
        // }) 
        console.log(res);
        let tempFilePaths =res.tempFilePaths;
        let tempFiles = res.tempFiles;

        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],
          encoding: "base64",
          success: (res) => {
              

              wx.cloud.callFunction({
                  name: "imgSecCheck",
                  data: {
                      base64: res.data,
                  }
              }).then((res) => {
                  console.log('imgSecCheck =', res)
                  
                  setTimeout(function () {
                    wx.hideLoading()
                  }, 2000)

                  
                  if(res.result.result){
                    that.uploadFile(tempFiles[0]['path'])

                    var image = that.data.image1;
                    image.splice(0, 1);
                    that.setData({
                      image1: image
                    })
                    that.setData({
                      image1: that.data.image1.concat(tempFilePaths),
                    });
                  }

                  if(res.result.error){
                    wx.showModal({
                      showCancel: false,
                      title: '提示',
                      confirmText: '我知道了',
                      content: '内容含有违法违规内容',
                      success (res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                      
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    }) 
                    
                  }
              })
          }
        });

        


      }
    })
  },
  generate: function(){
    return util.formatTime2(new Date());
  },
  uploadFile: function(path){
    wx.showLoading({
      title: '上传中',
    })
    let ordernum = this.generate();
    let that = this;
    // 调用云函数
    wx.cloud.uploadFile({
      cloudPath: ordernum+'.png',
      filePath: path, // 文件路径
    }).then(res => {
      // get resource ID
      console.log(res)
      that.setData({
        file1: res.fileID
      },()=>{
        wx.hideLoading()
      })
      
    }).catch(error => {
      // handle error
    })
  },
  choosepic2: function () {
    var that = this;

    wx.chooseImage({
      count: 1,
      success: function (res) {
        // wx.showToast({
        //   title: '正在上传...',
        //   icon: 'loading',
        //   mask: true,
        //   duration: 1000
        // })
        var tempFilePaths = res.tempFilePaths;
  
        var image = that.data.image2;
        image.splice(0, 1);
        that.setData({
          image2: image
        })
        that.setData({
          image2: that.data.image2.concat(tempFilePaths),
        });

      }
    })
  },
  choosepic3: function () {
    var that = this;

    wx.chooseImage({
      count: 1,
      success: function (res) {
        // wx.showToast({
        //   title: '正在上传...',
        //   icon: 'loading',
        //   mask: true,
        //   duration: 1000
        // })
        var tempFilePaths = res.tempFilePaths;

        var image = that.data.image3;
        image.splice(0, 1);
        that.setData({
          image3: image
        })
        that.setData({
          image3: that.data.image3.concat(tempFilePaths),
        });
        
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.time = '2021-01-20 000:00:00'
    wx.switchTab({
      url: '../tip/tip',
    })

    this.setNavSize();
    console.log(this.data.status);
    console.log(this.data.navHeight);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
      //   let time = util.formatTime(new Date());
      //  let date = util.getDates(7, time);
      //   let temp_date1 = this.data.date1;
      //   console.log(date);
      //  for (var i = 0; i < 7; i++) {
      //      temp_date1[i + 1] = date[i].time + ' ' + date[i].week
      //      }
      //  var h = util.h(new Date());
      //  var m = util.m(new Date());
      //  this.setData({
      //      date1: temp_date1,
      //      date: temp_date1[1],
      //    datem: temp_date1[1],
      //      hour: h,
      //      min: m,
      //      ihour: h,
      //      imin: m - 1
      //    })
   },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onGetTime();
    this.setData({
      jpms: app.globalData.awardprofile
    })
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


  createLottery:function(){
    wx.navigateTo({
      url: '/pages/lottery_create/lottery_create',
    })
  },
  pickerTap: function () {

    date = new Date();



    var monthDay = ['今天', '明天'];

    var hours = [];

    var minute = [];



    currentHours = date.getHours();

    currentMinute = date.getMinutes();



    // 月-日

    for (var i = 2; i <= 28; i++) {

      var date1 = new Date(date);

      date1.setDate(date.getDate() + i);

      var md = (date1.getMonth() + 1) + "-" + date1.getDate();

      monthDay.push(md);

    }



    var data = {

      multiArray: this.data.multiArray,

      multiIndex: this.data.multiIndex

    };



    if (data.multiIndex[0] === 0) {

      if (data.multiIndex[1] === 0) {

        this.loadData(hours, minute);

      } else {

        this.loadMinute(hours, minute);

      }

    } else {

      this.loadHoursMinute(hours, minute);

    }



    data.multiArray[0] = monthDay;

    data.multiArray[1] = hours;

    data.multiArray[2] = minute;



    this.setData(data);

  },









  bindMultiPickerColumnChange: function (e) {

    date = new Date();



    var that = this;



    var monthDay = ['今天', '明天'];

    var hours = [];

    var minute = [];



    currentHours = date.getHours();

    currentMinute = date.getMinutes();



    var data = {

      multiArray: this.data.multiArray,

      multiIndex: this.data.multiIndex

    };

    // 把选择的对应值赋值给 multiIndex

    data.multiIndex[e.detail.column] = e.detail.value;



    // 然后再判断当前改变的是哪一列,如果是第1列改变

    if (e.detail.column === 0) {

      // 如果第一列滚动到第一行

      if (e.detail.value === 0) {



        that.loadData(hours, minute);



      } else {

        that.loadHoursMinute(hours, minute);

      }



      data.multiIndex[1] = 0;

      data.multiIndex[2] = 0;



      // 如果是第2列改变

    } else if (e.detail.column === 1) {



      // 如果第一列为今天

      if (data.multiIndex[0] === 0) {

        if (e.detail.value === 0) {

          that.loadData(hours, minute);

        } else {

          that.loadMinute(hours, minute);

        }

        // 第一列不为今天

      } else {

        that.loadHoursMinute(hours, minute);

      }

      data.multiIndex[2] = 0;



      // 如果是第3列改变

    } else {

      // 如果第一列为'今天'

      if (data.multiIndex[0] === 0) {



        // 如果第一列为 '今天'并且第二列为当前时间

        if (data.multiIndex[1] === 0) {

          that.loadData(hours, minute);

        } else {

          that.loadMinute(hours, minute);

        }

      } else {

        that.loadHoursMinute(hours, minute);

      }

    }

    data.multiArray[1] = hours;

    data.multiArray[2] = minute;

    this.setData(data);

  },



  loadData: function (hours, minute) {



    var minuteIndex;

    if (currentMinute > 0 && currentMinute <= 10) {

      minuteIndex = 10;

    } else if (currentMinute > 10 && currentMinute <= 20) {

      minuteIndex = 20;

    } else if (currentMinute > 20 && currentMinute <= 30) {

      minuteIndex = 30;

    } else if (currentMinute > 30 && currentMinute <= 40) {

      minuteIndex = 40;

    } else if (currentMinute > 40 && currentMinute <= 50) {

      minuteIndex = 50;

    } else {

      minuteIndex = 60;

    }



    if (minuteIndex == 60) {

      // 时

      for (var i = currentHours + 1; i < 24; i++) {

        hours.push(i);

      }

      // 分

      for (var i = 0; i < 60; i += 10) {

        minute.push(i);

      }

    } else {

      // 时

      for (var i = currentHours; i < 24; i++) {

        hours.push(i);

      }

      // 分

      for (var i = minuteIndex; i < 60; i += 10) {

        minute.push(i);

      }

    }

  },



  loadHoursMinute: function (hours, minute) {

    // 时

    for (var i = 0; i < 24; i++) {

      hours.push(i);

    }

    // 分

    for (var i = 0; i < 60; i += 10) {

      minute.push(i);

    }

  },



  loadMinute: function (hours, minute) {

    var minuteIndex;

    if (currentMinute > 0 && currentMinute <= 10) {

      minuteIndex = 10;

    } else if (currentMinute > 10 && currentMinute <= 20) {

      minuteIndex = 20;

    } else if (currentMinute > 20 && currentMinute <= 30) {

      minuteIndex = 30;

    } else if (currentMinute > 30 && currentMinute <= 40) {

      minuteIndex = 40;

    } else if (currentMinute > 40 && currentMinute <= 50) {

      minuteIndex = 50;

    } else {

      minuteIndex = 60;

    }



    if (minuteIndex == 60) {

      // 时

      for (var i = currentHours + 1; i < 24; i++) {

        hours.push(i);

      }

    } else {

      // 时

      for (var i = currentHours; i < 24; i++) {

        hours.push(i);

      }

    }

    // 分

    for (var i = 0; i < 60; i += 10) {

      minute.push(i);

    }

  },



  bindStartMultiPickerChange: function (e) {

    var that = this;

    var monthDay = that.data.multiArray[0][e.detail.value[0]];

    var hours = that.data.multiArray[1][e.detail.value[1]];

    var minute = that.data.multiArray[2][e.detail.value[2]];

    this.setData({
      t:monthDay
    })

    if (monthDay === "今天") {

      var month = date.getMonth() + 1;

      var day = date.getDate();
      that.setData({
        month:month,
        day:day
      })

      monthDay = month + "月" + day + "日";

    } else if (monthDay === "明天") {

      var date1 = new Date(date);

      date1.setDate(date.getDate() + 1);
      that.setData({
        month: date1.getMonth() + 1,
        day: date1.getDate()
      })

      monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";



    } else {

      var month = monthDay.split("-")[0]; // 返回月

      var day = monthDay.split("-")[1]; // 返回日
      
      that.setData({
        month: month,
        day: day
      })

      monthDay = month + "月" + day + "日";

    }


    var year=date.getFullYear();
    var startDate = monthDay + " " + hours + ":" + minute;
    
    
    that.setData({

      startDate: startDate,
      monthDay:monthDay,
      year:year,
     
      hour:hours,
      minute:minute
    })

  },

  input_id:function(){
    wx.navigateTo({
      url: '/pages/input_id/input_id',
    })
  }
})