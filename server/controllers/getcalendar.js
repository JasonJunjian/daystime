const solarLunar = require("solarlunar");
module.exports = async ctx => {
  var data = [];
  for (var year = 1901; year <= 2100; year++) {
    const lunar2solarData = solarLunar.lunar2solar(year, 1, 1);
    data.push({ year: year, gz: lunar2solarData.gzYear});
  }
  // for (var year = 1950; year <= 2100; year++) {
  //   const lunar2solarData = solarLunar.lunar2solar(year, month, 1);
  //   data.push(obj);

  //   var obj = { year: year, months:[]};
  //   for (var month = 1; month <= 12; month++) {
  //     const lunar2solarData = solarLunar.lunar2solar(year, month, 1);
  //     obj.year = year + lunar2solarData.gzYear;
  //     const dayNum = solarLunar.monthDays(year,month);
  //     var obj_month = { month: lunar2solarData.monthCn,days:[]};
  //     for(var i=1;i<=dayNum;i++){
  //       obj_month.days.push(solarLunar.toChinaDay(i));
  //     }
  //     obj.months.push(obj_month);

  //     if (leapMonth > 0 && month == leapMonth) {
  //       //闰月
  //       const lunar2solarData = solarLunar.lunar2solar(year, month, 1,true);
  //       const dayNum = solarLunar.leapDays(year, month);
  //       var obj_month = { month: lunar2solarData.monthCn,days:[] };
  //       for (var i = 1; i <= dayNum; i++) {
  //         obj_month.days.push(solarLunar.toChinaDay(i));
  //       }
  //       obj.months.push(obj_month); 
  //     }
  //   }
  data.push(obj);
  ctx.state.data = data;
}
