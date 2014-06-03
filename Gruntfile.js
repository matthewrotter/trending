module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [
        '**/*.js',
        '!node_modules/**/*.js',
        '!public/js/vendor*'
      ]
    },
    concurrent: {
      def: {
        tasks: ['shell:supervisor', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    watch: {
      express: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint'],
        options: {
          spawn: false
        }
      }
    },
    shell: {
      supervisor: {
        command: 'supervisor trending.js',
        options: {
          stdout: true,
          stderr: true
        }
      },
      seed: {
        command: 'node test/_seed.js',
        options: {
          stdout: true,
          stderr: true
        }
      }
    },
    simplemocha: {
      options: {
        globals: ['magma'],
        timeout: 5000,
        ignoreLeaks: true,
        // grep: '*.js',
        ui: 'bdd',
        reporter: 'tap'
      },
      unit: { src: [
        'test/**/*.js',
        '!test/_*.js',
        '!test/request-via-api.js'
      ] },
      functional: {
        src: [
          'test/request-via-api.js'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-simple-mocha');


  grunt.registerTask('default', 'work');
  grunt.registerTask('work', ['concurrent']);
  grunt.registerTask('test', ['simplemocha:unit']);
  grunt.registerTask('test:func', ['simplemocha:functional']);

};
