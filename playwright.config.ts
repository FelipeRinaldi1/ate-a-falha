import { defineConfig, devices } from '@playwright/test'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

function resolveChromiumExecutable(): string | undefined {
	const cacheDir = path.join(os.homedir(), '.cache', 'ms-playwright')
	if (!fs.existsSync(cacheDir)) return undefined

	const entries = fs
		.readdirSync(cacheDir)
		.filter((d) => d.startsWith('chromium-'))
		.sort()
		.reverse()
	for (const entry of entries) {
		const candidate = path.join(cacheDir, entry, 'chrome-linux64', 'chrome')
		if (fs.existsSync(candidate)) {
			return candidate
		}
	}
	return undefined
}

const chromiumExecutablePath = resolveChromiumExecutable()

export default defineConfig({
	testDir: './e2e/specs',
	testMatch: '**/*.e2e.ts',
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: 1,
	timeout: 60000,
	expect: {
		timeout: 15000,
	},
	reporter: [['list'], ['html', { open: 'never' }]],
	use: {
		baseURL: 'http://localhost:3000',
		viewport: { width: 390, height: 844 },
		trace: process.env.CI ? 'retain-on-failure' : 'on',
		screenshot: 'on',
		launchOptions: chromiumExecutablePath
			? {
					executablePath: chromiumExecutablePath,
				}
			: undefined,
	},
	projects: [
		{
			name: 'mobile-chromium',
			use: {
				...devices['Pixel 7'],
				viewport: { width: 390, height: 844 },
			},
		},
	],
	webServer: [
		{
			command: 'npm run dev -w apps/api',
			url: 'http://localhost:3333/health',
			reuseExistingServer: !process.env.CI,
			timeout: 60000,
			env: {
				...process.env,
				NODE_ENV: 'test',
				PORT: '3333',
			},
		},
		{
			command: 'npm run dev -w apps/web',
			url: 'http://localhost:3000',
			reuseExistingServer: !process.env.CI,
			timeout: 60000,
			env: {
				...process.env,
				VITE_API_URL: 'http://localhost:3333/api/v1',
			},
		},
	],
})
