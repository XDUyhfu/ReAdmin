const { program } = require('commander');
const Config = require('../config');

module.exports = () => {
    program.helpOption('-d, --dest <dest>', '生成项目所在的目录');
    program.helpOption('-m, --mode [mode]', `生成项目的模式, 默认值为 ${Config.Mode.Default}, 可选项为: [${Config.Mode.List.join(',')}]`,);
    program.helpOption('-v, --version', 're-cli 版本信息');
    program.helpOption('-h, --help', 're-cli 帮助信息');
};
