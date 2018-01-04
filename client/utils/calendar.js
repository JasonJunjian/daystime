const solarLunar = require("solarlunar.min.js");
const getYearList = () => {
  const yearList = [];
  for (var year = 1901; year <= 2100; year++) {
    const lunar2solarData = solarLunar.lunar2solar(year, 1, 1);
    yearList.push({ year: year, name: lunar2solarData.gzYear + '(' + year + ')'  });
  }
  return yearList;
}
const getYearListIndex = (list, year) => {
  var index = 0;
  for (; index <= list.length; index++) {
    if (list[index].year == year) {
      return index;
    }
  }
  return index;
}
const getMonthList = (year) => {
  const monthList = [];
  const leapMonth = solarLunar.leapMonth(year);//闰月为几月
  for (var month = 1; month <= 12; month++) {
    const monthCn = solarLunar.toChinaMonth(month);
    monthList.push({ month: month, name: monthCn, isLeap: false });
    if (leapMonth == month) {
      monthList.push({ month: month, name: "\u95f0" + monthCn, isLeap: true });
    }
  }
  return monthList;
}
const getMonthListIndex = (list, month, isLeap) => {
  var index = 0;
  for (var i=0; i < list.length; i++) {
    if (list[i].month == month) {
      index = i;
      return isLeap ? index + 1 : index;
    }
  }
  return index;
}
const getDayList = (year, month, isLeap) => {
  const dayList = [];
  let dayNum = 0;
  if (isLeap) {
    dayNum = solarLunar.leapDays(year);
  } else {
    dayNum = solarLunar.monthDays(year, month);
  }
  for (var i = 1; i <= dayNum; i++) {
    dayList.push({ day: i, name: solarLunar.toChinaDay(i) });
  }
  return dayList;
}
const getDayListIndex = (list, day) => {
  var index = 0;
  for (; index <= list.length; index++) {
    if (list[index].day == day) {
      return index;
    }
  }
  return index;
}
const initCalendar = () => {
  const date = new Date();
  const year = date.getFullYear()
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const solar2lunar = solarLunar.solar2lunar(year, month, day);
  var yearList = getYearList();
  var monthList = getMonthList(solar2lunar.lYear);
  var dayList = getDayList(solar2lunar.lYear, solar2lunar.lMonth, solar2lunar.isLeap);

  return {
    nowDate: solar2lunar.gzYear + '(' + solar2lunar.lYear + ')' + solar2lunar.monthCn + solar2lunar.dayCn,      data: [yearList, monthList, dayList],
    index: [
      getYearListIndex(yearList, solar2lunar.lYear),
      getMonthListIndex(monthList, solar2lunar.lMonth),
      getDayListIndex(dayList, solar2lunar.lDay)
    ]
  };
} 
module.exports = {
  solarLunar: solarLunar,
  getYearList: getYearList,
  getMonthList: getMonthList,
  getDayList: getDayList,
  initCalendar: initCalendar,
  getYearListIndex: getYearListIndex,
  getMonthListIndex: getMonthListIndex,
  getDayListIndex: getDayListIndex
}