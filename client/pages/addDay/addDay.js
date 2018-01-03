var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    name: '',
    date: '',
    isTop: false,
    showTopTips: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    if (options.id){
      this.data.id = options.id;
      var days = wx.getStorageSync("days");
      if (days) {
        for (var i = 0; i < days.data.length; i++) {
          console.log(days.data[i]);
          if (days.data[i].id == this.data.id) {
            this.setData({
              date: days.data[i].eventdate.replace('.', '-'),
              isTop: days.data[i].istop == 1,
              name: days.data[i].event
            });
            wx.setNavigationBarTitle({
              title: '编辑事件'
            })
          }
        }
      }
    } 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({ date: util.formatDate(new Date()) });
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
  bindBlur: function (e) {
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
      that.setData({ showTopTips: true, errMsg: '事件名称不能为空' });
      setTimeout(function () {
        that.setData({ showTopTips: false, errMsg: '' });
      }, 1500);
      return;
    }
    util.showBusy('提交中...')
    qcloud.request({
      url: `${config.service.host}/weapp/addday`,
      login: true,
      data: {
        id:that.data.id,
        name: that.data.name,
        eventdate: that.data.date,
        istop: that.data.isTop?1:0
      },
      success(result) {
        util.showSuccess(that.data.id==0?'添加成功':'编辑成功');
        console.log(JSON.stringify(result.data));
        var days = wx.getStorageSync("days");
        if (days) {
          if (that.data.id == 0) {
            days.data.push(result.data.data);
          }else{
            for(var i=0;i<days.data.length;i++){
              if (that.data.id == days.data[i].id){
                days.data[i] = result.data.data;
              }
            }
          }
          
          wx.setStorage({
            key: 'days',
            data: days,
          }) 
        } 
        wx.navigateBack({
          delta: 1
        })
      },
      fail(error) {
        util.showModel(that.data.id == 0 ?'添加失败':'编辑失败', error);
        console.log('request fail', error);
      }
    })
  }
})