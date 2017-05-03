// Copyright © 2016 RTE Réseau de transport d’électricité

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      options: {
        browserifyOptions : {
          debug: true
        }
      },
      dist: {
        files: {
          "dist/leaflet.flow.js": ["src/flow.js"]
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                'Copyright © 2016 RTE Réseau de transport d’électricité */\n'
      },
      build: {
        src: 'dist/leaflet.flow.js',
        dest: 'dist/leaflet.flow.min.js'
      }
    },
    watch: {
      source: {
        files: ["src/**/*"],
        tasks: ['browserify', 'uglify']
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Default task(s).
  grunt.registerTask('build', ['browserify', 'uglify']);
  grunt.registerTask('default', ["build"]);

};
