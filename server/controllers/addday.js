const { mysql } = require('../qcloud')
const moment = require('moment')
const convert = require('../tools/dataconvert')
module.exports = async ctx => {
  if (ctx.state.$wxInfo.loginState === 1) {
    const { name, eventdate, istop, id, classifyid, calendarType, repeatType } = ctx.query;
    var data;
    if (id == 0) {
      data = {
        wxuserid: ctx.state.$wxInfo.userinfo.openId,
        updatetime: moment(Date.now()).format('YYYY-MM-DD 00:00:00'),
        event: name,
        isactived: '1',
        eventdate: moment(eventdate).format('YYYY-MM-DD 00:00:00'),
        classifyid: classifyid,
        styleImage: '',
        istop: istop,
        createtime: moment(Date.now()).format('YYYY-MM-DD 00:00:00'),
        calendartype: calendarType,
        repeattype: repeatType
      };
      var temp = await mysql('wx_dayevent').insert(data);
      data.id = temp[0];
    } else {
      data = {
        updatetime: moment(Date.now()).format('YYYY-MM-DD 00:00:00'),
        event: name,
        eventdate: moment(eventdate).format('YYYY-MM-DD 00:00:00'),
        classifyid: classifyid,
        //styleImage: 'image',
        istop: istop,
        calendartype: calendarType,
        repeattype: repeatType
      };
      if (istop == 1) {
        await mysql('wx_dayevent').where({ 'isactived': 1, 'wxuserid': ctx.state.$wxInfo.userinfo.openId }).update('istop', '0');
      }
      await mysql('wx_dayevent').where({ 'id': id, 'wxuserid': ctx.state.$wxInfo.userinfo.openId }).update(data);
      var temp = await mysql('wx_dayevent').where({ 'isactived': 1, 'id': id });
      data = temp[0];
      console.log(data);
    } 
    data = convert.dataconvert(data);
    ctx.state.data = data;
  } else {
    ctx.state.code = -1
  }
}
