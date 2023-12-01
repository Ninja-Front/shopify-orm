import {common, frontend} from '@shelf/esbuild-config';

// Call the functions with your options
await common({
  entryPoints: ['src/index.ts'],
  target: ['esnext', 'node16'],
  // ...
});