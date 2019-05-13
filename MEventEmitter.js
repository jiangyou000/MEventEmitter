class EventEmitter {
  //默认每个事件可注册10个监听器
  static defaultMaxListeners = 10;
  constructor() {
    //创建一个对象来保存时间名和事件函数
    this.eventsObj = Object.create(null);
  }
  _addListener(type, listener, prepend) {
    //node种util的inherits方法集成时无法继承实例属性，这里做兼容,没有就创建一个
    if (!this.eventsObj) this.eventsObj = Object.create(null);
    //判断是不是newListener事件，如果不是就执行之前注册过的newListener事件
    if (type !== "newListener") {
      //判断之前是否注册过newListener事件，注册过才执行
      if (
        this.eventsObj["newListener"] &&
        this.eventsObj["newListener"].length
      ) {
        this.eventsObj["newListener"].forEach(fn => fn(type));
      }
    }
    //判断该事件类型是否已创建
    if (this.eventsObj[type]) {
      this.eventsObj[type][prepend ? "unshift" : "push"](listener);
    } else {
      this.eventsObj[type] = [listener];
    }
    //最大监听数量警告
    let maxListeners = this.getMaxListeners();
    //判断type类型事件是否超出最大监听个数，超出打印警告信息
    if (this.eventsObj[type].length - 1 === maxListeners) {
      console.error(
        `MaxListenersExceededWarning:
              ${maxListeners + 1} ${type} listeners added`
      );
    }
  }
  //获取当前的监听器最大限制数的值
  getMaxListeners() {
    return this._count || EventEmitter.defaultMaxListeners;
  }
  //设置每个事件可注册最大监听器数量
  setMaxListeners(count) {
    this._count = count;
  }
}
module.exports = EventEmitter;
