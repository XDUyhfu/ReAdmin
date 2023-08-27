module.exports = {
    // 包含 re-cli 的基本信息
    Info: {
        Name: 're-cli',
        Descriptions: 're-admin cli by @yhfu',
        Version: require('../../package.json').version
    },
    Mode: {
        Default: 'project',
        List: ['project', 'component', 'hook', 'lib']
    }
};
