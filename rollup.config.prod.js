const path = require('path')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const json = require('rollup-plugin-json')
const { terser } = require('rollup-plugin-terser')
const vue = require('rollup-plugin-vue')
const postcss = require('rollup-plugin-postcss')

const inputPath = path.resolve(__dirname, './src/index.js')
const outputUmdPath = path.resolve(__dirname, './dist/lyzh.admin.vue.components.min.js')
const outputEsPath = path.resolve(__dirname, './dist/lyzh.admin.vue.components.es.min.js')

module.exports = {
  input: inputPath,
  output: [
    {
      file: outputUmdPath,
      format: 'umd',
      name: 'lyzhAdminVueComp',
      globals: {
        vue: 'vue'
      }
    },
    {
      file: outputEsPath,
      format: 'es',
      globals: {
        vue: 'vue'
      }
    }
  ],
  plugins: [
    vue(),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      plugins: [
        [
          '@babel/transform-runtime',
          {
            regenerator: true
          }
        ]
      ]
    }),
    json(),
    postcss({
      plugins: []
    }),
    terser()
  ],
  external: ['vue']
}
