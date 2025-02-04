import { defineConfig } from 'rolldown';
import {AssetPathKind} from "./shared/index";

export default defineConfig([
    {
        input: 'src/client/index.ts',
        resolve: {
            tsconfigFilename:"./tsconfig.json"
        },
        output: {
            file: AssetPathKind.ClientApplication,
        },
        platform: "browser",
    },
    {
        external: [
            /^node:/
        ],
        input: 'src/server/index.ts',
        output: {
            file: AssetPathKind.ServerApplication,
        },
        platform: "node"
    }
]);