import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import typescript from '@rollup/plugin-typescript'


export default [
  {
    input: './src/main.ts',
    output: {
      file: './test/index.js',
      format: 'umd',
      name: 'empty',
      sourcemap: true,
    },
    plugins: [
      typescript(),
      resolve({
        preferBuiltins: true,
        mainFields: ['browser', 'jsnext', 'module', 'main'],
      }),
      postcss({
        modules: {
          generateScopedName: '[local]___[hash:base64:5]',
        },
        plugins: [autoprefixer()],
        extract: 'css/index.css',
      }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.ts','.js'],
        exclude:'mode_modules/**',
      })
    ],
  },
]
