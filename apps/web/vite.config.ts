import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	// Dev server configuration
	server: {
		port: 5173,
		// Proxy API requests to backend during local development
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
		},
	},
	// Build optimizations
	build: {
		// Disable source maps in production for smaller bundle size
		sourcemap: false,
		// Manual chunks for better caching
		rollupOptions: {
			output: {
				manualChunks: {
					// Separate React vendor bundle for better caching
					react: ["react", "react-dom"],
				},
			},
		},
	},
});
