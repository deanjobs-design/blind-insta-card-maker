# Instagram 카드 템플릿 자동화 사이트 — Design Spec

**Date:** 2026-06-05  
**Status:** Approved

---

## 1. 프로젝트 개요

블라인드 인스타그램용 카드 이미지를 팀원들이 손쉽게 만들 수 있는 내부 웹 툴.  
텍스트/이미지를 입력하고 템플릿을 선택한 뒤 PNG 묶음을 ZIP으로 다운로드한다.

---

## 2. 기술 스택

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **카드 캡처:** `html2canvas`
- **ZIP 패키징:** `JSZip` + `file-saver`
- **배포:** Vercel (링크 공유용)
- **백엔드:** 없음 (전부 클라이언트 사이드)

---

## 3. 카드 템플릿 목록

피그마 원본 기준 1080×1350px (인스타그램 세로 포맷).

### 섹션 1 — 표지 (7종)
| ID | 이름 | 설명 |
|---|---|---|
| `photo_01` | 사진형 A | 전체 사진 + 하단 헤드라인 박스 |
| `photo_02` | 사진형 B | 전체 사진 + 하단 그라데이션 + 헤드라인 |
| `photo_text_01` | 사진+텍스트형 A | 상단 큰 타이틀 + 하단 이미지 |
| `photo_text_02` | 사진+텍스트형 B | 전체 사진 + 오버레이 텍스트 |
| `text_01` | 텍스트형 A | 로고 + 본문 텍스트만 |
| `text_02` | 텍스트형 B | 인용구 + 채널 정보 |
| `photo_comment` | 사진+게시물형 | 사진 배경 + 블라인드 게시물 미리보기 |

### 섹션 2 — 게시물 (1종)
| ID | 이름 | 설명 |
|---|---|---|
| `post` | 블라인드 게시물 | 채널 썸네일 + 본문 텍스트 |

### 섹션 3 — 게시물+댓글 (1종)
| ID | 이름 | 설명 |
|---|---|---|
| `post_comment` | 게시물+댓글 | 원글 + 댓글 2~3개 |

### 섹션 4 — 마지막 페이지 (1종)
| ID | 이름 | 설명 |
|---|---|---|
| `last_page` | 팔로우 유도 | 팔로우 CTA 텍스트 + 일러스트 |

---

## 4. 사용자 플로우

```
① 상단 탭에서 카드 타입 선택 (표지 / 게시물 / 게시물+댓글 / 마지막페이지)
② 템플릿 썸네일 중 하나 클릭하여 선택
③ 좌측 입력 폼에서 텍스트/이미지 입력
④ 우측 실시간 미리보기로 결과 확인
⑤ 카드 추가/제거하여 다운로드할 세트 구성
⑥ "ZIP 다운로드" 클릭 → 선택된 카드 전부 PNG로 렌더링 후 ZIP 저장
```

---

## 5. 화면 레이아웃

```
┌─────────────────────────────────────────────┐
│  [표지] [게시물] [게시물+댓글] [마지막페이지]  ← 탭
├──────────────────┬──────────────────────────┤
│                  │                          │
│  입력 폼          │   카드 미리보기           │
│                  │   (1080×1350 축소)        │
│  · 텍스트 필드    │                          │
│  · 이미지 업로드  │                          │
│  · 색상 선택      │                          │
│                  │                          │
│  [+ 세트에 추가]  │                          │
│                  │                          │
├──────────────────┴──────────────────────────┤
│  다운로드 세트: [card1] [card2] [card3]  [ZIP 다운로드] │
└─────────────────────────────────────────────┘
```

---

## 6. 컴포넌트 구조

```
app/
  page.tsx                  ← 메인 페이지 (레이아웃 조합)
  layout.tsx

components/
  Editor/
    TemplateSelector.tsx    ← 탭 + 썸네일 그리드
    InputPanel.tsx          ← 템플릿별 동적 입력 폼
    PreviewPanel.tsx        ← 카드 미리보기 + 스케일 조정
    DownloadBar.tsx         ← 세트 구성 + ZIP 다운로드 버튼

  Templates/
    cover/
      Photo01.tsx
      Photo02.tsx
      PhotoText01.tsx
      PhotoText02.tsx
      Text01.tsx
      Text02.tsx
      PhotoComment.tsx
    Post.tsx
    PostComment.tsx
    LastPage.tsx

  ui/                       ← 공통 UI 컴포넌트 (버튼, 탭 등)

lib/
  exportCard.ts             ← html2canvas 래퍼
  createZip.ts              ← JSZip + file-saver 래퍼
  templateConfig.ts         ← 템플릿 메타데이터 (입력 필드 정의)

public/
  assets/
    logo.png                ← 블라인드 로고 (별도 전달 예정)
```

---

## 7. 템플릿 입력 필드 정의

각 템플릿은 `templateConfig.ts`에서 입력 필드를 선언형으로 정의한다.

```ts
type FieldType = 'text' | 'textarea' | 'image' | 'color'

interface TemplateConfig {
  id: string
  name: string
  fields: { key: string; label: string; type: FieldType }[]
}
```

예시 — `photo_01`:
- `headline`: textarea — 헤드라인 텍스트
- `mainImage`: image — 배경 사진

---

## 8. 카드 렌더링 & 다운로드

- 카드 컴포넌트는 항상 실제 1080×1350px 기준으로 렌더링 (CSS transform: scale로 미리보기)
- `html2canvas({ scale: 1, width: 1080, height: 1350 })`로 PNG 캡처
- 여러 장 순차 캡처 후 `JSZip`으로 묶어 `cards.zip` 다운로드

---

## 9. 배포

- Vercel 무료 티어로 배포
- 환경변수 없음 (모든 처리 클라이언트)
- 팀원에게 URL 공유로 즉시 사용 가능
