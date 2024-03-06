// @ts-check
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: true,
  clean: true,
  dts: true,
  cjsInterop: true,
  format: [ "cjs", "esm" ]
})
