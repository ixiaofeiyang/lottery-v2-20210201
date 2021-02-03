// 云函数入口文件
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  const wxContext = cloud.getWXContext()


  let lotteryId = event.lotteryId;

  try {
    return await db.collection('record')
    .where({
      lottery: event.lottery
    })
    .limit(100)
    .get()

  } catch(e) {
    console.error(e)
  }
}