'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin'); 
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const paths = require('./paths');
const CssBlocks = require("@css-blocks/jsx");
const CssBlocksPlugin = require("@css-blocks/webpack").CssBlocksPlugin;
const jsxCompilationOptions = require('./jsxCompilationOptions');
const getClientEnvironment = require('./env'); 

// css block rewrite and analyzer
// analyzer is shared
const CssBlockRewriter = new CssBlocks.Rewriter(jsxCompilationOptions);
const CssBlockAnalyzer = new CssBlocks.Analyzer(paths.appIndexJs, jsxCompilationOptions);

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = ''; 
// Get environment variables to inject into our app. 
const env = getClientEnvironment(publicUrl); 

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
module.exports = {
  // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
  // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
  devtool: 'cheap-module-source-map',
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  // The first two entry points enable "hot" CSS and auto-refreshes for JS.
  entry: [
    // We ship a few polyfills by default: 
    require.resolve('./polyfills'), 
    // Include an alternative client for WebpackDevServer. A client's job is to 
    // connect to WebpackDevServer by a socket and get notified about changes. 
    // When you save a file, the client will either apply hot updates (in case 
    // of CSS changes), or refresh the page (in case of JS changes). When you 
    // make a syntax error, this client will display a syntax error overlay. 
    // Note: instead of the default WebpackDevServer client, we use a custom one 
    // to bring better experience for Create React App users. You can replace 
    // the line below with these two lines if you prefer the stock client: 
    // require.resolve('webpack-dev-server/client') + '?/', 
    // require.resolve('webpack/hot/dev-server'), 
    require.resolve('react-dev-utils/webpackHotDevClient'), 
    // Finally, this is your app's code:
    paths.appIndexJs,
    // We include the app code last so that if there is a runtime error during
    // initialization, it doesn't blow up the WebpackDevServer client, and
    // changing JS code would still trigger a refresh.
  ],
  output: {
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: 'bundle.js',
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: '[name].chunk.js',
    // This is the URL that app is served from. We use "/" in development.
    publicPath: publicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ['node_modules', paths.appNodeModules].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    // `web` extension prefixes have been added for better support
    // for React Native Web.
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
  },
  module: {
    strictExportPresence: true,
    rules: [
      // First, run the linter. 
      // It's important to do this before Babel processes the JS. 
      { 
        test: /\.(js|jsx|mjs)$/, 
        enforce: 'pre', 
        use: [ 
          { 
            options: { 
              formatter: eslintFormatter, 
              eslintPath: require.resolve('eslint'), 
               
            }, 
            loader: require.resolve('eslint-loader'), 
          }, 
        ], 
        include: paths.appSrc, 
      },
      {
        loader: require.resolve('babel-loader'),
        options: {
          plugins: [
            require('@css-blocks/jsx/dist/src/transformer/babel').makePlugin({
              rewriter: CssBlockRewriter
            }),
          ],
          cacheDirectory: false,
          compact: true,
          parserOpts: {
            plugins: [
              'jsx',
            ],
          }
        },
        include: paths.appSrc,
      },
      // The JSX Webpack Loader halts loader execution until after all blocks have
      // been compiled and template analyses has been run. StyleMapping data stored
      // in shared `rewriter` object.
      {
        loader: require.resolve('@css-blocks/webpack/dist/src/loader'),
        options: {
          analyzer: CssBlockAnalyzer,
          rewriter: CssBlockRewriter
        },
        include: paths.appSrc,
      },
    ],
  },
  plugins: [
    new CssBlocksPlugin({
      analyzer: CssBlockAnalyzer,
      outputCssFile: 'blocks.css',
      name: 'css-blocks',
      compilationOptions: jsxCompilationOptions.compilationOptions,
      optimization: jsxCompilationOptions.optimization,
    }),
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin(env.raw),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
  ],
};
