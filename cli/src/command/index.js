const { program, Option } = require('commander');
const Config = require('../config');

module.exports = () => {
    program
        .command('create')
        .argument('<name>', '项目名称')
        .addOption(
            new Option("-m, --mode [mode]", '生成项目的模式').default( Config.Mode.Default).choices(
                Config.Mode.List
            )
        )
        .option('-d, --dest <dest>', '生成项目所在的目录')
        .description('以指定的模式在指定的目录下创建项目')
        .action((name, options, command) => {
            console.log(name, options, command.name());
        });

};
