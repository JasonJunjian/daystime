
const { mysql } = require('../qcloud') 
module.exports = async ctx => {
  if (ctx.state.$wxInfo.loginState === 1) {
    const { id } = ctx.query;
    var result = await mysql('wx_dayevent').where({ 'id': id, 'wxuserid': ctx.state.$wxInfo.userinfo.openId }).update({ 'isactived':0}); 
    ctx.state.data = result;
  } else {
    ctx.state.code = -1
  } 
}
