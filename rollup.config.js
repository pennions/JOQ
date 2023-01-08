import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/joq.ts',
    output: {
        name: 'joq',
        file: 'dist/joq.js',
        format: 'umd'
    },
    output: {
        name: 'joq',
        file: 'dist/joq.es.js',
        format: 'es'
    },
    plugins: [typescript()]
};