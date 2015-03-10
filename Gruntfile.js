
/*global module:false*/

module.exports = function(grunt) {

  grunt.initConfig({

    react: {
      options: {
        harmony: true
      },

      jsx: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: [ '**/*.jsx', '**/*.js' ],
            dest: 'lib',
            ext: '.js'
          }
        ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-react');

  grunt.registerTask('default', ['react']);
};