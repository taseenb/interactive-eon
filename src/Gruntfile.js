var pkg = require( './package.json' );

module.exports = function ( grunt ) {

  grunt.initConfig( {
    //pkg: grunt.file.readJSON( 'package.json' ),
    jshint: {
      source: {
        options: {jshintrc: 'scripts/.jshintrc'},
        src: ['scripts/**/*.js', "!scripts/vendors/**", "!scripts/config.js"]
      }
    },
    connect: {
      server: {
        options: {
          port: pkg.config.port,
          hostname: '*',
          livereload: true,
          base: '../',
          middleware: function ( connect, options, middlewares ) {
            // inject a custom middleware http://stackoverflow.com/a/24508523
            middlewares.unshift( function ( req, res, next ) {
              res.setHeader( 'Access-Control-Allow-Origin', '*' );
              res.setHeader( 'Access-Control-Allow-Methods', '*' );
              return next();
            } );
            return middlewares;
          }
        }
      }
    },
    watch: {
      scripts: {
        files: ['scripts/**/*'],
        tasks: ['requirejs'],
        options: {livereload: true}
      },
      styles: {
        files: ['styles/**/*'],
        tasks: ['sass'],
        options: {livereload: true}
      }
    },
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          '../css/main.css': 'styles/main.scss'
        }
      }
    },
    requirejs: {

      unmin: {
        options: {
          baseUrl: 'scripts',
          mainConfigFile: "scripts/config.js",
          include: ['app'], // assumes a production build using almond
          name: "../node_modules/almond/almond",
          out: '../js/app.js',
          wrap: {
            start: '/*! app / v' + pkg.version + '<%= grunt.template.today("mmmm dd, yyyy") %> */\n',
            end: '/* start */'
          },
          wrapShim: true,
          removeCombined: true,
          useStrict: true,
          optimize: 'none',
          generateSourceMaps: false,
          preserveLicenseComments: true,
          findNestedDependencies: true,
          insertRequire: ['app']
        }
      },

      //min: {
      //  options: {
      //    baseUrl: 'scripts',
      //    mainConfigFile: "scripts/config.js",
      //    include: ['app'], // assumes a production build using almond
      //    name: "../node_modules/almond/almond",
      //    out: '../js/app.min.js',
      //    wrapShim: true,
      //    removeCombined: true,
      //    useStrict: true,
      //    optimize: 'uglify2',
      //    //generateSourceMaps: true,
      //    preserveLicenseComments: false,
      //    findNestedDependencies: true,
      //    insertRequire: ['app']
      //  }
      //}
    }

  } );

  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
  grunt.loadNpmTasks( 'grunt-contrib-connect' );
//  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks( 'grunt-sass' ); // faster c++ sass compiler


  grunt.registerTask( 'build', ['jshint', 'requirejs', 'sass'] );

  grunt.registerTask( 'default', ['build', 'connect', 'watch'] );

};
