const fs            = require('fs')
const path          = require('path')

const flatten = arr => arr.reduce( ( acc, val ) =>
      acc.concat( Array.isArray( val ) ? flatten( val ) : val ), [] )

Array.prototype.flatten = function() { return flatten( this ) }

// recursively traverse all files in dir and return their flattened absolute path as an array
const walkSync = dir => fs.readdirSync( dir )
  .map(file => fs.statSync( path.join( dir, file ) ).isDirectory() ?
    walkSync( path.join( dir, file ) ) :
    path.join( dir, file ).replace( /\\/g, '/' ) ).flatten()

module.exports = {
  selectFiles: ( dirPath, extension ) =>
    walkSync( path.resolve( dirPath ) ).filter(
      fileName => fileName.endsWith( extension )
    )
}
