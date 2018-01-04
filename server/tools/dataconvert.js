const moment = require('moment')
const solarLunar = require("solarlunar");
const dataconvert = (data) => {
  var edate = moment(data.eventdate);
  var nowdate = moment(Date.now());
  var arr = edate.format('YYYY.MM.DD').split('.');
  const nl = solarLunar.solar2lunar(arr[0], arr[1], arr[2]);
  //处理重复
  if (data.repeattype > 0) {
    switch (data.repeattype) {
      case 1://每周
        var weekday = edate.day();
        var nowweekday = nowdate.day();
        weekday = weekday == 0 ? 7 : weekday;
        nowweekday = nowweekday == 0 ? 7 : nowweekday;
        if (weekday >= nowweekday) {
          edate = moment(Date.now()).add((weekday - nowweekday), 'd');
        } else {
          edate = moment(Date.now()).subtract((nowweekday - weekday), 'days');
        }
        break;
      case 2://每月

        break
      case 3://每年
        if (nowdate.format('YYYY') != edate.format('YYYY')) {
          if (data.calendartype == 0) {//公历
            edate = moment(nowdate.format('YYYY') + edate.format('-MM-DD'));
          } else {
            var currentDate = new Date();
            const currentNl = solarLunar.solar2lunar(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay());//当前时间阴历
            var nowNL = solarLunar.lunar2solar(currentNl.lYear, nl.lMonth, nl.lDay);
            console.log(nowNL);
            if (nowNL != -1) {
              edate = moment(nowNL.cYear + '-' + nowNL.cMonth + '-' + nowNL.cDay);
            }
          }
        }
        break
    }
  }

  data.eventdate = edate.format('YYYY.MM.DD');
  data.createtime = moment(data.createtime).format('YYYY.MM.DD');
  var days = edate.diff(nowdate, 'days', true);
  days = parseInt(days) == days ? parseInt(days) : (days > 0 ? parseInt(days) + 1 : parseInt(days));
  data.eventTip = days == 0 ? '就是今天' : (days > 0 ? '还有' : '已经');
  data.days = Math.abs(days);
  data.label = data.days > 1 ? 'DAYS' : 'DAY';

  //处理农历 
  if (data.calendartype == 1) {
    data.eventdate = nl.gzYear + '(' + nl.lYear + ')' + nl.monthCn + nl.dayCn;
  }
  data.detailDate = { year: arr[0], month: arr[1], day: arr[2], lYear: nl.lYear, lMonth: nl.lMonth, lDay: nl.lDay, isLeap: nl.isLeap }
  data.week = nl.ncWeek == '星期零' ? '星期日':nl.ncWeek ;

  return data;
}
module.exports = {
  dataconvert: dataconvert
};