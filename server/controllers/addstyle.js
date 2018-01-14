
const { mysql } = require('../qcloud')
const moment = require('moment')
const convert = require('../tools/dataconvert')
module.exports = async ctx => {  
  if (ctx.state.$wxInfo.loginState === 1) {  
    const { url } = ctx.query;
    var result = await mysql('wx_userstyle').insert({
      wxuserid: ctx.state.$wxInfo.userinfo.openId,
      updatetime: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      createtime: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      imageurl: url,
      opacity: 0,
      sort: 0
    });

    ctx.state.data = result;
  } else {
    ctx.state.code = -1
  }
}

