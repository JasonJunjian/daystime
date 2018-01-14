
const { mysql } = require('../qcloud')
const moment = require('moment')
module.exports = async ctx => {
  const data = await mysql('wx_userstyle').where({ 'wxuserid': 'sys' }).orderBy('sort', 'asc')
  ctx.state.data = data;
}
