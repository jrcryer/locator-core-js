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
            var url = require("url").parse(req.url, true),
                resObject;
            if (req.url.indexOf("test/fixtures") !== -1) {
              if (req.url.indexOf("location.json") !== -1) {
                resObject = {
                  type: "location",
                  id: "CF5",
                  name: "CF5",
                  cookie: "1#l1#i=CF5:n=CF5:h=w@w1#i=2071:p=Barry@d1#1=wa:2=w:3=w:4=44.9@n1#r=53",
                  expires: "1434532890"
                };
              } else {
                resObject = {
                  response: {
                    totalResults: 0,
                    metadata: {
                      location: req.url
                    },
                    content: {
                      details: {
                        details: []
                      }
                    },
                    locations: req.url,
                    results: {
                      totalResults: 0,
                      results: req.url
                    }
                  }
                };
              }
              res.setHeader("Content-Type", "text/javascript");
              if (url.query.error === "true") {
                res.statusCode = 404;
              } else {
                res.write(url.query.jsonp + "(" + JSON.stringify(resObject) + ")");
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
          "dist/api.min.js": "src/api.js",
          "dist/shared.min.js": "src/shared.js"
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
