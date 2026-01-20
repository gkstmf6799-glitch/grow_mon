# 🚀 그로우몬 실행 가이드

## ⚡ 빠른 시작 (3단계)

### 1️⃣ 의존성 설치
프로젝트 폴더에서 터미널을 열고:
```bash
npm install
```

**예상 시간:** 1-2분
**설치되는 것:** React, Vite, Tailwind CSS, Framer Motion 등

---

### 2️⃣ 개발 서버 실행
```bash
npm run dev
```

**출력 예시:**
```
  VITE v5.1.4  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

---

### 3️⃣ 브라우저에서 열기
- 자동으로 브라우저가 열립니다
- 또는 수동으로 http://localhost:5173 접속

---

## 🎮 사용 가능한 명령어

### 개발 서버 실행
```bash
npm run dev
```
- 핫 리로드 지원 (코드 수정 시 자동 새로고침)
- 개발자 도구 사용 가능

### 프로덕션 빌드
```bash
npm run build
```
- 최적화된 빌드 파일 생성
- `dist` 폴더에 결과물 저장

### 빌드 미리보기
```bash
npm run preview
```
- 빌드된 파일을 로컬에서 미리보기
- http://localhost:4173 에서 확인

---

## 🔧 문제 해결

### ❌ "npm: command not found"
**원인:** Node.js가 설치되지 않음
**해결:**
1. https://nodejs.org 접속
2. LTS 버전 다운로드
3. 설치 후 터미널 재시작

### ❌ "Cannot find module..."
**원인:** 의존성이 제대로 설치되지 않음
**해결:**
```bash
# node_modules 폴더 삭제
rm -rf node_modules package-lock.json

# 재설치
npm install
```

### ❌ "Port 5173 is already in use"
**원인:** 5173 포트가 이미 사용 중
**해결:**
```bash
# 다른 포트로 실행
npm run dev -- --port 3000
```

### ❌ "Permission denied" (Windows)
**원인:** 관리자 권한 필요
**해결:**
- PowerShell을 관리자 권한으로 실행
- 또는 VSCode를 관리자 권한으로 실행

---

## 📱 첫 화면에서 할 일

### 1. 홈 화면 확인
- 알(🥚) 캐릭터가 보입니다
- 경험치 0%
- "첫 일기를 작성해보세요!" 메시지

### 2. 첫 일기 작성
1. 하단의 **"작성"** 탭 클릭
2. 식물 사진 업로드
3. 오늘 관찰 내용 작성
4. **저장하기** 클릭

### 3. 진화 확인
- 축하 애니메이션이 나타납니다!
- 알 → 새싹으로 진화
- 경험치 1.1%로 상승

### 4. 다른 기능 탐색
- **캘린더**: 월별 뷰로 기록 확인
- **타임라인**: 시간순으로 일기 보기
- **홈**: 캐릭터 성장 상태 확인

---

## 🎨 개발 환경 설정 (선택사항)

### VSCode 추천 확장 프로그램

1. **ES7+ React/Redux/React-Native snippets**
   - React 코드 자동완성

2. **Tailwind CSS IntelliSense**
   - Tailwind 클래스 자동완성

3. **Prettier - Code formatter**
   - 코드 자동 정리

### 설치 방법
- VSCode 확장 탭 (Ctrl+Shift+X)
- 검색 후 Install

---

## 📊 프로젝트 구조 이해하기

```
grow_mon/
├── src/
│   ├── components/      # React 컴포넌트들
│   │   ├── Dashboard.jsx       # 메인 화면
│   │   ├── CalendarView.jsx    # 캘린더
│   │   ├── EntryForm.jsx       # 일기 작성
│   │   └── ...
│   ├── utils/          # 유틸리티 함수
│   │   ├── storage.js          # 데이터 저장
│   │   └── evolution.js        # 진화 로직
│   └── App.jsx         # 메인 앱
├── index.html          # HTML 진입점
└── package.json        # 프로젝트 설정
```

---

## 🧪 테스트 시나리오

### 시나리오 1: 빠른 진화 테스트
브라우저 콘솔(F12)에서:
```javascript
// 15개 일기 자동 생성 (새싹 → 줄기와 잎 진화)
for(let i = 1; i <= 15; i++) {
  const date = new Date(2026, 0, i).toISOString().split('T')[0];
  localStorage.setItem('growmon_diary_entries',
    JSON.stringify({
      ...JSON.parse(localStorage.getItem('growmon_diary_entries') || '{}'),
      [date]: {
        date,
        photo: 'data:image/png;base64,iVBORw0KGgoAAAANS',
        content: `${i}번째 일기입니다!`,
        timestamp: Date.now()
      }
    })
  );
}
location.reload();
```

### 시나리오 2: 데이터 초기화
```javascript
// 모든 데이터 삭제
localStorage.clear();
location.reload();
```

---

## 💾 데이터 백업

### 내보내기
브라우저 콘솔에서:
```javascript
const backup = {
  entries: localStorage.getItem('growmon_diary_entries'),
  userData: localStorage.getItem('growmon_user_data')
};
console.log(JSON.stringify(backup));
// 출력된 JSON을 복사하여 파일로 저장
```

### 가져오기
```javascript
const backup = { /* 저장한 JSON 붙여넣기 */ };
localStorage.setItem('growmon_diary_entries', backup.entries);
localStorage.setItem('growmon_user_data', backup.userData);
location.reload();
```

---

## 🌐 배포하기 (선택사항)

### Vercel에 배포 (무료, 추천)

1. **Vercel 계정 생성**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **프로젝트 업로드**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **자동 배포**
   - 몇 초 후 URL 생성
   - 예: https://grow-mon.vercel.app

### Netlify에 배포

1. **빌드**
   ```bash
   npm run build
   ```

2. **Netlify Drop 사용**
   - https://app.netlify.com/drop
   - `dist` 폴더를 드래그 앤 드롭

---

## 📞 도움말

### 공식 문서
- React: https://react.dev
- Vite: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com
- Framer Motion: https://www.framer.com/motion

### 커뮤니티
- Stack Overflow에 "react" 태그로 질문
- GitHub Issues에 버그 리포트

---

## ✅ 체크리스트

실행 전 확인사항:

- [ ] Node.js 18+ 설치 완료
- [ ] 프로젝트 폴더로 이동
- [ ] `npm install` 실행
- [ ] `npm run dev` 실행
- [ ] 브라우저에서 localhost:5173 접속
- [ ] 알 캐릭터 확인
- [ ] 첫 일기 작성 테스트

---

**🎉 모든 준비 완료! 즐거운 식물 키우기 되세요! 🌱**
