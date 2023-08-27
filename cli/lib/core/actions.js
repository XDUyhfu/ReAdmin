const { promisify } = require( 'util' );
const download = promisify( require( 'download-git-repo' ) );
const { defaultRepo } = require( '../config/repo-config' );
const { commandSpawn } = require( '../utils/terminal' );
const { compile, writeToFile } = require( '../utils/utils' );

const createProjectAction = async ( project ) => {

    // 1. clone 
    download( defaultRepo, project, { clone: true } );
    // 2. npm install
    await commandSpawn( "pnpm", [ "install" ], { cwd: `./${ project }` } );
    // 3. run
    await commandSpawn( "pnpm", [ "dev" ], { cwd: `./${ project }` } );
    // 4. open 
};

const createComponentAction = async ( name ) => {
    // 对应的ejs模版
    // 编译ejs模版
    // 将模版写入 tsx
    // 放入文件夹中

    const result = await compile( { name } );
    writeToFile( name, result );
};

module.exports = {
    createProjectAction,
    createComponentAction
};