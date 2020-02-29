const {injectBabelPlugin} = require('react-app-rewired');
module.exports = function override(config,env){  //antd 按需加载
  config = injectBabelPlugin([
  //引入模块：antd , 文件夹名：es，包含：css
  'import',{libraryName:'antd',libraryDirectory:'es',style:'css'}],config)
   //添加装饰器能力
  config = injectBabelPlugin(
     ['@babel/plugin-proposal-decorators',{legacy:true}],config
  )
 return config;
}
