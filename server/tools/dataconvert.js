const moment = require('moment')
const dataconvert = (data)=>{
  var edate = moment(data.eventdate);
  var nowdate = moment(Date.now());
  data.eventdate = edate.format('YYYY.MM.DD');
  data.createtime = moment(data.createtime).format('YYYY.MM.DD');
  var days = edate.diff(nowdate, 'days', true);
  days = parseInt(days) == days ? parseInt(days) : (days > 0 ? parseInt(days) + 1 : parseInt(days));
  data.eventTip = days == 0 ? '就是今天' : (days > 0 ? '还有' : '已经');
  data.days = Math.abs(days);
  data.label = data.days > 1 ? 'DAYS' : 'DAY';
  return data;
}
module.exports = {
  dataconvert: dataconvert
};