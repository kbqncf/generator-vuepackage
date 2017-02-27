var path = require('path');
var chalk = require('chalk');    //不同颜色的info
var util = require('util');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');    //yeoman弹出框
var _ = require('lodash');
var path = require('path');
var Reactpackage = yeoman.Base.extend({
    initializing: function () {//初始化准备工作
        this.props = {};
        this.log(chalk.green(
            '开始构建项目.......'
        ));
    },
    prompting: function () {//接受用户输入
        var done = this.async(); //当处理完用户输入需要进入下一个生命周期阶段时必须调用这个方法
        //yeoman-generator 模块提供了很多内置的方法供我们调用，如下面的this.log , this.prompt , this.template , this.spawncommand 等
        this.props.name = path.basename(process.cwd());
        this.props.ver = '1.0.0';
        this.props.description = '';
        this.props.repo = '';
        this.props.author = '';
        this.props.license = 'ISC';
        //配置
        var prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'name of project:',
                default: this.props.name
            },
            {
                type: 'input',
                name: 'ver',
                message: 'version:',
                default: this.props.ver
            },
            {
                type: 'input',
                name: 'description',
                message: 'description:',
                default: this.props.description
            },
            {
                type: 'input',
                name: 'repo',
                message: 'git repository:',
                default: this.props.repo
            },
            {
                type: 'input',
                name: 'author',
                message: 'author:',
                default: this.props.author
            },
            {
                type: 'input',
                name: 'license',
                message: 'license:',
                default: this.props.license
            }
        ];
        let _this = this;
        this.prompt(prompts).then(function (props) {
            // _this.name = props.name;
            // _this.ver = props.ver;
            // _this.description = props.description;
            // _this.repo = props.repo;
            // _this.author = props.author;
            // _this.license = props.license;
            // _this.log(props);
            _this.props = props;
            done();  //进入下一个生命周期阶段
        });
    },
    writing: function () {  //按照自己的templates目录自定义
        this.directory('src', 'src');    //拷贝目录
        this.copy('README.md', 'README.md');
        this.copy('.npmrc', '.npmrc');
        this.copy('.babelrc', '.babelrc');
        this.copy('.gitignore', '.gitignore');
        this.copy('gulpfile.js', 'gulpfile.js');
        this.copy('webpack.config.babel.js', 'webpack.config.babel.js');
        //根据用户输入写入pkg信息
        var pkgTpl = _.template(this.fs.read(this.templatePath('_package.json')));
        this.fs.write(this.destinationPath('package.json'), pkgTpl(this.props));
    },
    generateClient: function () {
        this.log('generateClient');
        this.sourceRoot(path.join(__dirname, 'templates'));
        this.destinationPath('./');
    },
    end: function () {
        this.log(yosay(
            '项目构建完成ヾ(=･ω･=)o'
        ));
    }
});
module.exports = Reactpackage;