
const { mysql } = require('../qcloud')
const moment = require('moment')
module.exports = async ctx => {
  if (ctx.state.$wxInfo.loginState === 1) {
    const data = await mysql('wx_classify').where({ 'isactived': 1 }).orderBy('orderindex', 'asc') 
    ctx.state.data = data
  } else {
    ctx.state.code = -1
  } 
}
