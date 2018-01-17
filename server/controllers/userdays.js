
const { mysql } = require('../qcloud')
const moment = require('moment')
const convert = require('../tools/dataconvert')
module.exports = async ctx => {
  if (ctx.state.$wxInfo.loginState === 1) {
    const { openid } = ctx.query;
    const data = await mysql('wx_dayevent').where({ 'isactived': 1, 'wxuserid': openid })
    for (var i = 0; i < data.length; i++) {
      data[i] = convert.dataconvert(data[i]); 
    }
    ctx.state.data = data
  } else {
    ctx.state.code = -1
  }

}
