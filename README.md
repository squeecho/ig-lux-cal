# iggg-lux

> iggg studio 간이 조도 계산기 PRO.
> 기존 `iggg-lighting`의 후속작. 계산식 정밀화 + IGGG Design System v1.1 적용.

---

## 주요 변경점 (vs `iggg-lighting`)

### 1. 계산식 정밀화

**기존:**
```
E = Σlm × UF(높이) × MF(0.8) / A
```
- UF가 천장 높이만 보고, 면적 무관 → 큰 공간일수록 과대 추정

**신규:**
```
E   = (Σlm × adj) × UF × MF / A
UF  = baseUF(K) × interiorTone
K   = √A / (2h)             (실지수, 정사각형 가정)
MF  = 공간별 자동 (주방 0.70 / 일반 F&B 0.80 / 청결 0.85)
adj = 0.7 if 간접조명 else 1
```

| 개선 | 효과 |
|---|---|
| 실지수 K 도입 | 면적 + 높이 함께 반영 — 공간 형상 정확도 ↑ |
| 인테리어 톤 보정 | 밝음(×1.00) / 보통(×0.85) / 어두움(×0.70) — F&B 다크톤 매장 정확도 ↑ |
| 공간별 MF 자동 | 주방 기름때 등 보수율 차이 반영 |

### 2. 구조 정리

- 1138줄 단일 컴포넌트 → 9개 컴포넌트 분할
- 조명 카탈로그(47개) → `src/data/lights.ts`로 분리
- 계산 로직 → `src/lib/lighting.ts` 순수 함수
- 죽은 코드(`useLongPress`) 제거
- 재사용 컴포넌트 `NumberInput` / `QtyAdjust` 도입

### 3. 디자인 (v1.1)

- 다크/라이트 테마 토글 + 시스템 fallback
- Pretendard + Inter + JetBrains Mono 3종
- v1.1 토큰 (다크 입력칸 #2d2d2d 등)
- Tailwind config 인라인 매핑으로 코드 손대지 않고 토큰 적용

---

## 폴더 구조

```
iggg-lux/
├── index.html            # v1.1 토큰 + Tailwind 매핑 + 테마 토글
├── package.json
├── public/
│   ├── logo.png
│   ├── Thumb.png
│   └── images/lights/    # 조명 썸네일
└── src/
    ├── main.tsx
    ├── App.tsx           # 상태 hub + 컴포넌트 조립
    ├── App.css
    ├── index.css
    ├── types.ts          # 타입 정의
    ├── data/
    │   └── lights.ts     # 47개 조명 + 프리셋 + UF표
    ├── lib/
    │   └── lighting.ts   # 계산 순수 함수
    └── components/
        ├── Hero.tsx
        ├── Footer.tsx
        ├── SpaceInput.tsx
        ├── LightPicker.tsx
        ├── CustomLight.tsx
        ├── SavedLights.tsx
        ├── ResultCard.tsx
        ├── SelectedList.tsx
        ├── SavedResults.tsx
        └── NumberInput.tsx
```

---

## 검증 시뮬레이션

5케이스 모두 실무 감각과 부합:

| 사례 | 면적 | 높이 | 조명 | 톤 | 결과 | 목표 |
|---|---|---|---|---|---|---|
| 카페 다운라이트 10개 | 20m² | 2.5m | 580lm × 10 | 보통 | 108lx | 250 (43%) |
| 술집 라인 8개 | 50m² | 3.0m | 2700lm × 8 | 어두움 | 150lx | 150 (100%) |
| 주방 평판 12개 | 80m² | 3.5m | 4500lm × 12 | 밝음 | 321lx | 600 (53%) |
| 침실 벌브 4개 | 12m² | 2.4m | 910lm × 4 | 보통 | 105lx | 150 (70%) |
| 큰 카페 다운라이트 30개 | 60m² | 2.8m | 580lm × 30 | 보통 | 134lx | 250 (53%) |

---

## 개발

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 생성
npm run preview  # 빌드 결과 로컬 확인
```

---

## 배포 (Vercel)

```bash
git init
git add .
git commit -m "init: iggg-lux v3.0"
git remote add origin git@github.com:squeecho/iggg-lux.git
git push -u origin main
```

GitHub 레포 연결 후 Vercel에서 Import → 자동 배포.

---

## 조명 카탈로그 추가/수정

`src/data/lights.ts` 의 `LIGHT_CATALOG` 배열에 항목만 추가하면 됨.

```ts
{
  name: '새 조명 이름',
  lumenByColorTemp: { '3000K': 800, '4000K': 850 },
  watt: 10,
  colorTemps: ['3000K', '4000K'],
  size: '3인치',
  category: '다운라이트',
  thumbnail: '/images/lights/new_light.png',
}
```

썸네일 이미지는 `public/images/lights/` 에 PNG로 추가.

---

**v3.0** — 2026.05 — IGGG STUDIO
