//严格模式
"use static";
module.exports = function(grunt) {
 	//计算grunt 每执行一次
    require('time-grunt')(grunt);

    require('load-grunt-tasks')(grunt);

     grunt.initConfig({

     });

     grunt.registerTask("serve","启动项目服务",function(target){
     	if(grunt.option("allow-remote")){
     		grunt.config.set("connect.options.hostname","0.0.0.0");
     	}
     	if(target==='dist'){
     		return grunt.task.run(['build','connect:dist:keeplive']);
     	}

     	grunt.task.run([
     		'clean:server',
     		'wiredep',
     		'concurrent:server',
     		'autoprefixer'

     		])

     });
};