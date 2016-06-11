"use static";

module.exports = function(grunt) {

	require('time-grunt')(grunt);

	require('load-grunt-tasks')(grunt);

	
	var config={
		app:'app',
		dist:'dist'
	};


	grunt.initConfig({
		config:config,
		copy:{
			dist:{
				src:'<%= config.app %>/index.html',
				dest:'<%= config.dist %>/index.html'
			}
		},
		clean:{
			dist:{
				src:'<%= config.app %>/index.html'
			}
		}
	});
	
}
