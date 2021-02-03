// 云函数入口文件
const cloud = require('wx-server-sdk')
const dateUtils = require('date-utils')
const _ = require('underscore')

process.env.TZ ='Asia/Shanghai'
cloud.init({ env: process.env.Env })

const db = cloud.database();

const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {


  let dt = new Date();
  // let dt = new Date().addHours(8);
  let time = dt.toFormat("YYYY-MM-DD HH24:MI:SS");

  console.log('time',time);

  let today = dt.toFormat("YYYY-MM-DD");

  let res = await db.collection('lottery')
  .aggregate()
  .match({
    status: 1,
    state: 0
  })
  .limit(1000)
  .end()

  console.log(res);

  let items = res.list;
  items.forEach(async (element) => {
    console.log(element);

    let _id = element['_id'];
    let num1 = element['num1'];

    let res2 = await db.collection('record')
    .aggregate()
    .match({
      lottery: _id
    })
    .limit(1000)
    .end()
    
    let items = _.shuffle(res2.list);

    let arr = items.slice(0,num1);
    console.log('抽中名额');
    console.log(arr);

    arr.forEach((item, index)=>{

      let _openid = item['_openid'];
      let userInfo = item['userInfo'];

      db.collection("prize")
      .add({
        data: {
          lottery: _id,
          _openid: _openid,
          userInfo: userInfo,
          time: time
        }
      })
      .then(res=>{
        console.log(res);
  
      })
      .catch(err=>{
        console.log(err);
      });
    })

    db.collection('lottery').doc(_id).update({
      // data 字段表示需新增的 JSON 数据
      data: {
        state: 1
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