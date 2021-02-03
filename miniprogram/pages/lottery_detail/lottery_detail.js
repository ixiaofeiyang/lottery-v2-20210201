// pages/lottery_detail/lottery_detail.js

const app = getApp()
var util = require('../../utils/util.js')
var common = require("../../common/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    text: "如果你想安安静静抽奖，期待成为幸运儿 — — 这里就是你需要的大型福利池。\n\n",
    text1: "",
    could_join: true,
    scrollHeight: 0,
    data_lottery: [],
    pic: [],
    cd: 0,
    canyu:[],
    state:0,
    awardid:'',


    



  },

  /**
   * 生命周期函数--监听页面加载
   */
  whole: function () {
    wx.navigateTo({
      url: '/pages/chakanrenshu/chakanrenshu?awardid=' + this.data.awardid,
    })
  },
  async initWatch() {
      console.warn(`开始监听按人头开奖逻辑`, )
      const db = wx.cloud.database();
      this.messageListener = db.collection('lottery').where({
        way: 2,
        status: 0
      }).watch({
        onChange: this.onRealtimeMessageSnapshot.bind(this),
        onError: e => {
          console.log(e);
        },
      })
    },
    log: function(snapshot){
      const db = wx.cloud.database();
        const _ = db.command;
        db.collection('logs').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            lottery: this.data.awardid,
            snapshot,
            time: new Date()
          }
        })
        .then(res => {

          console.log(res)
          console.log('[数据库] [查询记录] 成功: ', res);

        
        })
        .catch((err)=>{
          console.log(err)
        })
    },
    update: function(doc){
      let that = this;
      // 调用云函数
      wx.cloud.callFunction({
        name: 'update',
        data: {
          lottery: doc._id
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
    /**
     * 2021-01-15 该接口被优化
     * @param {*} doc 
     */
    update2: function(doc){
        const db = wx.cloud.database();
        const _ = db.command;
        db.collection('lottery').doc(doc._id).update({
          // data 字段表示需新增的 JSON 数据
          data: {
            status: 1
          }
        })
        .then(res => {

          console.log(res)
          console.log('[数据库] [查询记录] 成功: ', res);

        
        })
        .catch((err)=>{
          console.log(err)
        })
    },
    onRealtimeMessageSnapshot(snapshot) {
      let that = this;

      console.warn(`收到消息`, snapshot)

      if (snapshot.type === 'init') {
        
      } else {
        this.log(snapshot);
        for (const docChange of snapshot.docChanges) {
          

          switch (docChange.queueType) {
            case 'enqueue': 
              console.log('docChange.doc',docChange.doc);
              break;
            case 'update':
              console.log('docChange.doc',docChange.doc)
              let updatedFields = docChange.updatedFields;
              let doc = docChange.doc;
              console.log(Object.keys(updatedFields));
              Object.keys(updatedFields).forEach(field => { 
                // 遍历被修改的集合字段，做遍历执行
                if(doc.way == 2 && field == 'total' && doc.total == doc.num){
                  that.update(doc);
                }
              })

              
              break;
            }
          }
        }
       
  },
  onLoad: async function(options) {
    console.log('app.globalData');
    console.log(app.globalData);
    this.initWatch();
    let that = this
    // 获取到屏幕的宽高等信息
    wx: wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      }
    })


    // let scrollHeight = wx.getSystemInfoSync().windowHeight;

    this.setData({
      height: app.globalData.top_height,
      //   scrollHeight: scrollHeight + app.globalData.top_height
    })
    console.log(options.id)
   
    var awardid=options.id;
    let could_join = this.data.could_join;
    if(app.globalData.participate.indexOf(awardid) != -1){
      could_join = false;
    }
    that.setData({
      source: options.source || 'home',
      awardid:awardid,
      could_join
    },()=>{
      this.onQuery();
      this.onQueryRecord();
    })
    return;
    var userid=app.globalData.userid;

    
    
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
        console.log(state)
        if (state == 1){
          that.setData({
            could_join: true,
          })}
          else {
          that.setData({
            could_join: false,
          })
          }
      },
      fail: function (res) {
        console.log('fail');
      },
    })

    wx.request({
      url: app.globalData.url + 'getAwardPeople',
      data: {
        'id': awardid
      },
      method: 'GET',
      success: function (res) {
        var cd = [];
        for (var i = 0; i < res.data.data.length; i++) {
          cd[i] = res.data.data[i].user__picture
        }
        //先默认为7
        that.setData({
          canyu: cd,
          cd: cd.length
        })
      },
      fail: function (res) {
        console.log('fail')
      },
    })

    wx.request({
      url: app.globalData.url + 'intoAward',
      data: {
        id: options.id
      },
      success: function(res) {
        console.log(res)
        var data = res.data.data[0]
        var pic_data = []

        if (data.pic1 != '') {
          data.pic1 = app.globalData.url_uploads + data.pic1
          pic_data.push(data.pic1)
        }
        if (data.pic2 != '') {
          data.pic2 = app.globalData.url_uploads + data.pic2
          pic_data.push(data.pic2)
        }
        if (data.pic3 != '') {
          data.pic3 = app.globalData.url_uploads + data.pic3
          pic_data.push(data.pic3)
        }

        data.time = util.tsFormatTime(data.time * 1000, 'Y-M-D h:m:s')
        that.setData({
          pic: pic_data,
          data_lottery: data,
        })
      }
    })





  },
  onQueryRecord: function(){
    const db = wx.cloud.database()
    db.collection('record')
    .where({
      lottery:this.data.awardid,
    })
    .orderBy('time', 'desc')
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
        cd: lottery.total
      });
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onGetTime();
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
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {



    // let users = wx.getStorageSync('user');

    var that = this;

    return {
      // title: '转发',
      path: '/pages/welcome/welcome?mode=2&awardid=' + that.data.awardid,
      //path: '/pages/awardconfirm/awardconfirm?awardid=' + that.data.data_lottery.id,
      title: that.data.data_lottery.wechat_name+'发起了抽奖【'+that.data.data_lottery.name1 + '等你来抽】',
      imageUrl: that.data.data_lottery.pic1,

      success: function(res) {
        wx.showToast({
          title: '已转发',
        })
      }

    }


  },

  updateTotal: function(){

    const db = wx.cloud.database()

    const _ = db.command
    db.collection('lottery').doc(this.data.awardid).update({
      data: {
        // 表示指示数据库将字段自增 10
        total: _.inc(1)
      }
    })
    .then(res=>{
      console.log(res)
    })
    .catch(err=>{
      console.log(err);
    })
  },
  join: function() {

    if(!this.data.could_join){
      return;
    }

    if(app.globalData.auth == 0){
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
      return;
    }

    if(this.do) return;
    this.do = true;


    let that = this;
    wx.requestSubscribeMessage({
        tmplIds: [ "qqLUYK8HQTduqweQsZUDpdgYqrpp5UsPCetemJFvYys" ],
        success: function(e) {
          that.addRecord();
            
        },
        fail: function(e) {
            console.log("error11", e);
            that.addRecord();
        }
    });

    
    return;
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
      },
      fail: function (res) {
        console.log('fail')
      },
    })

  },
  addRecord: function(){
    var that = this;
    const db = wx.cloud.database();
    db.collection('record').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        userInfo: app.globalData.userInfo,
        lottery: this.data.awardid,
        send: 0,
        time: this.data.time
      }
    })
    .then(res => {
      console.log(res)
      console.log('[数据库] [查询记录] 成功: ', res);
      wx.showModal({
        title: '参与成功',
        showCancel: false,
        content: '',
      })
      let canyu = this.data.canyu;
      canyu.unshift(app.globalData.userInfo.avatarUrl);
      this.setData({
        cd: this.data.cd + 1,
        canyu: canyu,
        could_join: false
      },()=>{
        console.log('canyu', this.data.canyu)
        this.updateTotal();
        this.do = false;
      })

    })
    .catch((err)=>{
      console.log(err)
     
    })
  },


  scrolltolower: function(e) {
    console.log('??:', e)

  },

  // scrolltolower:

  lower: function(e) {

    console.log(e)

  },
  // onPageScroll: function (e) {
  //   console.log(e)
  // },


  // 滚动条滚到顶部的时候触发
  upper: function(e) {
    console.log(e)
  },
  // 滚动条滚到底部的时候触发
  lower: function(e) {
    console.log(e)
  },
  // 滚动条滚动后触发
  scroll: function(e) {
    console.log(e)
  },
  // 点击按钮切换到下一个view
  tap: function(e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  //通过设置滚动条位置实现画面滚动
  tapMove: function(e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },


  lower: function(e) {
    console.log(e)
    var animation = wx.createAnimation({
      duration: 720,
      timingFunction: 'linear',
      delay: 0
    });
    animation.opacity(1).translate(0, -25).step()
    this.setData({
      show_time: animation.export()
    })
  },

  copy_count: function() {
    var that = this
    wx.setClipboardData({　　　　　　
      data: that.data.data_lottery.wechat_inform,
      success: function(res) {　　　　　　　　
        wx.getClipboardData({　　　　　　　　　　
          success: function(res) {　　　　　　　　　　　　
            wx.showToast({　　　　　　　　　　　　　　
              title: '复制成功'　　　　　　　　　　　　
            })　　　　　　　　　　
          }　　　　　　　　
        })　　　　　　
      }　　　　
    })
  },


  toHome:function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  go_to_more:function(){
    wx.redirectTo({
      url: '/pages/index/index',
    })
  }

})