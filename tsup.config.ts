// @ts-check
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  clean: true,
  dts: true,
  outDir: 'lib',
  cjsInterop: true,
  format: [ "cjs", "esm" ],
  noExternal: [ /(.*)/ ]
})
