'use strict';


console.log("Starting GitCI...")
setTimeout(function(){
    console.error("Aborting GitCI!")
    process.abort();
},3000);