import path from 'path'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias'
import vue from 'rollup-plugin-vue'
import serve from 'rollup-plugin-serve'
import { uglify } from 'rollup-plugin-uglify'
import css from 'rollup-plugin-css-only'
import requireContext from 'rollup-plugin-require-context'

const packages = require('./package.json')

const env = process.env.NODE_ENV

const fileNames = {
    development: `${packages.name}.js`,
    production: `${packages.name}.min.js`
};

const fileName = fileNames[env]

export default {
    input: 'src/index.js',
    output: {
        file: `dist/${fileName}`,
        format: 'iife',
        globals: {
            "@babel/runtime/regenerator": "regeneratorRuntime"
        }
    },
    watch: {
        exclude: 'node_modules/**'
    },
    external: ['vue', 'swiper'],
    plugins: [
        alias({
            resolve: ['.js', '.vue'],
            entries: {
                '@': path.resolve(__dirname, 'src')
            }
        }),
        vue({
            css: false
        }),
        requireContext(),
        commonjs(),
        babel({
            babelHelpers: "runtime",          
            exclude: "node_modules/**"
        }),
        resolve({
            browser: true
        }),
        json(),
        css({
            output: 'dist/bundle.css'
        }),
        replace({
            exclude: 'node_modules/**',
            ENV: JSON.stringify(process.env.NODE_ENV),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        (env === 'production' && uglify()),
        serve('dist')
    ],
};
