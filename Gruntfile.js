'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*_test.js'],
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'shell:testClient']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      },
    },
    shell : {
      issueRequest : {
        command : 'curl http://localhost:5000',
        options : {
          stdout : true,
          callback : function( stdOut ){
          
            console.log( 'issueRequest::', stdOut );

          }
        }
      },
      testClient : {
        clientPWD : '../ChappySinclairClient/',
        superPWD : '../ChappySinclair/',
        command : 'cd <%= shell.testClient.clientPWD %> && npm install ~/Code/ChappySinclair && node lib/ChappySinclairClient.js',
        options : {
          stdout : true,
          callback : function( stdOut ){

            console.log( 'testClient::', stdOut ); 
            //grunt.task.run( 'shell:issueRequest' );

          }
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');

  // Default task.
  grunt.registerTask('default', ['jshint', 'nodeunit']);

};
