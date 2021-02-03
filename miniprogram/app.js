//app.js
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {
      auth: false,
      participate: [],
      userInfo: {
        avatarUrl: 'https://746f-tool-4go3up8m7999bdcf-1304710891.tcb.qcloud.la/img2020121901.png?sign=c159503706c9f3c8ce9de7eb72d7f59d&t=1610022686',
        nickName: '未授权'
      }
    }

   var that=this;

   var information=wx.getStorageSync('information');
    if(information){
      this.globalData.userid=information.userid;
      this.globalData.nickname=information.nickname;
      this.globalData.avatarUrl=information.avatarUrl;
      this.globalData.status=information.status;
    }
  },

  globalData: {
    auth: false,
    participate: [],

    iurl:'https://abc.com/uploads/',
    url: 'https://abc.com/lottery/',
    url_uploads: 'https://abc.com/uploads/',
    top_height:0,
 
    userid: '',
    nickname: '',
    avatarUrl: '',
    status:'',
    gender:'',

    height: '',

    country: '',
    city: '',
    province: '',
    language: "zh_CN",
    awardprofile:'请输入本次抽奖活动的说明',
    awardprofile1:'',
    awardprofile2: ''
  }
})