const db  = require('../tools/db')
module.exports = async (ctx, next) => {
  // 通过 Koa 中间件进行登录态校验之后
  // 登录信息会被存储到 ctx.state.$wxInfo
  // 具体查看：
  if (ctx.state.$wxInfo.loginState === 1) {
    // loginState 为 1，登录态校验成功
    const data = {
      wxuserid: ctx.state.$wxInfo.userinfo.openId,
      updatetime: '2017-12-30 12:12:12', 
      event:'test2', 
      isactived:'1',
      eventdate: '2017-12-30 12:12:12', 
      classifyid:'1',
      styleImage:'image',
      createtime: '2017-12-30 12:12:12'
    };
    //db.addDayEvent(data);
    
    
    ctx.state.data = ctx.state.$wxInfo.userinfo
  } else {
    ctx.state.code = -1
  }
}
