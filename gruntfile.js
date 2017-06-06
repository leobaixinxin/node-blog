/**
 * Created by baixinxin on 2017/6/5.
 */
module.exports = function(grunt){

    grunt.initConfig({
         watch: {
            scripts: {
                files: ['schemas/*.js','models/*.js','public/js/*.js','routers/*.js'],
                //
                options:{
                    livereload:true
                }
            },
            sass: {
                files: ['./scss/style.scss'],
                tasks: ['sass']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    'index.html',
                    'style.css',
                    'js/global.min.js'
                ]
            }
         },
         nodemon:{
             dev:{
                 script:'app.js',
                 options:{
                     args:[],
                     ignore:['README.md','node_modules/**','.DS_Store'],
                     ext:'js',
                     watch:['app','config'],
                     debug:true,
                     delay:1,
                     env:{
                         PORT:3000
                     },
                     cwd:__dirname
                 }
             }
         },
         concurrent:{
             tasks:['nodemon','watch'],
             options:{
                 logConcurrentOutput:true
             }
         }
    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent'); //  针对慢任务开发的管理

    grunt.option('force',true);

    grunt.registerTask('default',['concurrent'])
};