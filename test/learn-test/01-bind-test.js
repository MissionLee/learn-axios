/**
 * 测试目的说明: bind.js 和原生 bind的作用都是改变一个方法的this环境
 * 
 * 这里用代码简单验证以下
*/
var bindjs = require('../../lib/helpers/bind') // 为了方便区分，引入的名称叫 bindjs
function NewThisFunctionObject(){
    this.name = 'NewThis';
    this.greeting = function(){
        console.log("NewThis:hello "+this.name);
    }
}

function AimFunctionObjectA(){
    this.name = "A";
    this.greeting = function(){
        console.log("A:hello "+this.name);
    }   
}
function AimFunctionObjectB(){
    this.name = "A";
    this.greeting = function(){
        console.log("B:hello "+this.name);
    }
}
var o = new NewThisFunctionObject();
var a = new AimFunctionObjectA();
var b = new AimFunctionObjectB();
a.greeting(); // A:hello A
b.greeting(); // B:hello A
var binda = a.greeting.bind(o); // 返回一个 this指向o 的 greeting a
var bindb = bindjs(b.greeting,o); // 返回一个 this指向o 的 greeting b
binda(); // A:hello OriginFunctionObject
bindb(); // B:hello OriginFunctionObject