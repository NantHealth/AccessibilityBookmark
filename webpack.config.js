const path = require('path');
module.exports = {
    entry:"./index.js",
    output:  {
        path: path.resolve(__dirname, "dist"), // string
        filename: "bundle.js", // string
        publicPath: "/assets/", // string
        library: "AccessibilityBookmarklet", // string,
        // the name of the exported library
        libraryTarget: "umd"
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader'
            }
          },
          {
            test: /\.css$/,
            use: [
              'css-loader'
            ]
         }
        ]
      }
}