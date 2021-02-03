const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event) => {
  try {
    let result = '';
    result =  await cloud.openapi.security.msgSecCheck({
      content: event.content
    });
    return {
      result
    }
  } catch (error) {
    return {
      error
    }
  }
}