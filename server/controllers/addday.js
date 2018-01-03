const { mysql } = require('../qcloud')
const moment = require('moment')
module.exports = async ctx => {
  if (ctx.state.$wxInfo.loginState === 1) {
    const { name, eventdate, istop, id } = ctx.query;
    var data;
    if (id == 0) {
      data = {
        wxuserid: ctx.state.$wxInfo.userinfo.openId,
        updatetime: moment(Date.now()).format('YYYY-MM-DD 00:00:00'),
        event: name,
        isactived: '1',
        eventdate: moment(eventdate).format('YYYY-MM-DD 00:00:00'),
        classifyid: '1',
        styleImage: 'image',
        istop: istop,
        createtime: moment(Date.now()).format('YYYY-MM-DD 00:00:00')
      };
      var temp = await mysql('wx_dayevent').insert(data);
      data.id = temp[0];
    } else {
      data = {
        updatetime: moment(Date.now()).format('YYYY-MM-DD 00:00:00'),
        event: name,
        eventdate: moment(eventdate).format('YYYY-MM-DD 00:00:00'),
        //classifyid: '1',
        //styleImage: 'image',
        istop: istop
      };
      await mysql('wx_dayevent').where({ 'id': id, 'wxuserid': ctx.state.$wxInfo.userinfo.openId }).update(data);
      var temp = await mysql('wx_dayevent').where({ 'isactived': 1, 'id': id });
      data = temp[0];
      console.log(data);
    }

    var edate = moment(data.eventdate);
    var nowdate = moment(Date.now());
    data.eventdate = edate.format('YYYY.MM.DD');
    data.createtime = moment(data.createtime).format('YYYY.MM.DD');
    var days = edate.diff(nowdate, 'days', true);
    days = parseInt(days) == days ? parseInt(days) : (days > 0 ? parseInt(days) + 1 : parseInt(days));
    data.eventTip = days == 0 ? '就是今天' : (days > 0 ? '还有' : '已经');
    data.days = Math.abs(days);
    data.label = data.days > 1 ? 'DAYS' : 'DAY';
    ctx.state.data = data;
  } else {
    ctx.state.code = -1
  }
}