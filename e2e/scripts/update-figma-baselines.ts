import * as fs from 'node:fs'
import * as path from 'node:path'
// .env 파일에서 환경변수 로드 (node 내장 모듈만 사용)
function loadEnv() {
  const envPath = path.resolve(import.meta.dirname, '../../.env')
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIndex = trimmed.indexOf('=')
      if (eqIndex === -1) continue
      const key = trimmed.slice(0, eqIndex).trim()
      const value = trimmed.slice(eqIndex + 1).trim()
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  }
}

loadEnv()

const PAGES_DIR = path.resolve(import.meta.dirname, '../../src/pages')
const SCREENSHOTS_DIR = path.resolve(import.meta.dirname, '../__screenshots__')
const FILE_KEY = '4rJmEFUU2HMWVy3qUcYZRs'

/**
 * 페이지 파일명 → 시각적 테스트 spec 파일명 + 스크린샷 이름 매핑
 * snapshotPathTemplate: {testDir}/__screenshots__/{testFilePath}/{arg}{ext}
 * 예: e2e/__screenshots__/visual/auth.visual.spec.ts/login.png
 */
const PAGE_TO_SPEC: Record<string, string> = {
  LoginPage: 'auth.visual.spec.ts',
  SignupPage: 'auth.visual.spec.ts',
  SignupSelectPage: 'auth.visual.spec.ts',
  HomePage: 'home.visual.spec.ts',
  CommunityListPage: 'community.visual.spec.ts',
  CommunityDetailPage: 'community.visual.spec.ts',
  CommunityWritePage: 'community.visual.spec.ts',
  CommunityEditPage: 'community.visual.spec.ts',
  QnaListPage: 'qna.visual.spec.ts',
  QnaDetailPage: 'qna.visual.spec.ts',
  QnaWritePage: 'qna.visual.spec.ts',
  QnaEditPage: 'qna.visual.spec.ts',
  MypagePage: 'mypage.visual.spec.ts',
  MypageEditPage: 'mypage.visual.spec.ts',
  ChangePasswordPage: 'mypage.visual.spec.ts',
  QuizListPage: 'quiz.visual.spec.ts',
  QuizExamPage: 'quiz.visual.spec.ts',
  QuizResultPage: 'quiz.visual.spec.ts',
}

interface FigmaMapping {
  pageName: string
  screenshotName: string
  specFile: string
  nodeId: string
  baselinePath: string
  baselineExists: boolean
}

function extractFigmaInfo(filePath: string): { url: string; nodeId: string }[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const regex = /@figma\s+.+?(https:\/\/www\.figma\.com\/design\/[^\s]+)/g
  const results: { url: string; nodeId: string }[] = []
  let match

  while ((match = regex.exec(content)) !== null) {
    const url = match[1]
    const nodeIdMatch = url.match(/node-id=([^&]+)/)
    if (nodeIdMatch) {
      results.push({ url, nodeId: nodeIdMatch[1] })
    }
  }

  return results
}

function getScreenshotName(fileName: string): string {
  return fileName
    .replace(/Page$/, '')
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
}

function scanPages(): FigmaMapping[] {
  const mappings: FigmaMapping[] = []

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.name.endsWith('.tsx')) {
        const figmaInfos = extractFigmaInfo(fullPath)
        const pageName = path.basename(fullPath, '.tsx')
        const specFile = PAGE_TO_SPEC[pageName]

        if (!specFile || figmaInfos.length === 0) continue

        // 첫 번째 Figma 링크만 사용 (대표 디자인)
        const info = figmaInfos[0]
        const screenshotName = getScreenshotName(pageName)
        const baselinePath = path.join(
          SCREENSHOTS_DIR,
          'visual',
          specFile,
          `${screenshotName}.png`
        )

        mappings.push({
          pageName,
          screenshotName,
          specFile,
          nodeId: info.nodeId,
          baselinePath,
          baselineExists: fs.existsSync(baselinePath),
        })
      }
    }
  }

  walk(PAGES_DIR)
  return mappings
}

