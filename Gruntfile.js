/*
 * grunt-strip-code
 * https://github.com/nuzzio/grunt-strip-code
 *
 * Copyright (c) 2015 Rene Cabral
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    grunt.initConfig({

        paths: {
            fixtures: 'test/fixtures/',
            expected: 'test/expected/',
            tmp: 'test/tmp/'
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        /**
         * Clear old tests
         */
        clean: {
            tests: 'test/tmp'
        },

        /**
         * Copy test fixtures to the tmp directory
         */

        copy: {
            tests: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.fixtures %>',
                        src: '*',
                        dest: '<%= paths.tmp %>'
                    }
                ]
            }
        },

        /**
         * Run task on test files.
         */
        strip_code: {

            options: {
                testMode: true
            },

            default_options: {
                src: 'test/tmp/default_options.js'
            },

            strip_html_and_js_code: {
                src: 'test/tmp/sample.html',
                options: {
                    blocks: [
                        {
                            start_block: '<!--#BEGIN DEBUG#-->',
                            end_block: '<!--#END DEBUG#-->'
                        },
                        {
                            start_block: '/* BEGIN DEBUG */',
                            end_block: '/* END DEBUG */'
                        }
                    ]
                }
            },
            start_end_options: {
                options: {
                    blocks: [
                        {
                            start_block: '/* {test} */',
                            end_block: '/* {/test} */'
                        },
                        {
                            start_block: '/* test-code */',
                            end_block: '/* end-test-code */'
                        }
                    ]
                },
                src: 'test/tmp/start_end_options.js'
            },
            pattern_options: {
                options: {
                    patterns: / *console\.log\([\w\S ]+\);?\n?/g
                },
                src: 'test/tmp/patterns_options.js'
            },
            dest_specified: {
                files: [
                    {
                        src: 'test/tmp/dest_specified.js',
                        dest: 'test/tmp/dest_specified2.js'
                    }
                ]
            },
            multiple_files: {
                src: [
                    'test/tmp/multiple_files*.js',
                    'test/tmp/another_multiple_file.js'
                ]
            },
            intersection_false: {
                options: {
                    blocks: [
                        {
                            start_block: '/* {test} */',
                            end_block: '/* {/test} */'
                        },
                        {
                            start_block: '/* test-code */',
                            end_block: '/* end-test-code */'
                        }
                    ]
                },
                src: 'test/tmp/intersection-false.js'
            },
            parity_false: {
                src: 'test/tmp/parity-false.js'
            },
            legacy_pattern: {
                options: {
                    pattern: / *console\.log\([\w\S ]+\);?\n?/g
                },
                src: 'test/tmp/legacy_pattern.js'
            },
            legacy_pattern_start_end: {
                options: {
                    start_comment: 'start-test-block',
                    end_comment: 'end-test-block',
                    pattern: / *console\.log\([\w\S ]+\);?\n?/g
                },
                src: 'test/tmp/legacy_pattern_start_end.js'
            },
            legacy_start_end: {
                options: {
                    start_comment: 'start-test-block',
                    end_comment: 'end-test-block'
                },
                src: 'test/tmp/legacy_start_end.js'
            }
        },

        /**
         * Run tests
         */
        nodeunit: {
            all: ['test/*_test.js'],
            options: {
                reporter: 'verbose'
            }
        }

    });

    /**
     * Load this plugin's task(s).
     */
    grunt.loadTasks('tasks');

    /**
     * Load plugins.
     */
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    /**
     * - first clean the "tmp" dir
     * - then run this plugin's task(s)
     * - then test the result
     */
    grunt.registerTask('test', ['clean', 'copy', 'strip_code', 'nodeunit']);

    /**
     * - lint
     * - run all tests
     */
    grunt.registerTask('default', ['jshint', 'test']);

};
