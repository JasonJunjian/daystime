var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var calendar = require('../../utils/calendar.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    name: '',
    date: '',
    lDate: '',//农历日期
    isTop: false,
    showTopTips: false,
    classifyIndex: 0,
    classifys: [],
    calendar: [],
    calendarIndex: [],
    calendarTypes:['公历','农历'],
    calendarType:0,
    repeatTypes:['不重复','每周','每月','每年'],
    repeatType:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化当前日期 阴历日历 及类别 从缓存中取出
    var cal = calendar.initCalendar();
    this.setData({
      date: util.formatDate(new Date()),
      calendar: cal.data,
      lDate: cal.nowDate,
      calendarIndex: cal.index
    });
    var classifys = wx.getStorageSync("classifys");
    if (classifys) {
      this.setData({
        classifys: classifys.data
      });
    }

    if (options.id && options.id != 0) {
      wx.setNavigationBarTitle({
        title: '编辑这个日子'
      })
      this.data.id = options.id;
      var days = wx.getStorageSync("days");
      if (days) {
        for (var i = 0; i < days.data.length; i++) {
          if (days.data[i].id == this.data.id) {
            if (days.data[i].calendartype == 1){
              var offset = 0;//闰月偏移量
              if (days.data[i].detailDate.isLeap){
                offset = 1; 
              }
              
              var index = [
                calendar.getYearListIndex(this.data.calendar[0], days.data[i].detailDate.lYear),
                calendar.getMonthListIndex(this.data.calendar[1], days.data[i].detailDate.lMonth)+offset,
                calendar.getDayListIndex(this.data.calendar[2], days.data[i].detailDate.lDay)
              ];
              this.setData({ 
                calendarIndex: index,
                lDate: days.data[i].eventdate
              });
            } else{
              this.setData({
                date: days.data[i].eventdate.replace(/\./g, '-')
              });
            }
            this.setData({ 
              isTop: days.data[i].istop == 1,
              name: days.data[i].event,
              classifyIndex: this.getClassifyIndex(days.data[i].classifyid),
              id: options.id,
              calendarType: days.data[i].calendartype,
              repeatType: days.data[i].repeattype 
            });
          }
        }
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindInput: function (e) {
    if (e.currentTarget.id == 'eventName') {
      this.data.name = e.detail.value;
    }
  },
  bindchange: function (e) {
    this.setData({
      isTop: e.detail.value
    })
  },
  submit: function () {
    var that = this;
    if (that.data.name == '') {
      that.setData({ showTopTips: true, errMsg: '名称不能为空' });
      setTimeout(function () {
        that.setData({ showTopTips: false, errMsg: '' });
      }, 1500);
      return;
    }
    util.showBusy('提交中...')
    if (that.data.calendarType == 1){
      var year = that.data.calendar[0][that.data.calendarIndex[0]].year;
      var month = that.data.calendar[1][that.data.calendarIndex[1]];
      var day = that.data.calendar[2][that.data.calendarIndex[2]].day;
      var date = calendar.solarLunar.lunar2solar(year,month.month,day,month.isLeap);
      that.data.date = date.cYear+'-'+date.cMonth+'-'+date.cDay;
      console.log(that.data.date);
    }
    qcloud.request({
      url: `${config.service.host}/weapp/addday`,
      login: true,
      data: {
        id: that.data.id,
        name: that.data.name,
        eventdate: that.data.date,
        istop: that.data.isTop ? 1 : 0,
        classifyid: that.data.classifys[that.data.classifyIndex].id,
        calendarType: that.data.calendarType,
        repeatType: that.data.repeatType
      },
      success(result) {
        util.showSuccess(that.data.id == 0 ? '添加成功' : '编辑成功');
        wx.removeStorageSync("days");
        wx.navigateBack({
          delta: 5
        })
      },
      fail(error) {
        util.showModel(that.data.id == 0 ? '添加失败' : '编辑失败');
        console.log('request fail', error);
      }
    })
  },
  bindClassifyChange: function (e) {
    this.setData({
      classifyIndex: e.detail.value
    })
  },
  bindCalendarTypeChange:function(e){
    this.setData({
      calendarType: e.detail.value
    })
  },
  bindRepeatTypeChange: function (e) {
    this.setData({
      repeatType: e.detail.value
    })
  },
  getClassifyIndex: function (id) {
    var index = 0;
    for (var i = 0; i < this.data.classifys.length; i++) {
      if (this.data.classifys[i].id == id) {
        index = i;
        break;
      }
    }
    return index;
  },
  deleteTap: function () {
    var that = this;
    wx.showModal({
      title: '确认删除？',
      content: "时光易逝,岁月难求。回首往事,不过数秋",
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          util.showBusy('删除中...')
          qcloud.request({
            url: `${config.service.host}/weapp/delday`,
            login: true,
            data: {
              id: that.data.id
            },
            success(result) {
              util.showSuccess('删除成功');
              wx.removeStorageSync("days");
              // wx.redirectTo({
              //   url: '../days/index'
              // })
              wx.navigateBack({
                delta: 5
              })
            },
            fail(error) {
              util.showModel('删除失败');
              console.log('request fail', error);
            }
          })
        }
      }
    })
  },
  bindPickerChange: function (e) {
    //event.detail = { column: column, value: value }
    console.log(e.detail);
    switch (e.detail.column) {
      case 0:
        var monthList = calendar.getMonthList(this.data.calendar[0][e.detail.value].year);
        this.data.calendarIndex[0] = e.detail.value;
        if (this.data.calendarIndex[1] > (monthList.length - 1)) {
          this.data.calendarIndex[1] = 0;
        }
        this.setData({ ['calendar[1]']: monthList, calendarIndex: this.data.calendarIndex });
        break;
      case 1:
        var dayList = calendar.getDayList(this.data.calendar[0][this.data.calendarIndex[0]].year, this.data.calendar[1][e.detail.value].month);
        this.data.calendarIndex[1] = e.detail.value;
        if (this.data.calendarIndex[2] > (dayList.length - 1)) {
          this.data.calendarIndex[2] = 0;
        }
        this.setData({ ['calendar[2]']: dayList, calendarIndex: this.data.calendarIndex });
        break;
      case 2:
        this.data.calendarIndex[2] = e.detail.value;
        this.setData({ calendarIndex: this.data.calendarIndex });
        break;
    }
    var date ='';
    var that = this;
    that.data.calendarIndex.forEach(function(index,i){
      date += that.data.calendar[i][index].name;
    })  
    that.setData({ lDate: date });
  }
})