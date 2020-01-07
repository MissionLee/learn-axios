'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig); // ⭐ 使用默认配置，创建一个 Axios对象，作为 context
  var instance = bind(Axios.prototype.request, context); // ⭐ 让Axios 原型中的 request 方法 ，
                                                         // 指定为用默认配置创建的这个Axios（方法对象）的this

  // 这样instance就指向了request方法，且上下文指向context，所以可以直接以 instance(option) 方式调用
  // Axios.prototype.request 内对第一个参数的数据类型判断，使我们能够以 instance(url, option) 方式调用


  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context); // 将 Axios.prototype 上的所有“成员”，
                                                    // 如果这个成员是个方法，就复制一份给 instance，
                                                    // 复制的时候，这些方法的this都指向 context
                                                    // ⭐⭐ 推测这么做的目的，主要是向让 instance 拥有 Axios.prototype
                                                    // 中的方法的同时，使用 context作为this（context是默认配置完成的）
                                                    // 高级es版本里面是否还需要这么写？
  // 把Axios.prototype上的方法扩展到instance对象上，
  // 这样 instance 就有了 get、post、put等方法
  // 并指定上下文为context，这样执行Axios原型链上的方法时，this会指向context


  // Copy context to instance
  utils.extend(instance, context); // 将 context 所有设定的成员 交给 instance
  // 把context对象上的自身属性和方法扩展到instance上
  // 注：因为extend内部使用的forEach方法对对象做for in 遍历时，只遍历对象本身的属性，而不会遍历原型链上的属性
  // 这样，instance 就有了  defaults、interceptors 属性。（这两个属性后面我们会介绍）

  return instance; // 返回 instance
  // ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐
  // 默认到处的 instance 实体，实际上不是 Axios对象的实例，而是：
  // 基于 Axios.prototype.request,扩展了 Axios.prototype的各个方法（post/get等等）
  // 拥有了 context里面的默认属性的一个全新的 “instance”（Function）

}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;
