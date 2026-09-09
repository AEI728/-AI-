import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectDir = dirname(scriptDir)
const builtFile = join(projectDir, 'dist', 'index.html')
const portableFile = join(projectDir, '银发AI私教APP.html')

const mimeByExtension = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  mp4: 'video/mp4',
}

let html = await readFile(builtFile, 'utf8')
const assetUrls = [...new Set(html.match(/https:\/\/(?:images\.unsplash\.com|interactive-examples\.mdn\.mozilla\.net)\/[^`"' )<]+/g) ?? [])]

for (const [index, assetUrl] of assetUrls.entries()) {
  const response = await fetch(assetUrl)
  if (!response.ok) {
    throw new Error(`下载资源失败 (${response.status}): ${assetUrl}`)
  }

  const bytes = Buffer.from(await response.arrayBuffer())
  const contentType = response.headers.get('content-type')?.split(';')[0]
  const extension = basename(new URL(assetUrl).pathname).split('.').pop()?.toLowerCase()
  const mime = contentType || mimeByExtension[extension] || 'application/octet-stream'
  const dataUrl = `data:${mime};base64,${bytes.toString('base64')}`
  html = html.replaceAll(assetUrl, dataUrl)
  process.stdout.write(`\r正在内嵌资源 ${index + 1}/${assetUrls.length}`)
}

html = html.replace(
  '<title>小伴 · 银发AI私教</title>',
  '<title>小伴 · 银发AI私教</title>\n    <meta name="portable-build" content="all-assets-inlined">',
)

await mkdir(dirname(portableFile), { recursive: true })
await writeFile(portableFile, html)
process.stdout.write(`\n已生成 ${portableFile}\n`)
