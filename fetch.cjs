module.exports=(...args)=>import('node-fetch').then(({default:f})=>f(...args));
