const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    ask_answer:[
      {
        ask:'如何让发起的抽奖展示在首页？',
        answer: '在发起抽奖时，请您主动填写发起人信息，输入相关账号信息后，我们将智能地将您的抽奖信息展示在首页',
        look:false,
      }, 
      {
        ask: '如何删除已经发起的抽奖？',
        answer: '原则上来说，您在发起抽奖的起始时刻，可以选择分享该抽奖或不分享，若不分享该抽奖则他人不会得知您的此条发起，但发起无法通过用户自主删除，这也是为了防止恶意灌水，虚报抽奖活动考虑的，请你理解。若有删除需求，请联系商务人员。',
        look: false,
      },
      {
        ask: '中奖后如何领取奖品？',
        answer: '中奖后，发起人会被告知，并获取已经填写收件地址的中奖者地址信息，随后会将奖品以邮递、线下等方式送到中奖者手中。若中奖后7天内未填写收件地址，则将会和奖品失之交臂哟~~~！',
        look: false,
      },
      {
        ask: '中奖后一直未收到奖品怎么办？',
        answer: '请点击下方意见反馈，平台方24h无间断监控用户反馈，为您的愉快使用保驾护航。我们会联系奖品发起方为您及时补发',
        look: false,
      },
  
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      top_height: app.globalData.top_height
    })
    this.attached()
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },
  // 返回事件
  back: function () {
    wx.navigateBack({
      delta: 1
    })
    this.triggerEvent('back', {
      back: 1
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

  show_answer:function(res){
    console.log(res.currentTarget.dataset.index)
    var index = res.currentTarget.dataset.index
    let temp = this.data.ask_answer
    temp[index].look = !temp[index].look
    this.setData({
      ask_answer:temp
    })
  },


  go_to_advice:function(){
    wx.navigateTo({
      url: '/pages/advice/advice',
    })
  }
})