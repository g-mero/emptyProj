import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import serve from 'rollup-plugin-serve'
import postcss from 'rollup-plugin-postcss'
import replace from '@rollup/plugin-replace'
import postcssPresetEnv from 'postcss-preset-env'


import pkg from './package.json' assert { type: 'json' }

const funcName = pkg.name

export default [
  {
    input: './src/main.ts',
    output: {
      file: './test/index.js',
      format: 'iife',
      name: funcName,
      sourcemap: true,
    },
    plugins: [
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      replace({
        // 版本号自动替换
        __VERSION__: JSON.stringify(pkg.version),
        preventAssignment: true,
      }),
      postcss({
        modules: {
          generateScopedName: '[local]___[hash:base64:5]',
        },
        plugins: [postcssPresetEnv()],
        // extract: 'css/index.css',
      }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        exclude: 'mode_modules/**',
      }),
      serve({
        contentBase: ['test', 'lib'],
      }),
    ],
  },
]
