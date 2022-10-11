module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-coffee-react');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('default', ['watch:js']);
    grunt.registerTask('watchjs_sv', ['coffee', 'watch:js_sv']);
    grunt.registerTask('watchjsb_sv', ['watch:jsb_sv']);
    grunt.registerTask('watchjs_iw', ['coffee:glob_to_multiple_iw', 'watch:js_iw']);
    grunt.registerTask('deploy', ['clean', 'coffee']);
    grunt.registerTask('deploy_sv', ['clean', 'coffee:glob_to_multiple', 'coffee:app'])
    grunt.registerTask('deploy_iw', ['clean', 'coffee:glob_to_multiple_iw', 'coffee:app_iw']);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        target: grunt.option('target'),
        postcss: {
            options: {
                map: true,
                processors: [
                    require('cssnext')()
                ]
            },
            dist: {
                files: [{
                    src:['<%= target %>css/main.css'],
                    dest: '<%= target %>css/build/main.css'
                }]
            } 
        },
        coffee: {
	    glob_to_multiple: {
	        expand: true,
	        flatten: false,
	        cwd: '<%= target %>coffee/pages',
		src: ['**/*.coffee'],
		dest: '<%= target %>js/build/pages/',
		ext: '.js'
	    },
            glob_to_multiple_iw: {
                expand: true,
                flatten: false,
                cwd: '<%= target %>coffee/pages',
                src: ['**/*.coffee'],
                dest: '<%= target %>js/build/pages/',
                ext: '.js'
            },
	    app: {
	        src: ['<%= target %>coffee/app.coffee'],
		dest: '<%= target %>js/build/app.js'
	    },
            app_iw: {
                src: ['<%= target %>coffee/app.coffee'],
                dest: '<%= target %>js/build/app.js'
            }
        },
        watch: {
            js_sv: {
                files: ['<%= target %>coffee/*', '<%= target %>coffee/**/**/*', '<%= target %>pages/**/*'],
                tasks: ['watchjs_sv']
            },
            jsb_sv: {
                files: ['<%= target %>coffee/*', '<%= target %>coffee/**/**/*', '<%= target %>pages/**/*'],
                tasks: ['watchjsb_sv']
            },
            js_iw: {
                files: ['<%= target %>coffee/*', '<%= target %>coffee/**/**/*', '<%= target %>pages/**/*'],
                tasks: ['watchjs_iw']
            },
        },
        clean: {
            react: ['node_modules/**/react','!node_modules/react']
        },
    });
}
