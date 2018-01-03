// pages/dayView.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventIndex:0,
    event: {},
    events: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id && options.id != 0) {
      var days = wx.getStorageSync("days");
      if (days) {
        this.setData({
          events: days.data
        });
        for (var i = 0; i < days.data.length; i++) {
          if (days.data[i].id == options.id) { 
            this.setData({
              event: days.data[i],
              eventIndex:i
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
  editDay: function (e) {
    wx.navigateTo({
      url: '../addDay/addDay?id=' + this.data.event.id,
    })
  },
  eventchange:function(e){
    //e.detail = { current: current, source: source }
    //console.log(e.detail);
    this.setData({
      event: this.data.events[e.detail.current]
    });
  }
})