import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TESTS_DIR = __dirname

// Find all files ending with `.test.ts`
const testFiles = fs.readdirSync(TESTS_DIR).filter(file => file.endsWith('.test.js'))

for (const file of testFiles) {
  console.log(`\n📄 Running tests in: ${file}`)

  // Convert to file:// URL to fix Windows paths
  const filePath = pathToFileURL(path.join(TESTS_DIR, file)).href

  await import(filePath)
}
