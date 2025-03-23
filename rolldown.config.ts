import { defineConfig } from 'rolldown';

export default defineConfig([
    {
        input: './app/main.ts',
        resolve: { tsconfigFilename:"./tsconfig.json" },
        output: {
            file: "./static/index.js",
        },
        platform: "browser",
    }
]);