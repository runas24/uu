import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'

// Рекурсивная функция для поиска HTML файлов
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = resolve(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      findHtmlFiles(filePath, fileList)
    } else if (file.endsWith('.html')) {
      fileList.push(filePath)
    }
  })

  return fileList
}

export default defineConfig({
  base: '/oo/', // Путь к вашему репозиторию на GitHub Pages
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: findHtmlFiles('src').reduce((acc, filePath) => {
        const relativePath = filePath.substring(filePath.indexOf('src') + 4).replace(/\\/g, '/')
        acc[relativePath.replace('.html', '')] = filePath
        return acc
      }, {}),
    },
    assetsDir: 'assets', // Явно указываем директорию для ассетов
  },
  server: {
    port: 3000,
    open: true,
  },
})