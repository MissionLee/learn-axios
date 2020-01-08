var obj = {
    name:"MissionLee",
    age:"10",
    say(){
        console.log("hello!")
    }
}
/**
 * 如果是个值，打印； 如果是个方法，执行
*/
for(key in obj){
    console.log(key)
    if(typeof obj[key] == 'function'){
        obj[key]();
    }else{
        console.log(obj[key])
    }
}
