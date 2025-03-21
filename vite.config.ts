// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
	build: {
		outDir: "dist",
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "transaction-sms-parser",
			fileName: "lib",
		},
	},
	plugins: [
		dts({
			copyDtsFiles: true,
			strictOutput: true,
		}),
	],
});