async function downloadScreenshot(
  nodeId: string,
  savePath: string,
  token: string
): Promise<boolean> {
  try {
    // Figma API: node-id는 '-' 구분자를 ':' 으로 변환
    const apiNodeId = nodeId.replace('-', ':')
    const url = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${apiNodeId}&format=png&scale=1`

    const response = await fetch(url, {
      headers: { 'X-Figma-Token': token },
    })

    if (!response.ok) {
      console.error(
        `  API 요청 실패: ${response.status} ${response.statusText}`
      )
      return false
    }

    const data = (await response.json()) as {
      images: Record<string, string | null>
    }
    const imageUrl = data.images[apiNodeId]

    if (!imageUrl) {
      console.error(`  이미지 URL을 가져올 수 없습니다`)
      return false
    }

    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      console.error(`  이미지 다운로드 실패: ${imageResponse.status}`)
      return false
    }

    const buffer = Buffer.from(await imageResponse.arrayBuffer())
    fs.mkdirSync(path.dirname(savePath), { recursive: true })
    fs.writeFileSync(savePath, buffer)
    return true
  } catch (error) {
    console.error(`  다운로드 에러: ${error}`)
    return false
  }
}

async function main() {
  const token = process.env.FIGMA_TOKEN
  const mappings = scanPages()
  const isDownloadMode = token && process.argv.includes('--download')

  console.log('\n📋 Figma → Baseline 매핑 현황\n')
  console.log(
    'Page'.padEnd(25) + 'Spec'.padEnd(30) + 'NodeId'.padEnd(15) + 'Status'
  )
  console.log('-'.repeat(80))

  let missing = 0
  for (const m of mappings) {
    const status = m.baselineExists ? '✅' : '❌'
    if (!m.baselineExists) missing++
    console.log(
      m.screenshotName.padEnd(25) +
        m.specFile.padEnd(30) +
        m.nodeId.padEnd(15) +
        status
    )
  }

  console.log(`\n총 ${mappings.length}개 페이지, ${missing}개 baseline 누락\n`)

  if (isDownloadMode) {
    // --pages login,signup 형태로 특정 페이지만 지정 가능
    const pagesArgIndex = process.argv.indexOf('--pages')
    const pageFilter =
      pagesArgIndex !== -1 && process.argv[pagesArgIndex + 1]
        ? process.argv[pagesArgIndex + 1].split(',').map((p) => p.trim())
        : null

    let targets: FigmaMapping[]
    if (pageFilter) {
      targets = mappings.filter((m) =>
        pageFilter.some(
          (p) =>
            m.screenshotName.includes(p) ||
            m.pageName.toLowerCase().includes(p.toLowerCase())
        )
      )
    } else if (process.argv.includes('--all')) {
      targets = mappings
    } else {
      targets = mappings.filter((m) => !m.baselineExists)
    }

    if (targets.length === 0) {
      console.log(
        pageFilter
          ? `❌ "${pageFilter.join(', ')}"에 매칭되는 페이지가 없습니다.`
          : '✅ 모든 baseline이 존재합니다. 다운로드할 항목이 없습니다.'
      )
      return
    }

    console.log(`\n📥 ${targets.length}개 스크린샷 다운로드 시작...\n`)

    let success = 0
    for (const m of targets) {
      process.stdout.write(`  ${m.screenshotName}... `)
      const ok = await downloadScreenshot(m.nodeId, m.baselinePath, token)
      if (ok) {
        console.log('✅')
        success++
      } else {
        console.log('❌')
      }
    }

    console.log(`\n완료: ${success}/${targets.length}개 다운로드 성공\n`)
  } else if (missing > 0) {
    console.log('💡 Baseline 다운로드 방법:')
    console.log(
      '   pnpm test:visual:update-baseline -- --download              (누락분만)'
    )
    console.log(
      '   pnpm test:visual:update-baseline -- --download --all        (전체 재다운로드)'
    )
    console.log(
      '   pnpm test:visual:update-baseline -- --download --pages login,signup  (특정 페이지만)'
    )
    console.log('\n   FIGMA_TOKEN은 .env 파일에 설정하거나 환경변수로 전달')
  }
}

main()
