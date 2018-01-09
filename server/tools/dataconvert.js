const moment = require('moment')
const solarLunar = require("solarlunar");
const dataconvert = (data) => {
  var edate = moment(data.eventdate);
  data.eventdate = edate.format('YYYY-MM-DD');
  var nowdate = moment(Date.now());

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
        if (data.calendartype == 0) {//公历
          edate = moment(nowdate.format('YYYY-MM') + edate.format('-DD'));
        } else {
          var edateArray = edate.format('YYYY-MM-DD').split('-');
          const oldNl = solarLunar.solar2lunar(edateArray[0], edateArray[1], edateArray[2]);
          var currentDate = new Date();
          const currentNl = solarLunar.solar2lunar(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());//当前时间阴历
          if (currentNl.lYear != oldNl.lYear) {
            var nowNL = solarLunar.lunar2solar(currentNl.lYear, currentNl.lMonth, oldNl.lDay, oldNl.isLeap);
            if (nowNL != -1) {
              edate = moment(nowNL.cYear + '-' + nowNL.cMonth + '-' + nowNL.cDay);
            }
          }
        }
        break;
      case 3://每年
        if (data.calendartype == 0) {//公历
          edate = moment(nowdate.format('YYYY') + edate.format('-MM-DD'));
        } else {
          var edateArray = edate.format('YYYY-MM-DD').split('-');
          const oldNl = solarLunar.solar2lunar(edateArray[0], edateArray[1], edateArray[2]);
          var currentDate = new Date();
          const currentNl = solarLunar.solar2lunar(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());//当前时间阴历
          if (currentNl.lYear != oldNl.lYear) {
            var nowNL = solarLunar.lunar2solar(currentNl.lYear, oldNl.lMonth, oldNl.lDay, oldNl.isLeap);
            if (nowNL != -1) {
              edate = moment(nowNL.cYear + '-' + nowNL.cMonth + '-' + nowNL.cDay);
            }
          }
        }
        break;
    }
  }

  data.showDate = edate.format('YYYY.MM.DD');
  data.createtime = moment(data.createtime).format('YYYY.MM.DD');
  var days = edate.diff(nowdate, 'days', true);
  days = parseInt(days) == days ? parseInt(days) : (days > 0 ? parseInt(days) + 1 : parseInt(days));
  data.eventTip = days == 0 ? '就是今天' : (days > 0 ? '还有' : '已经');
  data.days = Math.abs(days);
  data.label = data.days > 1 ? 'DAYS' : 'DAY';

  //处理农历 
  var edate_Date = edate.format('YYYY-MM-DD').split('-');
  const nl = solarLunar.solar2lunar(edate_Date[0], edate_Date[1], edate_Date[2]);
  if (data.calendartype == 1) {
    data.showDate = nl.gzYear + '(' + nl.lYear + ')' + nl.monthCn + nl.dayCn;
  }
  var edateArray = edate.format('YYYY-MM-DD').split('-');
  const oldNl = solarLunar.solar2lunar(edateArray[0], edateArray[1], edateArray[2]);
  data.detailDate = { year: edateArray[0], month: edateArray[1], day: edateArray[2], lYear: oldNl.lYear, lMonth: oldNl.lMonth, lDay: oldNl.lDay, isLeap: oldNl.isLeap };
  data.week = nl.ncWeek == '星期零' ? '星期日' : nl.ncWeek;

  return data;
}
module.exports = {
  dataconvert: dataconvert
};