import esbuild from 'esbuild';
import { GasPlugin } from 'esbuild-gas-plugin';

esbuild
  .build({
    entryPoints: ['./src/main.ts'],
    outfile: './build/main.js',
    bundle: true,
    minify: true,
    plugins: [GasPlugin],
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
