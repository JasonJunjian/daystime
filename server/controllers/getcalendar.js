const solarLunar = require("solarlunar");
module.exports = async ctx => {
  var data = [];
  for (var year = 1901; year <= 2100; year++) {
    const lunar2solarData = solarLunar.lunar2solar(year, 1, 1);
    data.push(year + lunar2solarData.gzYear); 
  }
  ctx.state.data = data;
}
