// index.js
// 获取应用实例

const util = require('../../utils/util');

const app = getApp();
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    now: util.formatTime(new Date()),
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs',
    });
  },
  onLoad() {
    console.log('onLoad');
    const that = this;
    // 调用应用实例的方法获取全局数据
    app.getUserInfo((userInfo) => {
      // 更新数据
      that.setData({
        userInfo,
      });
    });
  },
});
