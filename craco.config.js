module.exports = {
    webpack: {
      configure: (webpackConfig, { env, paths }) => {
        // Fix for Stack Auth production build issues
        if (env === 'production') {
          // Ensure proper module resolution
          webpackConfig.resolve.fallback = {
            ...webpackConfig.resolve.fallback,
            "crypto": false,
            "stream": false,
            "buffer": false,
          };
  
          // Add specific handling for Stack Auth
          webpackConfig.module.rules.push({
            test: /node_modules\/@stackframe/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: "defaults" }],
                  ['@babel/preset-react', { runtime: 'automatic' }]
                ],
              }
            }
          });
  
          // Split Stack Auth into separate chunk
          if (webpackConfig.optimization.splitChunks) {
            webpackConfig.optimization.splitChunks.cacheGroups = {
              ...webpackConfig.optimization.splitChunks.cacheGroups,
              stackauth: {
                test: /[\\/]node_modules[\\/]@stackframe[\\/]/,
                name: 'stackauth',
                chunks: 'all',
                priority: 10,
              },
            };
          }
        }
  
        return webpackConfig;
      },
    },
  };