class EventEmitter {
  //默认每个事件可注册10个监听器
  static defaultMaxListeners = 10;
  constructor() {
    //创建一个对象来保存时间名和事件函数
    this.eventsObj = Object.create(null);
  }
  addListener(type, listener, prepend) {
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
    return this;
  }
  on(type, listener, prepend) {
    return this.addListener(type, listener, prepend);
  }
  //获取当前的监听器最大限制数的值
  getMaxListeners() {
    return this._count || EventEmitter.defaultMaxListeners;
  }
  //设置每个事件可注册最大监听器数量
  setMaxListeners(count) {
    this._count = count;
  }
  prependListener(type, listener) {
    this.on(type, listener, true);
  }
  //从名为type的事件监听器数组中移除指定listener
  removeListener(type, listener) {
      if(this.eventsObj[type]){
          //如果注册过removeListener事件就先执行该事件函数
          if(this.eventsObj['removeListener'] && this.eventsObj['removeListener'].length>1){
            this.eventsObj["removeListener"].forEach(fn => fn(type));
          }
          //过滤事件函数数组
          this.eventsObj[type] = this.eventsObj[type].filter(fn=>{
              return fn !== listener && fn !== callback.realCallback;
          })
      }
  }
  off(type, listener){
      this.removeListener(type, listener);
  }
  //移除某个事件下的所有listener
  removeAllListeners(type) {
      if(type){
          this.eventsObj[type]
      }else{
          this.eventsObj = Object.create(null);
      }
  }
  //once本质上是先调用on  然后emit一次之后就removeListener
  once(type, listener, prepend) {
    //这里包裹一层不然没办法在listener中removeListener，因为listener是使用时定义的
    const wrap = (...args) => {
      listener(...args);
      this.removeListener(type, wrap);
    };
    wrap.realCallback = listener;
    this.on(type, wrap, prepend);
  }
  prependOnceListener(type, listener) {
    this.once(type, listener, true);
  }
  //获取监听得所有事件类型
  eventNames(){
      return Object.keys(this.eventsObj)
  }
  //返回类型对应得事件函数
  listeners(type){
      return this.eventsObj[type]
  }
  emit(type, ...args){
      if(this.eventsObj[type]){
        this.eventsObj[type].forEach(fn => fn.call(this, ...args));
      }
  }
}
module.exports = EventEmitter;
