import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'ShapeRQ',
            formats: ['es', 'cjs'],
            fileName: (format) => (format === 'cjs' ? 'index.cjs' : 'index.js'),
        },
        outDir: 'dist',
    },
    plugins: [
        dts({
            entryRoot: 'src',
            outDir: 'dist',
            insertTypesEntry: true,
        }),
    ],
});
