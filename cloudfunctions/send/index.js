const cloud = require('wx-server-sdk')
const dateUtils = require('date-utils')

cloud.init({ 
  env: 'lucky-8gbfk03d88f11f2a' 
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {


  let res = await db.collection('lottery')
  .aggregate()
  .match({
    status: 1,
    state: 1,
    send: 0
  })
  .limit(1000)
  .end()

  // console.log(res);

  let items = res.list;
  items.forEach(async (element) => {
    let lottery = element['_id'];
    let dt = new Date(element['time']);
    let time = dt.toFormat("YYYY-MM-DD HH24:MI:SS");

   
    let title = element['name1'];

    let res2 = await db.collection('record')
    .aggregate()
    .match({
      lottery: lottery
    })
    .limit(2000)
    .end()

    let lists = res2.list;
    lists.forEach(async (item) => {

      
      let openid = item['_openid'];
      let awardid = item['lottery'];
      
      try {
        console.log({
          touser: openid,
          page: '/pages/welcome/welcome?awardid='+awardid,
          data: {
            thing1: {
              value: title
            },
            time3: {
              value: time
            },
            thing5: {
              value: '请进入小程序查询'
            }
          },
          templateId: 'VL3nhD_RbNdgR-M-FKMKffvCi8CORUG4JlYRtUQhfYc'
        });
        const result = await cloud.openapi.subscribeMessage.send({
          touser: openid,
          page: '/pages/welcome/welcome?awardid='+awardid,
          data: {
            thing1: {
              value: title
            },
            time3: {
              value: time
            },
            thing5: {
              value: '请进入小程序查询'
            }
          },
          templateId: 'qqLUYK8HQTduqweQsZUDpdgYqrpp5UsPCetemJFvYys'
        })
        console.log(result)
      } catch (err) {
        console.log(err)
      }
    })
    
    db.collection('lottery').doc(lottery).update({
      // data 字段表示需新增的 JSON 数据
      data: {
        send: 1
      }
    })
    .then(res => {
      console.log(res)
    })
    .catch(err=>{
      console.log(err);
    })

  });

  


}