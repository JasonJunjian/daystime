// pages/manager.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var app = getApp();
var index=0;
var size = 10;
var loading = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      users:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getUsers();
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
  getUsers: function () {
    var that = this; 
   wx.showLoading({
     title: '加载中...',
   })
   loading= true;
    qcloud.request({
      url: `${config.service.host}/weapp/getusers`,
      data:{index:index,size:size},
      login: true,
      success(result) {
        loading =false;
        wx.hideToast();
        if (result.data.code == 0) {
          result.data.data.forEach(function(info){
            that.data.users.push(JSON.parse(info.user_info));
          })
          that.setData({ users: that.data.users });
        }
      },
      fail(error) {
        loading = false;
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  scrolltolower: function () {
    console.log(loading);
    if (!loading){  
      index++;
      this.getUsers();
    }
  }
})