// components/profile/profile.js
const app = getApp()
var common = require("../../common/common.js")
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


    avatarUrl: '',
    nickname: '',
    all_lottery: [],
    create_lottery: [],
    bingo_lottery_record: [],
    all_lottery_length: 0,
    create_lottery_length: 0,
    bingo_lottery_record_length: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //心愿--查看
    aspiration: function() {
      wx.navigateTo({
        url: '/pages/aspiration/aspiration',
      })
    },


    lottery_view_1: function() {
      wx.navigateTo({
        url: '/pages/lottery_view_1/lottery_view_1',
      })
    },

    lottery_view_2: function() {
      
      wx.navigateTo({
        url: '/pages/lottery_view_2/lottery_view_2',
      })
    },

    lottery_view_3: function() {
      wx.navigateTo({
        url: '/pages/lottery_view_3/lottery_view_3',
      })
    },


    go_to_remainder_money: function() {
      wx.navigateTo({
        url: '/pages/remainder_money/remainder_money',
      })
    },

    go_to_selfpage: function() {
      wx.navigateTo({
        url: '/pages/selfpage/selfpage',
      })
    },


    go_to_more: function() {
      wx.navigateTo({
        url: '/pages/more/more',
      })
    },


    common_question: function() {
      wx.navigateTo({
        url: '/pages/question/question',
      })
    },

    go_to_advice: function (e) {
      console.log(e)
      wx.navigateTo({
        url: '/pages/advice/advice',
      })
    },

    address: function () {
      wx.navigateTo({
        url: '/pages/address/address',
      })
      return;
      wx.chooseAddress({
        success(res) {
          var address=res;
          wx.login({
            success: res => {
              console.log("微信小程序用户登录：", res)
              wx.request({
                url: app.globalData.url + 'addresschange',
                data: {
                  'userid': app.globalData.userid,
                  'userName': address.userName,
                  'postalCode': address.postalCode,
                  'provinceName': address.provinceName,
                  'cityName': address.cityName,
                  'countyName': address.countyName,
                  'detailInfo': address.detailInfo,
                  'telNumber': address.telNumber,
                },
                success: (res) => {
                  console.log("地址添加成功");
                


                },
              })
            }
          })
          
          
        }

      })
      
    }

  },

  ready: function() {
    var that = this
    console.log("ready");
    console.log(app.globalData);
    this.setData({
      avatarUrl: app.globalData.userInfo.avatarUrl,
      nickname: app.globalData.userInfo.nickName,
      all_lottery_length: app.globalData.participate.length,
      create_lottery_length: app.globalData.create.length,
      bingo_lottery_record_length: app.globalData.prizes.length
    })





  },


 



})