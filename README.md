# 🌱 그로우몬 (Grow-Mon): 90일의 여정

초등학교 고학년을 위한 식물 재배 일지 기록 웹 애플리케이션입니다.
90일 동안 식물을 키우며 매일 기록하면, 캐릭터가 6단계로 진화합니다!

![그로우몬 로고](https://via.placeholder.com/800x200/4ADE80/FFFFFF?text=Grow-Mon)

## ✨ 주요 기능

### 📊 메인 대시보드
- **6단계 진화 시스템**: 알 → 새싹 → 줄기와 잎 → 꽃 → 열매 → 요정
- **경험치 바**: 90일 중 현재 진행도를 시각적으로 표시
- **실시간 통계**: 총 일기 개수, 남은 일수, 다음 진화까지 필요한 일기 수
- **격려 메시지**: 진행도에 따라 달라지는 응원 메시지

### 📅 월별 캘린더 뷰
- **한눈에 보는 월별 기록**: 그리드 형태의 캘린더
- **사진 썸네일**: 일지 작성한 날에는 식물 사진이 표시됨
- **날짜 클릭**: 해당 날짜의 일지 작성/수정
- **월별 통계**: 이번 달 기록 수와 달성률 표시

### ✏️ 일지 작성
- **사진 업로드**: 식물 사진을 추가하고 미리보기
- **날짜 선택**: 오늘 날짜 또는 과거 날짜 선택 가능
- **관찰 일기**: 최대 500자까지 자유롭게 작성
- **즉시 저장**: LocalStorage에 안전하게 저장

### 📚 타임라인 뷰
- **시간 역순 정렬**: 최신 일지부터 표시
- **세로형 타임라인**: 직관적인 시간 흐름 표시
- **일지 삭제**: 원하지 않는 일지 삭제 기능
- **진행도 메시지**: 기록 수에 따른 격려 문구

### 🎉 진화 축하 애니메이션
- **화려한 모달**: 진화 시 전체 화면 축하 애니메이션
- **컨페티 효과**: 별이 떨어지는 시각 효과
- **단계별 색상**: 각 진화 단계마다 다른 테마 색상
- **자동 닫기**: 5초 후 자동으로 닫히거나 버튼 클릭으로 닫기

## 🎯 진화 단계 가이드

| 레벨 | 이름 | 필요 일기 수 | 이모지 | 색상 |
|------|------|--------------|--------|------|
| 1 | 알 | 0개 | 🥚 | 회색 |
| 2 | 새싹 | 1~15개 | 🌱 | 연두색 |
| 3 | 줄기와 잎 | 16~35개 | 🌿 | 초록색 |
| 4 | 꽃 | 36~60개 | 🌸 | 분홍색 |
| 5 | 열매 | 61~85개 | 🍎 | 빨간색 |
| 6 | 요정 | 86~90개 | 🧚 | 보라색 |

## 🛠 기술 스택

- **React 18**: 최신 React 기능 활용
- **Vite**: 빠른 개발 서버와 빌드
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **Framer Motion**: 부드러운 애니메이션
- **Lucide React**: 깔끔한 아이콘
- **date-fns**: 날짜 처리 라이브러리
- **LocalStorage**: 브라우저 기반 데이터 저장

## 🚀 시작하기

### 필수 요구사항
- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
```bash
npm install
```

2. **개발 서버 실행**
```bash
npm run dev
```

3. **브라우저에서 열기**
```
http://localhost:5173
```

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 미리보기

```bash
npm run preview
```

## 📁 프로젝트 구조

```
grow_mon/
├── src/
│   ├── components/         # React 컴포넌트
│   │   ├── BottomNav.jsx  # 하단 네비게이션
│   │   ├── CalendarView.jsx  # 캘린더 뷰
│   │   ├── Character.jsx  # 캐릭터 표시
│   │   ├── Dashboard.jsx  # 메인 대시보드
│   │   ├── EntryForm.jsx  # 일지 작성 폼
│   │   ├── EvolutionCelebration.jsx  # 진화 축하 모달
│   │   └── Timeline.jsx   # 타임라인 뷰
│   ├── utils/             # 유틸리티 함수
│   │   ├── evolution.js   # 진화 시스템 로직
│   │   └── storage.js     # LocalStorage 관리
│   ├── App.jsx            # 메인 앱 컴포넌트
│   ├── main.jsx           # 앱 진입점
│   └── index.css          # 전역 스타일
├── index.html             # HTML 템플릿
├── vite.config.js         # Vite 설정
├── tailwind.config.js     # Tailwind 설정
├── postcss.config.js      # PostCSS 설정
└── package.json           # 프로젝트 메타데이터

```

## 💾 데이터 구조

### LocalStorage 키
- `growmon_diary_entries`: 모든 일기 데이터
- `growmon_user_data`: 사용자 설정 (시작 날짜 등)

### 일기 데이터 구조
```javascript
{
  "2026-01-20": {
    date: "2026-01-20",
    photo: "data:image/jpeg;base64,...",
    content: "오늘 새싹이 조금 더 자랐어요!",
    timestamp: 1737331200000
  }
}
```

## 🎨 디자인 가이드라인

### 색상 팔레트
- **Primary Green**: `#4ADE80` - 메인 액센트 색상
- **Background**: `#F8FAFC` - 배경색
- **Text Brown**: `#78350F` - 주요 텍스트 색상

### 폰트
- **기본 폰트**: System UI 폰트 스택
- **픽셀 폰트** (선택): Press Start 2P (Google Fonts)

### 디자인 원칙
- **Modern Pixel Art**: 레트로 픽셀 아트와 현대적 UI의 조화
- **부드러운 애니메이션**: Framer Motion을 활용한 자연스러운 전환
- **모바일 우선**: 반응형 디자인으로 모든 기기 지원

## 📱 주요 기능 설명

### 1. LocalStorage 데이터 관리 (`storage.js`)

90일간의 데이터를 효율적으로 관리하기 위해 날짜를 키값으로 사용:

```javascript
// 일기 저장
saveEntry("2026-01-20", photoData, "오늘의 관찰 내용")

// 특정 날짜 일기 가져오기
getEntry("2026-01-20")

// 모든 일기 가져오기
getAllEntries()

// 총 일기 개수
getEntryCount()
```

### 2. 진화 시스템 (`evolution.js`)

일기 개수에 따라 자동으로 진화 단계 계산:

```javascript
// 현재 진화 단계 가져오기
const stage = getEvolutionStage(45); // 45개 작성 시 "꽃" 단계

// 경험치 퍼센트 계산
const percent = getExperiencePercent(45); // 50%

// 진화 체크
const evolution = checkEvolution(35, 36); // 35개 → 36개 (꽃으로 진화!)
```

### 3. 진화 축하 애니메이션

새로운 단계로 진화할 때마다:
- ✨ 전체 화면 모달 표시
- 🎊 컨페티(별) 애니메이션
- 🎨 단계별 색상 테마
- 📝 축하 메시지 표시

### 4. 캘린더 뷰 특징

- **유연한 날짜 처리**: `date-fns`로 정확한 날짜 계산
- **사진 썸네일**: 일지가 있는 날에는 사진 미리보기
- **빈 공간 처리**: 기록 없는 날은 연한 회색으로 표시
- **월간 통계**: 달성률 자동 계산

## 🔧 커스터마이징

### 진화 단계 수정

[src/utils/evolution.js](src/utils/evolution.js)의 `EVOLUTION_STAGES` 배열을 수정:

```javascript
{
  level: 2,
  name: '새싹',
  minEntries: 1,
  maxEntries: 15,
  emoji: '🌱',
  message: '작은 새싹이 돋아났어요!',
  color: '#A5D6A7'
}
```

### 색상 테마 변경

[tailwind.config.js](tailwind.config.js)에서 색상 수정:

```javascript
colors: {
  primary: '#4ADE80',        // 메인 색상
  background: '#F8FAFC',     // 배경색
  textBrown: '#78350F',      // 텍스트 색상
}
```

## 📝 사용 팁

1. **매일 기록하기**: 꾸준히 기록하면 빠르게 진화합니다!
2. **사진 크기**: 5MB 이하의 사진을 권장합니다.
3. **날짜 선택**: 깜빡한 날도 날짜를 변경해서 작성 가능합니다.
4. **백업**: 중요한 기록은 브라우저 데이터를 백업하세요.

## 🐛 알려진 문제

- LocalStorage 용량 제한: 약 5~10MB (사진 크기에 따라 다름)
- 브라우저 데이터 삭제 시 모든 기록 손실
- 다른 기기 간 동기화 미지원 (현재 버전)

## 🔜 향후 계획

- [ ] 데이터 내보내기/가져오기 기능
- [ ] 클라우드 동기화 (Firebase 등)
- [ ] 푸시 알림 (매일 작성 리마인더)
- [ ] 더 많은 캐릭터 스킨
- [ ] 친구와 공유 기능
- [ ] 통계 대시보드 강화

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

## 👏 기여하기

버그 제보나 기능 제안은 Issues에 등록해주세요!

---

**만든 이**: Claude (AI Assistant)
**버전**: 1.0.0
**최종 업데이트**: 2026-01-20

🌱 즐거운 식물 키우기 되세요! 🌱
