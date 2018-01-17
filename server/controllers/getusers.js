
const { mysql } = require('../qcloud')
module.exports = async ctx => {
  if (ctx.state.$wxInfo.loginState === 1) {
    const { index, size } = ctx.query;
    const data = await mysql('cSessionInfo').orderBy('create_time', 'desc').select('user_info').limit(size).offset(index * size)
    ctx.state.data = data;
  } else {
    ctx.state.code = -1
  } 
}
