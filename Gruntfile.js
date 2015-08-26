module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        uglify: {
            options: {
                report: 'gzip',
                mangle: false
            },

            stickers_min: {

                options: {
                    mangle: false
                },

                files: {
                    'dist/stickers.min.js': ['dist/stickers.js']
                }
            }
        },

        includes: {
            js: {
                options: {
                    includeRegexp: /include:\s*['"]?([^'"]+)['"]?\s*$/,
                    duplicates: false,
                    debug: true
                },
                files: [{
                    cwd: 'js/',
                    src: 'stickers.js',
                    dist: 'dist/'
                }]
            }
        },

        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['**/*.js'],
                tasks: ['includes', 'uglify']
            },

            css: {
                files: ['**/*.css']
            },

            html: {
                files: ['**/*.html']
            }
        },

        express: {
            all: {
                options: {
                    port: 9000,
                    host: 'dev',
                    bases: ['./example', "./dist"],
                    livereload: true

                }
            }
        }


    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-includes');


    // Default task(s).
    grunt.registerTask('default', ['includes', 'uglify']);
    grunt.registerTask('server', ['express', 'watch']);

};