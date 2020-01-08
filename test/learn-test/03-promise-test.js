var i = 0;
function Fish(hook) {
    console.log("New Fish\t" + ++i)
    if (hook) {
        hook.promise.then(function eatHook(cancel) { 
            this.name = "eatHook"
            console.log("eatHook\t\t" + ++i)
            console.log("done eat hook " + cancel)
        },function reject(){
            console.log("reject-----")
        })
    }
}

function Hook(executor) {
    console.log("New Hook\t" + ++i)
    var resolvePromise;
    var rejected;
    this.name = "Hook"
    // Promise 构造中，第一个参数函数
    this.promise = new Promise(function promiseHookEat(resolve,reject) {
        console.log("promiseHookEat\t" + ++i)
        resolvePromise = resolve;
        rejected = reject;
        // Promise内部的 resolve 和 reject 被交给了外部
        // var x = Math.random()*10;

        // if(x > 5){
        //     console.log(" resolve ")
        //     resolve()
        // }else{
        //     console.log(" reject ")
        //     reject()
        // }
        
    })
    var token = this;
    executor(function cancel(message) {
        console.log("cancel\t\t" + ++i)
        resolvePromise(token.name)
    },function putReject(){
        rejected()
    })
}
function GetHook() {
    console.log("New GetHook\t" + ++i)
    var cancel;
    var reject;
    this.name = "GetHook";
    var hook = new Hook(function putHook(c,r) {
        console.log("putHook\t\t" + ++i)
        cancel = c;
        reject = r;
    })
    return {
        hook: hook,
        cancel: cancel,
        reject:reject
    }
}
var hook = GetHook();
var fish = new Fish(hook.hook)
console.log("我要提钩了\t" + ++i)

hook.reject();
hook.cancel();
// 方法打印如下
//     New GetHook     1
//     New Hook        2
//     promiseHookEat  3
//     putHook         4
//     New Fish        5
//     我要提钩了      6
//     cancel          7
//     eatHook         8