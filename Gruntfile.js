module.exports = function(grunt) {
  "use strict";
  var javascriptTargets =  ["Gruntfile.js", "src/**/*.js", "test/**/*.js"];

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    qunit: {
      all: ["test/index.html"]
    },

    jshint: {
      options: {
        jshintrc: true
      },
      target: javascriptTargets
    },

    jscs: {
      main: javascriptTargets,
      options: {
        config: ".jscs.json"
      }
    },

    watch: {
      scripts: {
        files: "**/*.js",
        tasks: ["build"]
      }
    },

    connect: {
      server: {
        options: {
          port: 9999,
          middleware: [function(req, res, next) {
            if (req.url.indexOf("test/fixtures") !== -1) {
              var url = require("url").parse(req.url, true);
              res.setHeader("Content-Type", "text/javascript");
              if (url.query.error === "true") {
                res.statusCode = 404;
              } else {
                res.write(url.query.jsonp + "({url:\"" + req.url + "\"})");
              }
              res.end();
            }
          }]
        }
      }
    },

    uglify: {
      src: {
        options: {
          sourceMap: true
        },
        files: {
          "dist/api.min.js": ["src/api.js"]
        }
      }
    }

  });

  require("load-grunt-tasks")(grunt);

  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-qunit");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jscs-checker");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("build", ["jshint", "jscs", "test", "uglify"]);
  grunt.registerTask("test", ["connect", "qunit"]);
  grunt.registerTask("default", "build");

};
