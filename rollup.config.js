import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import serve from 'rollup-plugin-serve'
import postcss from 'rollup-plugin-postcss'
import replace from '@rollup/plugin-replace'
import postcssPresetEnv from 'postcss-preset-env'

import { resolve as Rresolve } from 'path'

import pkg from './package.json' assert { type: 'json' }

// 这是styleinject到head中的唯一名称(全英文不能有点)
const styledUniqueName = pkg.name
const funcName = pkg.name

const styleInjectPath = Rresolve('styleInject').replace(/[\\/]+/g, '/')

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
        // 这里使用自定义的inject，原版的问题很大
        inject: (css, _id) => {
          return `\nimport styleInject from '${styleInjectPath}';\nstyleInject(${css},'${styledUniqueName}');`
        },
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
