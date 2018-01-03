
const { mysql } = require('../qcloud')
const moment = require('moment')
module.exports = async ctx => {
  const data = await mysql('wx_classify').where({ 'isactived': 1 }).orderBy('orderindex', 'asc')
  ctx.state.data = data;
}
