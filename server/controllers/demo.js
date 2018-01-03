 
const { mysql } = require('../qcloud')
const moment = require('moment')
const convert = require('../tools/dataconvert')
module.exports = async ctx => {
  if (ctx.state.$wxInfo.loginState === 1) {
    const data = await mysql('wx_dayevent').where({ 'isactived': 1, 'wxuserid': ctx.state.$wxInfo.userinfo.openId})
    for (var i = 0; i < data.length; i++) { 
      data[i] = convert.dataconvert(data[i]);
      // var eventdate = moment(data[i].eventdate);
      // var nowdate = moment(Date.now());
      // data[i].eventdate = eventdate.format('YYYY.MM.DD');
      // data[i].createtime = moment(data[i].createtime).format('YYYY.MM.DD');
      // var days = eventdate.diff(nowdate, 'days',true);
      // days = parseInt(days) == days ? parseInt(days) : (days > 0 ? parseInt(days) + 1 : parseInt(days));
      // data[i].eventTip = days == 0 ? '就是今天' : (days > 0 ? '还有' : '已经');
      // data[i].days = Math.abs(days);
      // data[i].label = data[i].days > 1 ? 'DAYS' : 'DAY';
    }
    ctx.state.data = data
  } else {
    ctx.state.code = -1
  }
  
}
