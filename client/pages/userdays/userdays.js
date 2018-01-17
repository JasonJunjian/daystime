// pages/userdays/userdays.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userdays: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDayEvent(options.openid);
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
  getDayEvent: function (openid) {
    var that = this; 
    wx.showLoading({
      title: '加载中...',
    })
    qcloud.request({
      url: `${config.service.host}/weapp/userdays`,
      login: true,
      data: {  openid: openid},
      success(result) {
        wx.hideToast();
        if (result.data.code == 0) {
           that.setData({userdays:result.data.data});
        }
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  }
})