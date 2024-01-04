const WebpackAutoInject = require('webpack-auto-inject-version');

module.exports = {
  publicPath: "/",
  lintOnSave: true,
  runtimeCompiler: true,
  filenameHashing: true,
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    devtool: "source-map",
    /*
    plugins: [new BundleAnalyzerPlugin()],
    */
    plugins: [
        new WebpackAutoInject({
        // specify the name of the tag in the outputed files eg
        // bundle.js: [SHORT]  Version: 0.13.36 ...
        SHORT: 'CUSTOM',
        SILENT: true,
        PACKAGE_JSON_PATH: './package.json',
        PACKAGE_JSON_INDENT: 4,
        components: {
          AutoIncreaseVersion: true,
          InjectAsComment: true,
          InjectByTag: true
        },
        componentsOptions: {
          AutoIncreaseVersion: {
            runInWatchMode: false // it will increase version with every single build!
          },
          InjectAsComment: {
            tag: 'Version: {version} - {date}',
            dateFormat: 'dddd, mmmm dS, yyyy, h:MM:ss TT', // change timezone: `UTC:h:MM:ss` or `GMT:h:MM:ss`
            multiLineCommentType: false, // use `/** */` instead of `//` as comment block
          },
          InjectByTag: {
            fileRegex:  /\.+/,
            // regexp to find [AIV] tag inside html, if you tag contains unallowed characters you can adjust the regex
            // but also you can change [AIV] tag to anything you want
            AIVTagRegexp: /(\[AIV])(([a-zA-Z{} ,:;!()_@\-"'\\\/])+)(\[\/AIV])/g,
            dateFormat: 'yyyy-mm-dd hh:MM:ss TT'
            //dateFormat: 'dddd, mmmm dS, yyyy, h:MM:ss TT'
          }
        },
        LOGS_TEXT: {
          AIS_START: 'DEMO AIV started'
        }
        })

    ],
    resolve: {
      alias: {
       // moment: 'moment/src/moment'
      }
    }
  },   
}
