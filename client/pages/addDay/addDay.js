var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    name: '',
    date: '',
    isTop: false,
    showTopTips: false,
    classifyIndex: 0,
    classifys: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化当前日期 及类别 从缓存中取出
    this.setData({
      date: util.formatDate(new Date())
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
            this.setData({
              date: days.data[i].eventdate.replace(/\./g, '-'),
              isTop: days.data[i].istop == 1,
              name: days.data[i].event,
              classifyIndex: this.getClassifyIndex(days.data[i].classifyid),
              id: options.id
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
    qcloud.request({
      url: `${config.service.host}/weapp/addday`,
      login: true,
      data: {
        id: that.data.id,
        name: that.data.name,
        eventdate: that.data.date,
        istop: that.data.isTop ? 1 : 0,
        classifyid: that.data.classifys[that.data.classifyIndex].id
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
  deleteTap:function(){
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
                delta:5
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
  }
})