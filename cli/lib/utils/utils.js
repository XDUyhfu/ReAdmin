const ejs = require( 'ejs' );
const path = require( 'path' );
const fs = require( 'fs' );
const program = require( 'commander' );

const compile = ( data ) => {
    const templatePath = path.resolve( __dirname, `../templates/component.react.ejs` );

    return new Promise( ( resolve, reject ) => {
        ejs.renderFile( templatePath, { data }, {}, ( err, result ) => {
            if ( err ) {
                reject( err );
            }
            resolve( result );
        } );
    } );
};

const writeToFile = ( name, content ) => {
    // @ts-ignore
    const writeFilePath = path.resolve( __dirname, program.desc ?? `../components/${ name }.jsx` );

    fs.writeFileSync( writeFilePath, content );
};

const createDirSync = ( contentPath ) => {
    if ( fs.existsSync( contentPath ) ) return;
    const prePath = path.dirname( contentPath );
    createDirSync( prePath );
    fs.mkdirSync( contentPath );
};

module.exports = { compile, writeToFile };