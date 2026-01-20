# 🌱 그로우몬 - 상세 기능 설명서

## 📋 목차
1. [프로젝트 구조](#프로젝트-구조)
2. [데이터 관리 시스템](#데이터-관리-시스템)
3. [진화 시스템 동작 원리](#진화-시스템-동작-원리)
4. [컴포넌트별 상세 설명](#컴포넌트별-상세-설명)
5. [애니메이션 효과](#애니메이션-효과)
6. [사용자 시나리오](#사용자-시나리오)

---

## 프로젝트 구조

### 디렉토리 구성
```
grow_mon/
├── src/
│   ├── components/         # UI 컴포넌트들
│   │   ├── BottomNav.jsx          # 하단 탭 네비게이션
│   │   ├── CalendarView.jsx       # 월별 캘린더 뷰
│   │   ├── Character.jsx          # 진화 캐릭터 표시
│   │   ├── Dashboard.jsx          # 메인 대시보드
│   │   ├── EntryForm.jsx          # 일지 작성 폼
│   │   ├── EvolutionCelebration.jsx  # 진화 축하 모달
│   │   └── Timeline.jsx           # 타임라인 뷰
│   ├── utils/              # 유틸리티 함수들
│   │   ├── evolution.js           # 진화 로직
│   │   └── storage.js             # LocalStorage 관리
│   ├── App.jsx             # 메인 앱
│   ├── main.jsx            # React 진입점
│   └── index.css           # 전역 스타일
├── index.html              # HTML 템플릿
├── package.json            # 패키지 설정
├── vite.config.js          # Vite 설정
└── tailwind.config.js      # Tailwind 설정
```

---

## 데이터 관리 시스템

### LocalStorage 구조

#### 1. 일기 데이터 (`growmon_diary_entries`)
```javascript
{
  "2026-01-20": {
    date: "2026-01-20",           // YYYY-MM-DD 형식
    photo: "data:image/jpeg;base64,...",  // Base64 인코딩된 이미지
    content: "오늘의 관찰 내용",    // 일기 내용 (최대 500자)
    timestamp: 1737331200000      // 작성 시간 (밀리초)
  },
  "2026-01-21": { ... },
  ...
}
```

**특징:**
- 날짜를 키값으로 사용하여 빠른 검색 가능
- 한 날짜당 하나의 일기만 저장
- 중복 날짜 저장 시 자동으로 덮어쓰기

#### 2. 사용자 데이터 (`growmon_user_data`)
```javascript
{
  startDate: "2026-01-01"  // 시작 날짜 (향후 확장용)
}
```

### 주요 Storage 함수

#### `getAllEntries()`
- 모든 일기 데이터를 객체 형태로 반환
- 에러 발생 시 빈 객체 `{}` 반환

#### `getEntry(date)`
- 특정 날짜의 일기 하나만 가져오기
- 없으면 `null` 반환

#### `saveEntry(date, photo, content)`
- 새 일기 저장 또는 기존 일기 수정
- 성공 시 `true`, 실패 시 `false` 반환

#### `deleteEntry(date)`
- 특정 날짜의 일기 삭제
- 성공 시 `true`, 실패 시 `false` 반환

#### `getEntryCount()`
- 총 일기 개수 반환 (진화 계산에 사용)

#### `getEntriesArray()`
- 모든 일기를 배열로 변환하여 **최신순** 정렬

#### `getEntriesByMonth(year, month)`
- 특정 월의 일기만 필터링하여 반환

---

## 진화 시스템 동작 원리

### 진화 단계 정의

```javascript
const EVOLUTION_STAGES = [
  { level: 1, name: '알', minEntries: 0, maxEntries: 0, emoji: '🥚', ... },
  { level: 2, name: '새싹', minEntries: 1, maxEntries: 15, emoji: '🌱', ... },
  { level: 3, name: '줄기와 잎', minEntries: 16, maxEntries: 35, emoji: '🌿', ... },
  { level: 4, name: '꽃', minEntries: 36, maxEntries: 60, emoji: '🌸', ... },
  { level: 5, name: '열매', minEntries: 61, maxEntries: 85, emoji: '🍎', ... },
  { level: 6, name: '요정', minEntries: 86, maxEntries: 90, emoji: '🧚', ... }
]
```

### 핵심 함수

#### `getEvolutionStage(entryCount)`
**입력:** 일기 개수 (0~90+)
**출력:** 현재 진화 단계 객체

**동작 방식:**
1. 일기 개수가 90을 초과하면 90으로 제한
2. 배열을 역순으로 순회하며 조건에 맞는 첫 번째 단계 반환
3. 예: 45개 → "꽃" 단계 (36~60 범위)

```javascript
// 사용 예시
const stage = getEvolutionStage(45);
// 결과: { level: 4, name: '꽃', emoji: '🌸', ... }
```

#### `getExperiencePercent(entryCount)`
**입력:** 일기 개수
**출력:** 진행률 퍼센트 (0~100)

**계산식:** `(entryCount / 90) × 100`
- 45개 → 50.0%
- 90개 → 100.0%

#### `checkEvolution(previousCount, newCount)`
**입력:** 이전 일기 수, 새 일기 수
**출력:** 진화 여부 및 정보

```javascript
{
  evolved: true/false,        // 진화 발생 여부
  previousStage: { ... },     // 이전 단계 정보
  newStage: { ... }           // 새 단계 정보
}
```

**사용 예시:**
```javascript
// 35개에서 36개로 증가 (줄기와 잎 → 꽃)
const result = checkEvolution(35, 36);
// result.evolved === true
// result.newStage.name === "꽃"
```

---

## 컴포넌트별 상세 설명

### 1. Dashboard (메인 대시보드)

**주요 기능:**
- 현재 진화 단계 캐릭터 표시
- 경험치 바 (90일 기준)
- 3가지 통계 카드
  - 작성한 일기 개수
  - 남은 일수 (90 - 현재 개수)
  - 다음 진화까지 필요한 개수
- 다음 진화 단계 미리보기
- 진행도별 격려 메시지

**Props:**
- `entryCount`: 총 일기 개수

### 2. CalendarView (캘린더 뷰)

**주요 기능:**
- 월별 날짜 그리드 표시
- 일기가 있는 날: 사진 썸네일 표시
- 일기가 없는 날: 연한 회색 배경
- 오늘 날짜: Primary 색상 테두리
- 이전/다음 달 이동
- 월간 통계 (기록 수, 달성률)

**Props:**
- `entries`: 전체 일기 객체
- `onDateClick`: 날짜 클릭 시 콜백

**내부 로직:**
```javascript
// 1. 현재 월의 첫 날, 마지막 날 계산
const monthStart = startOfMonth(currentDate);
const monthEnd = endOfMonth(currentDate);

// 2. 해당 월의 모든 날짜 배열 생성
const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

// 3. 월 시작 요일에 맞춰 빈 칸 생성
const firstDayOfWeek = monthStart.getDay(); // 0(일) ~ 6(토)
const emptyDays = Array(firstDayOfWeek).fill(null);
```

### 3. EntryForm (일지 작성 폼)

**주요 기능:**
- 날짜 선택 (기본값: 오늘, 과거 날짜 선택 가능)
- 사진 업로드
  - 파일 선택 또는 드래그 앤 드롭
  - 미리보기 기능
  - 5MB 크기 제한
- 관찰 일기 작성 (500자 제한)
- 유효성 검사
  - 사진 필수
  - 내용 필수

**Props:**
- `onSave`: 저장 시 콜백
- `onCancel`: 취소 시 콜백
- `initialDate`: 초기 날짜
- `existingEntry`: 수정 모드인 경우 기존 데이터

**사진 처리:**
```javascript
const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    setPhoto(reader.result);  // Base64 문자열로 저장
  };
  reader.readAsDataURL(file);
};
```

### 4. Timeline (타임라인)

**주요 기능:**
- 모든 일기를 시간 역순으로 표시
- 세로형 타임라인 디자인
- 각 카드에 사진, 날짜, 내용 표시
- 일기 삭제 기능
- 빈 상태 처리

**Props:**
- `entries`: 전체 일기 객체
- `onDelete`: 삭제 시 콜백

**정렬 로직:**
```javascript
const sortedEntries = Object.values(entries)
  .sort((a, b) => b.timestamp - a.timestamp);  // 최신순
```

### 5. Character (캐릭터 표시)

**주요 기능:**
- 진화 단계에 맞는 이모지 캐릭터 표시
- 레벨 뱃지
- 경험치 바 애니메이션
- 단계별 색상 테마
- 부드러운 진입 애니메이션

**Props:**
- `entryCount`: 총 일기 개수

**애니메이션 효과:**
- 캐릭터 등장: 회전하며 확대
- 떠다니는 효과: Y축 상하 움직임
- 경험치 바: 0%에서 실제 값까지 애니메이션

### 6. EvolutionCelebration (진화 축하)

**주요 기능:**
- 전체 화면 모달
- 30개의 별 컨페티 애니메이션
- 새 단계 캐릭터와 메시지 표시
- 5초 후 자동 닫기 또는 수동 닫기

**Props:**
- `show`: 모달 표시 여부
- `newStage`: 새로운 진화 단계 정보
- `onClose`: 닫기 콜백

**컨페티 생성:**
```javascript
const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,         // 화면 가로 랜덤 위치
  delay: Math.random() * 0.5,      // 시작 지연
  duration: 2 + Math.random() * 2, // 떨어지는 시간
  rotation: Math.random() * 360    // 회전 각도
}));
```

### 7. BottomNav (하단 네비게이션)

**주요 기능:**
- 4개 탭: 홈, 캘린더, 작성, 타임라인
- 활성 탭 하이라이트
- 부드러운 전환 애니메이션
- 모바일 친화적 디자인

**Props:**
- `activeTab`: 현재 활성 탭
- `onTabChange`: 탭 변경 콜백

---

## 애니메이션 효과

### Framer Motion 활용

#### 1. 페이지 전환
```javascript
<AnimatePresence mode="wait">
  {activeTab === 'home' && <Dashboard key="home" />}
  {activeTab === 'calendar' && <CalendarView key="calendar" />}
</AnimatePresence>
```

#### 2. 캐릭터 등장 애니메이션
```javascript
<motion.div
  initial={{ scale: 0, rotate: -180 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
>
```

#### 3. 경험치 바 채우기
```javascript
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${percent}%` }}
  transition={{ duration: 1, ease: 'easeOut' }}
>
```

#### 4. 타임라인 항목 순차 등장
```javascript
{entries.map((entry, index) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
  >
))}
```

---

## 사용자 시나리오

### 시나리오 1: 첫 일기 작성

1. **앱 접속**
   - 캐릭터: 알 (🥚)
   - 경험치: 0%
   - 메시지: "첫 일기를 작성해보세요!"

2. **작성 탭 클릭**
   - 오늘 날짜 자동 선택
   - 사진 업로드 안내

3. **일기 작성 완료**
   - 저장 버튼 클릭
   - 진화 축하 모달 등장!
   - 캐릭터 변화: 알 → 새싹

4. **대시보드 확인**
   - 새싹 캐릭터 표시
   - 경험치: 1.1% (1/90)
   - 다음 진화까지: 15개

### 시나리오 2: 36번째 일기 (꽃 진화)

1. **현재 상태**
   - 캐릭터: 줄기와 잎 (🌿)
   - 일기 개수: 35개
   - 경험치: 38.9%

2. **36번째 일기 작성**
   - 저장 버튼 클릭
   - `checkEvolution(35, 36)` 실행
   - `evolved: true` 감지

3. **진화 축하**
   - 전체 화면 모달 등장
   - 별 30개가 떨어지는 애니메이션
   - 꽃 이모지 (🌸) 크게 표시
   - "아름다운 꽃이 피었어요!" 메시지

4. **대시보드 업데이트**
   - 꽃 캐릭터로 변경
   - 경험치: 40.0%
   - 다음 진화(열매)까지: 25개

### 시나리오 3: 캘린더에서 과거 일기 작성

1. **캘린더 탭 이동**
   - 2026년 1월 표시
   - 일기 작성한 날: 사진 썸네일
   - 작성 안 한 날: 연한 회색

2. **1월 15일 클릭**
   - 작성 화면으로 전환
   - 날짜가 1월 15일로 자동 설정

3. **일기 작성 및 저장**
   - 해당 날짜로 저장됨
   - 캘린더에서 1월 15일에 사진 표시

4. **월별 통계 확인**
   - "이번 달 기록: 15개"
   - "달성률: 48%" (15/31)

### 시나리오 4: 90일 완주

1. **90번째 일기 작성**
   - 현재: 열매 단계 (89개)
   - 마지막 일기 저장

2. **최종 진화**
   - 화려한 축하 모달
   - 요정 (🧚) 등장
   - "90일 완주를 축하합니다!"

3. **완성 상태**
   - 경험치: 100%
   - 다음 진화: "최고 레벨!"
   - 격려 메시지: "90일 완주를 축하합니다! 최고예요!"

---

## 데이터 백업 및 복구

### 데이터 내보내기 (수동)

브라우저 콘솔에서:
```javascript
// 모든 데이터 JSON으로 내보내기
const data = {
  entries: localStorage.getItem('growmon_diary_entries'),
  userData: localStorage.getItem('growmon_user_data')
};
console.log(JSON.stringify(data));
// 출력된 JSON을 복사하여 파일로 저장
```

### 데이터 가져오기 (수동)

```javascript
// 백업한 JSON 데이터
const backupData = { ... };
localStorage.setItem('growmon_diary_entries', backupData.entries);
localStorage.setItem('growmon_user_data', backupData.userData);
location.reload();
```

---

## 트러블슈팅

### 문제: 사진이 저장되지 않아요
**원인:** LocalStorage 용량 초과 (약 5~10MB)
**해결:**
- 사진 크기를 줄여서 업로드
- 이전 일기 일부 삭제

### 문제: 진화가 안 돼요
**원인:** 진화 조건 미달
**확인:**
- 현재 일기 개수 확인
- 다음 진화까지 필요한 개수 확인
- 대시보드에서 "다음까지" 숫자 확인

### 문제: 데이터가 사라졌어요
**원인:** 브라우저 캐시 삭제 또는 시크릿 모드 사용
**해결:**
- 일반 브라우저 모드 사용
- 정기적으로 데이터 백업

---

## 향후 개선 계획

1. **클라우드 동기화**
   - Firebase 연동
   - 여러 기기에서 접근

2. **알림 기능**
   - 매일 작성 리마인더
   - 진화 임박 알림

3. **통계 강화**
   - 주간/월간 통계
   - 작성 패턴 분석

4. **소셜 기능**
   - 친구와 진행도 공유
   - 격려 메시지 교환

5. **커스터마이징**
   - 캐릭터 스킨 선택
   - 테마 색상 변경
   - 배경 이미지 설정

---

**문의 및 피드백:** Issues 탭에 등록해주세요! 🌱
