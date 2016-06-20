//严格模式
"use static";

//grunt作为函数的参数方式传递（注入）
/*
 每一个gruntfile 和grunt package都有这样的函数
*/
module.exports = function(grunt) {

    //计算grunt 每执行一次
    require('time-grunt')(grunt);

    /***
     *  grunt.loadNpmTask("grunt-contib-copy");
     *  grunt.loadNpmTask("grunt-contib-clean");
     *  ..............
     *  使用下面的("load-grunt-tasks")组件是简写
     *   
     ***/
    require('load-grunt-tasks')(grunt);



    var config = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        /*
        	project settings 它是不针对任何task的属性，作为常量来使用
        	pkg:grunt.file.readJSON("package.json") 读取属性
        */
        config: config, //options
        copy: { // tasks 任务 ----grunt copy
            //1、
            /*dist:{  //target 具体任务分类名称 ----grunt copy:dist
            	src:'<%= config.app %>/index.html', //既可以是数组或字符串
            	dest:'<%= config.dist %>/index.html'
            }*/
            //2、
            /*dist_html:{
            	src:'<%= config.app %>/index.html',
            	dest:'<%= config.dist %>/index.html'
            },
            dist_js:{
            	src:'<%= config.app %>/js/index.js',
            	dest:'<%= config.dist %>/js/index.js'
            }*/
            //3、
            /*dist: {
                files: [{
                    src: "<%= config.app %>/index.html",
                    dest: '<%= config.dist %>/index.html'
                }, {
                    src: "<%= config.app %>/js/index.js",
                    dest: '<%= config.dist %>/js/index.js'
                }]
            }*/
            //4、
            /*dist:{
            	files:{
            		"<%= config.dist %>/index.html":"<%= config.app %>/index.html",
            		"<%= config.dist %>/js/index.js":["<%= config.app %>/js/index.js"]
            	}
            }*/
            //5、
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/', //目标文件目录
                    src: "**/*.js", //目标文件目录下的文件名称
                    dest: '<%= config.dist %>/',
                    ext: '.min.js', //生成的文件路径名
                    extDot: 'last', //可以是'first'从第几个点 向后截取 生成新文件名
                    flatten: true, //是否平铺文件（是否不需要文件夹（文件目录）） 或者执行自行一函数rename
                    rename: function(dest, filename) {
                        return dest + "js/" + filename;
                    }
                }]
            }

        },
        clean: {
            dist: {

                //1、
                /*
                src:'<%= config.dist %>/index.html'// clean 无需dest配置
                */
                //2、
                /*
                src: ['<%= config.dist %>/index.html', "<%= config.dist %>/js/index.js"]
                */
                //3、
                src: ['<%= config.dist %>/**/*']
                    /*
                     * 解释一下
                     * 一个'*'(星) 可以匹配任意字符，但是不匹配'/'（反斜杠）
                     * 一个'?'匹配一个字符，不匹配反斜杠
                     * 二个'*'(也就是'**')任意个数的任意字符，包括反斜杠
                     * '{a,b}.js' 取a.js或者b.js 其他不需要
                     * '！'取反
                     */
                    //或者下面这种
                    //,filter:"isFile" //'isFile'是nodeJS的 fs.Stats的对象
                    //或者自定义
                    ,
                filter: function(filepath) {
                    return !grunt.file.isDir(filepath);
                }

                //其他稍微常用配置属性
                /*
				,dot:true 没人为false, 如果dot配置属性设置为真 会匹配以'.'开头的文件
				,matchBase:true  只会匹配baseName 如果a?b  只会匹配 XXXX/123/acb 不会匹配XXX/acb/123
				,expand:true 动态处理src到dest的文件映射
                */
            }
        }
    });


    //task组合方式
    //1、grunt.registerTask(taskName, [description, ] taskList);  --task列表
    //2、grunt.registerMultiTask(taskName, [description, ] taskFunction); ---自定义 或者其他的


    

}
