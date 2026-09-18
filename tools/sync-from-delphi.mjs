#!/usr/bin/env node
// O pacote Lazarus usa o MESMO fonte do núcleo e das telas nativas do pacote Delphi
// (Object Pascal que compila em Delphi 7+ e FPC). O espelho público precisa ser
// autossuficiente, então as units são copiadas para cá e versionadas.
//   node widgets-native/lazarus/tools/sync-from-delphi.mjs [--check]
// Edite sempre em widgets-native/delphi/ e rode este script; nunca edite as cópias.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const laz = dirname(dirname(fileURLToPath(import.meta.url)))
const delphi = resolve(laz, '../delphi')
const check = process.argv.includes('--check')

// [origem em delphi/, destino em lazarus/, filtro]
const MAP = [
  // BFocusHttpNet é só do Delphi 10.4+ (System.Net.HttpClient).
  ['source/core', 'source/core', (f) => /\.(pas|inc)$/.test(f) && f !== 'BFocusHttpNet.pas'],
  ['source/common', 'source/common', (f) => f.endsWith('.pas')],
  ['source/native', 'source/native', (f) => f.endsWith('.pas')],
  ['tests', 'tests', (f) =>
    ['BFocusTestKit.pas', 'BFocusCoreTests.pas', 'BFocusVMTests.pas', 'BFocusIntegrationTests.pas',
      'run-tests.mjs'].includes(f)],
  ['tests/conformance', 'tests/conformance', () => true],
  ['examples/d7-native', 'examples/native-demo', (f) => f === 'DemoNativeMain.pas'],
  ['tools', 'tools', (f) => f === 'check-sources.mjs'],
]

if (!existsSync(delphi)) {
  console.log('pacote Delphi fora do alcance (espelho): mantendo as cópias')
  process.exit(0)
}
let stale = 0
let copied = 0
for (const [from, to, keep] of MAP) {
  const src = join(delphi, from)
  if (!existsSync(src)) continue
  const dst = join(laz, to)
  mkdirSync(dst, { recursive: true })
  for (const f of readdirSync(src)) {
    if (!keep(f)) continue
    const data = readFileSync(join(src, f))
    const out = join(dst, f)
    if (check) {
      if (!existsSync(out) || !readFileSync(out).equals(data)) {
        console.error(`desatualizado: ${out}`)
        stale++
      }
    } else {
      writeFileSync(out, data)
      copied++
    }
  }
}
if (check) {
  if (stale) {
    console.error('Rode: node widgets-native/lazarus/tools/sync-from-delphi.mjs')
    process.exit(1)
  }
  console.log('cópias do Delphi em dia')
} else console.log(`${copied} arquivo(s) copiado(s) de ${delphi}`)
