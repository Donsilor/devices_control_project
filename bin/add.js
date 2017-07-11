let chalk = require('chalk');
let path = require('path');
let fs = require('fs');
let Metalsmith = require('metalsmith');
let inquirer = require('inquirer');
let async = require('async');
let consolidate = require('consolidate');

function addReadMe(appName) {
    return new Promise((resolve) => {
        console.log(chalk.green(`正在为${appName}工程添加readme说明`));
        let file = path.join(__dirname, '../readme.md');
        fs.readFile(file, function (error, buffer) {
            if (error) throw error;
            let html = buffer.toString();
            if (html.indexOf(`dev:${appName}`) > -1 || html.indexOf(`build:${appName}`)> -1){
                console.log(chalk.red(`已存在${appName}的相关说明，不做任何修改`));
                resolve();
            }else{
                html = `### ${appName}\n\`\`\`\n\tnpm run dev:${appName} //开发\n\tnpm run build:${appName} //编译\n\`\`\`\n${html}`

                fs.writeFile(file, html, function (error) {
                    if (error) throw error;
                    console.log(chalk.red(`readme.md修改成功`));
                    resolve();
                })
            }
        });
    })
}

function addCommand(appName) {
    return new Promise((resolve) => {
        console.log(chalk.green(`正在为${appName}工程添加开发编译命令`));
        let file = path.join(__dirname, '../package.json');
        fs.readFile(file, function (error, buffer) {
            if (error) throw error;
            let html = buffer.toString();
            if (html.indexOf(`dev:${appName}`) > -1 || html.indexOf(`build:${appName}`)> -1){
                console.log(chalk.red(`已存在${appName}的相关命令，不做任何修改`));
                resolve();
            }else{
                html = html.replace(/\"scripts\"\s*:\s*\{/,function (matchContent) {
                    return `${matchContent}\n\t"dev:${appName}": "node build/dev-server.js --app=${appName} --appName=${appName}  --port=8081",\n\t"build:${appName}": "node build/build.js --app=${appName} --appName=${appName}",`
                });

                fs.writeFile(file, html, function (error) {
                    if (error) throw error;
                    console.log(chalk.red(`命令添加成功,查看package.json中scripts中的dev:${appName}和build:${appName}`));
                    resolve();
                })
            }
        });
    })
}


function renderTemplateFile(options) {
    return function (files, metalsmith, done) {
        let keys = Object.keys(files);
        async.each(keys, function (file, next) {
            var str = files[file].contents.toString();
            if (!/{{([^{}]+)}}/g.test(str)) {
                return next()
            }
            consolidate.atpl.render(str, options, function (error, res) {
                if (error) {
                    error.message = `[${file}] ${error.message}`;
                    return next(error);
                }
                files[file].contents = res;
                next();
            });
        }, done);
    }
}

function addProxy(appProxy, appName) {
    return new Promise((resolve, reject) => {
        console.log(chalk.green.bgBlack(`正在为[${appName}]工程添加mock`));
        console.log(chalk.green(`添加目录为: src/__global_iot_proxy/${appName}`));
        Metalsmith(path.join(__dirname, 'proxy-template'))
            .source('.')
            .use(renderTemplateFile({
                appName
            }))
            .destination(appProxy)
            .build(function (error) {
                if (error) throw error;
                console.log(chalk.red(`[${appName}]工程添加mock成功`))
                resolve();
            });
    });
}

function addApp(appPath, appName) {
    return new Promise((resolve, reject) => {
        console.log(chalk.green(`正在添加设备工程: ${appName}`));
        console.log(chalk.green(`添加目录为: src/${appName}`));
        Metalsmith(path.join(__dirname, 'app-template'))
            .source('.')
            .use(renderTemplateFile({
                appName
            }))
            .destination(appPath)
            .build(function (error) {
                if (error) throw error;
                console.log(chalk.red(`[${appName}]工程添加成功`))
                resolve();
            });
    })
}

function run(appPath, appProxy, appName) {
    addApp(appPath, appName).then(function () {
        addProxy(appProxy, appName).then(function () {
            addCommand(appName).then(function () {
                addReadMe(appName).then(function () {
                    console.log(chalk.green(`添加完成,运行npm run dev:${appName}即可查看相关页面`))
                })
            })
        })
    })
}

function add(appPath, appProxy, appName) {
    if (fs.existsSync(appPath)) {
        fs.readdir(appPath, function (error, files) {
            if (error) throw  error;
            if (files.length) {
                inquirer.prompt([{
                    type: 'confirm',
                    name: 'ok',
                    message: '当前目录部位不为空,是否清空目录继续?',
                    default: true
                }]).then(function (answers) {
                    if (answers.ok) {
                        run(appPath, appProxy, appName);
                    } else {
                        console.log(chalk.red(`已取消添加新的控制设备:`), chalk.green(` ${appName} `))
                    }
                })
            }
        })
    } else {
        run(appPath, appProxy, appName);
    }
}
module.exports = add;