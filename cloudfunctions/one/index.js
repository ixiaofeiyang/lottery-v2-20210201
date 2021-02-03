const cloud = require('wx-server-sdk')
const dateUtils = require('date-utils')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()

  let dt = new Date();
  // let dt = new Date().addHours(8);
  let time = dt.toFormat("YYYY-MM-DD HH24:MI:SS");

  let openid = wxContext.OPENID;


  try {
    console.log({
      thing2: {
        value: '例行测试'
      },
      date4: {
        value: time
      },
      thing5: {
        value: '请进入小程序查询'
      }
    });
    const result = await cloud.openapi.subscribeMessage.send({
      touser: openid,
      page: '/pages/welcome/welcome?awardid=000000',
      data: {
        thing2: {
          value: '例行测试'
        },
        date4: {
          value: time
        },
        thing5: {
          value: '请进入小程序查询'
        }
      },
      templateId: 'VL3nhD_RbNdgR-M-FKMKffvCi8CORUG4JlYRtUQhfYc'
    })
    console.log(result)
  } catch (err) {
    console.log(err)
  }


  


}