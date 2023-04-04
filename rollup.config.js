import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

export default {
  input: 'app/source.js',
  output: {
    file: 'app/bundle.js',
    format: 'iife',
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
};
