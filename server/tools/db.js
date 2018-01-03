const { mysql: config } = require('../config')

var knex = require('knex');
var DB;    // 数据库连接
// 保证数据库连接只初始化一次。
if (!DB) {
  DB = knex({
    client: 'mysql',
    connection: {
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.pass,
      database: config.daysdb,
      charset: config.char,
      multipleStatements: true
    }
  });
}

const addClassify = (data) => {
  DB.raw("BEGIN;INSERT INTO `wx_classify` (wxuserid,name,createtime,isactived,updatetime) VALUES ('testnodejs', 'testnodejs', '2017-12-30 23:10:20', '1', '2017-12-30 23:51:33');COMMIT;").then(res => {
    console.log('类别插入成功')
  }, err => {
    throw new Error(err)
  })
}
const addDayEvent = (data) => {
  var sql = "BEGIN;insert into `wx_dayevent` ( `wxuserid`, `updatetime`, `event`, `isactived`, `eventdate`, `classifyid`, `styleImage`, `createtime`) values ('" + data.wxuserid + "', '" + data.updatetime + "', '" + data.event + "', '" + data.isactived + "', '" + data.eventdate + "', '" + data.classifyid + "', '" + data.styleImage + "', '" + data.createtime + "');COMMIT;";
  DB.raw(sql).then(res => {
    console.log('日子插入成功')
  }, err => {
    throw new Error(err)
  })
}
const queryDayEvent = () => {
  //mys(config.daysdb).select('*').from('wx_dayevent').where({ id: 1 });
  return DB('wx_dayevent').where('isactived', 1).then(function (rows) {
    return rows;
  });
}
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
module.exports = {
  addDayEvent: addDayEvent,
  addClassify: addClassify,
  queryDayEvent: queryDayEvent
};