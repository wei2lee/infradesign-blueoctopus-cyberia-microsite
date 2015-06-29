module.exports = function (grunt) {
    var TEMP_DIR = './temp/';
    var BUILD_DIR = './build/';
    var SRC_DIR = './';
    var BOWER_DIR = SRC_DIR + 'js/bower_components/'

    var SRC_CSS_DIR = SRC_DIR + 'css/';
    var SRC_CSS_FONT_DIR = SRC_CSS_DIR + 'fonts/'
    var SRC_MAIN_CSS = SRC_CSS_DIR + 'main.css';
    var SRC_CSS = [
        SRC_MAIN_CSS
    ];
    var SRC_CSS_FONT_DIR = SRC_CSS_DIR + 'fonts/';

    var SRC_IMAGE_DIR = SRC_DIR + 'images/';
    var SRC_IMAGE = grunt.file.expand(SRC_IMAGE_DIR + '*.{png,jpg,gif}');

    var SRC_MAIN_JS = SRC_DIR + 'js/main.js';
    var SRC_JS_DIR = SRC_DIR + 'js/';
    var SRC_JS = grunt.file.expand(SRC_JS_DIR + '*.js');

    var SRC_HTML = grunt.file.expand(SRC_DIR + '*.html');

    var SRC_OTHER = [
        'apple-touch-icon.png',
        'browserconfig.xml',
        'crossdomain.xml',
        'favicon.ico',
        'humans.txt',
        'robots.txt',
        'tile-wide.png',
        'tile.png',
        'assets/'
    ];
    
    
    var DEST_CSS_DIR = BUILD_DIR + 'css/';
    var DEST_CSS_FONT_DIR = DEST_CSS_DIR + 'fonts/'
    var DEST_MAIN_JS = BUILD_DIR + 'js/main.js';
    var DEST_MAIN_CSS = BUILD_DIR + 'css/main.css';
    var DEST_IMAGE_DIR = BUILD_DIR + 'images';



    
    
    //concat bower js, css
    var bowerconcat = {
        all: {
            dest:TEMP_DIR + 'all.js',
            cssDest:TEMP_DIR + 'all.css',
            mainFiles: {
                'form.validation': ['dist/css/formValidation.min.css', 'dist/js/formValidation.min.js'],
                'darkroomjs': ['build/css/darkroom.min.css', 'build/js/darkroom.min.js'],
            }
        }
    };
    grunt.config('bower_concat', bowerconcat);
    
    

    //uglify javascripts
    var uglifyobj = {
        my_target: {
            files: {}
        }
    };
    
    files = [TEMP_DIR + 'all.js'];
    files = files.concat(SRC_JS);
    
    uglifyobj.my_target.files[DEST_MAIN_JS] = files;
    grunt.config('uglify', uglifyobj);

    //minify css
    var cssminobj = {
        options: {
            shorthandCompacting: false,
            roundingPrecision: -1
        },
        target: {
            files: {

            }
        }
    }
    
    files = [TEMP_DIR + 'all.css'];
    files = files.concat(SRC_CSS);
    
    cssminobj.target.files[DEST_MAIN_CSS] = files;
    grunt.config('cssmin', cssminobj);

    //copy css font
    copyobj = {
        font: {
            files: [
                {
                    expand: true,
                    cwd: SRC_CSS_FONT_DIR,
                    src: ['**'],
                    dest: DEST_CSS_FONT_DIR
                }
            ],
        },
        other: {
            files: [
                {
                    expand: true,
                    cwd: SRC_DIR,
                    src: SRC_OTHER,
                    dest: BUILD_DIR
                }
            ],
        }
    };
    grunt.config('copy', copyobj);

    //    critcal css path inline 
    var criticalobj = {};
    for (var k in SRC_HTML) {
        var html = SRC_HTML[k];
        criticalobj[html] = {
            options: {
                pathPrefix: '',
                inlineImages: false,
                base: '',
                css: [
                    DEST_MAIN_CSS
                ],
                width: 1024,
                height: 768
            },
            src: BUILD_DIR + html,
            dest: BUILD_DIR + html
        }
    }
    grunt.config('critical', criticalobj);
    //replace js block in html to uglified main.js
    var processhtmlobj = {
        options: {
            data: {}
        },
        dist: {
            files: {
                
            }
        }
    };
    var processhtmlTargets = {};
    for (var k in SRC_HTML) {
        var html =  SRC_HTML[k];
        processhtmlTargets[BUILD_DIR + html] = [html];
    }
    processhtmlobj.dist.files = processhtmlTargets;
    grunt.config('processhtml', processhtmlobj);

    //minify image
    var mozjpeg = require('imagemin-mozjpeg');

    var imageminobj = { // Task
        all: { // Another target
            options: { // Target options
                optimizationLevel: 0,
                svgoPlugins: [{
                    removeViewBox: false
                }],
                //use: [mozjpeg()]
            },
            files: [{
                expand: true, // Enable dynamic expansion
                cwd: SRC_IMAGE_DIR, // Src matches are relative to this path
                src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                dest: DEST_IMAGE_DIR // Destination path prefix
                }]
        }
    };
    grunt.config('imagemin', imageminobj);

    
    
    
    
    //watch
    grunt.config('watch', {
        all: {
            files: SRC_JS,
            tasks: ['newer:concat:js', 'newer:uglify:js']
        }
    });


    grunt.loadNpmTasks('grunt-npm-install');
    grunt.loadNpmTasks('grunt-bower-concat');
    //grunt.loadNpmTasks('grunt-ftp-deploy');
//    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-watch');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-critical');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    

    grunt.registerTask('bowerconcat', ['bower_concat']);
    grunt.registerTask('npminstall', ['npm-install']);
    grunt.registerTask('js', ['uglify']);
    grunt.registerTask('css', ['cssmin']);
    grunt.registerTask('image', ['imagemin']);
    grunt.registerTask('font', ['copy:font']);
    grunt.registerTask('html', ['processhtml']);
    grunt.registerTask('other', ['copy']);
    grunt.registerTask('default', ['imagemin', 'uglify', 'cssmin', 'processhtml', 'critical']);
};




//npm install grunt-npm-install --save-dev
//      npm install grunt-bower-concat --save-dev  
//    npm install grunt-contrib-copy --save-dev
//    npm install grunt-contrib-cssmin --save-dev
//    npm install grunt-contrib-uglify --save-dev
//    npm install grunt-contrib-jshint --save-devls
//    npm install grunt-contrib-cssmin --save-dev
//    npm install grunt-contrib-imagemin --save-dev
//    npm install grunt-contrib-watch --save-dev
//    npm install grunt-contrib-concat --save-dev
//    npm install grunt-penthouse --save-dev
//    npm install grunt-contrib-clean --save-dev
//    npm install grunt-processhtml --save-dev
//    npm install grunt-contrib-watch --save-dev
//    npm install grunt-critical --save-dev
//    npm install grunt-newer --save-dev
//    npm install --save imagemin-mozjpeg
//    npm install grunt-autoprefixer --save-dev