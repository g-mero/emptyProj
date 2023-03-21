import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import postcss from 'rollup-plugin-postcss'
import cssnano from 'cssnano'
import dts from 'rollup-plugin-dts'
import replace from '@rollup/plugin-replace'
import postcssPresetEnv from 'postcss-preset-env'



import pkg from './package.json' assert { type : 'json' }

// 拿到package.json的name属性来动态设置打包名称
const libName = pkg.name;
// iife umd 等格式需要name来作为浏览器windows下的函数名
const funcName = libName

export default [{
  input: './src/main.ts',
  output: [
    {
      file: `./dist/${libName}.min.js`,
      format: 'iife',
      name: funcName,
      sourcemap: false,
    },
    {
      file: `./dist/${libName}.umd.js`,
      format: 'umd',
      name: funcName,
      sourcemap: false,
    },
  ],
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
        generateScopedName: 'gcss_[hash:base64:5]',
      },
      plugins: [postcssPresetEnv(), cssnano()],
      // extract: 'gmero-comment.min.css', 如果你想导出css而不是css in js
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      exclude: 'mode_modules/**',
    }),
    terser(),
  ],
},{
  input: './src/main.ts',
  output: [{ file: "dist/index.d.ts", format: "cjs" }],
  plugins: [dts()],
}]
