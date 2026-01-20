# 📦 Git & GitHub 연결 가이드

## ✅ 완료된 작업

- [x] Git 저장소 초기화 완료
- [x] 초기 커밋 생성 완료 (c12135b)
- [x] .gitignore 설정 완료

---

## 🚀 GitHub에 업로드하기

### 방법 1: GitHub 웹사이트 사용 (초보자 추천)

#### Step 1: GitHub 저장소 생성
1. **GitHub 접속**: https://github.com
2. 로그인 (계정 없으면 가입)
3. 오른쪽 상단 **"+"** 클릭 → **"New repository"**
4. 저장소 설정:
   - **Repository name**: `grow-mon`
   - **Description**: `🌱 90일 식물 재배 일지 웹 앱`
   - **Public** 또는 **Private** 선택
   - ⚠️ **"Initialize this repository with a README" 체크 해제** (중요!)
5. **"Create repository"** 클릭

#### Step 2: 로컬과 연결
터미널에서 실행:
```bash
# GitHub 저장소 URL 연결 (본인의 username으로 변경!)
git remote add origin https://github.com/YOUR_USERNAME/grow-mon.git

# 기본 브랜치 이름 확인/설정
git branch -M main

# 푸시
git push -u origin main
```

#### Step 3: 확인
GitHub 저장소 페이지를 새로고침하면 모든 파일이 업로드된 것을 확인할 수 있습니다!

---

### 방법 2: GitHub CLI 사용 (고급 사용자)

#### Step 1: GitHub CLI 설치
```bash
# Windows (Chocolatey)
choco install gh

# 또는 공식 설치 프로그램
# https://cli.github.com/
```

#### Step 2: 인증
```bash
gh auth login
```
- GitHub.com 선택
- HTTPS 선택
- Login with a web browser

#### Step 3: 저장소 생성 및 푸시
```bash
# 저장소 생성 (public)
gh repo create grow-mon --public --source=. --remote=origin

# 푸시
git push -u origin main
```

---

## 📝 Git 기본 명령어

### 현재 상태 확인
```bash
git status
```

### 변경사항 확인
```bash
# 모든 변경사항
git diff

# 특정 파일
git diff src/App.jsx
```

### 새로운 변경사항 커밋
```bash
# 1. 변경된 파일 스테이징
git add .

# 2. 커밋
git commit -m "feat: 새로운 기능 추가"

# 3. GitHub에 푸시
git push
```

### 커밋 메시지 규칙 (Conventional Commits)
```bash
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 스타일 변경 (기능 변경 없음)
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드/설정 변경
```

**예시:**
```bash
git commit -m "feat: 다크 모드 추가"
git commit -m "fix: 캘린더 날짜 오류 수정"
git commit -m "docs: README에 사용법 추가"
```

---

## 🌿 브랜치 관리

### 새 브랜치 생성
```bash
# 기능 개발용 브랜치
git checkout -b feature/dark-mode

# 버그 수정용 브랜치
git checkout -b fix/calendar-bug
```

### 브랜치 전환
```bash
git checkout main
git checkout feature/dark-mode
```

### 브랜치 병합
```bash
# main 브랜치로 이동
git checkout main

# 기능 브랜치 병합
git merge feature/dark-mode

# 푸시
git push
```

### 브랜치 삭제
```bash
# 로컬 브랜치 삭제
git branch -d feature/dark-mode

# 원격 브랜치 삭제
git push origin --delete feature/dark-mode
```

---

## 🔄 협업 워크플로우

### 1. 작업 전 최신 코드 받기
```bash
git pull origin main
```

### 2. 새 기능 브랜치 생성
```bash
git checkout -b feature/new-feature
```

### 3. 작업 후 커밋
```bash
git add .
git commit -m "feat: 새 기능 구현"
```

### 4. 원격 저장소에 푸시
```bash
git push origin feature/new-feature
```

### 5. GitHub에서 Pull Request 생성
1. GitHub 저장소 페이지 접속
2. **"Compare & pull request"** 버튼 클릭
3. 변경사항 설명 작성
4. **"Create pull request"** 클릭
5. 리뷰 후 **"Merge pull request"**

---

## 🛠 유용한 Git 명령어

### 커밋 히스토리 보기
```bash
# 간단한 로그
git log --oneline

# 그래프로 보기
git log --oneline --graph --all

# 상세 로그
git log
```

### 특정 커밋으로 되돌리기
```bash
# 마지막 커밋 취소 (변경사항 유지)
git reset --soft HEAD~1

# 마지막 커밋 취소 (변경사항 삭제)
git reset --hard HEAD~1

# 특정 커밋으로 되돌리기
git reset --hard <commit-hash>
```

### 변경사항 임시 저장
```bash
# 작업 중인 변경사항 임시 저장
git stash

# 임시 저장 목록 보기
git stash list

# 임시 저장 복원
git stash pop
```

### 원격 저장소 관리
```bash
# 현재 연결된 원격 저장소 확인
git remote -v

# 원격 저장소 추가
git remote add origin <URL>

# 원격 저장소 URL 변경
git remote set-url origin <new-URL>

# 원격 저장소 제거
git remote remove origin
```

---

## 📊 현재 프로젝트 상태

```
Repository: grow-mon (로컬)
Branch: main
Commits: 1
Latest: c12135b - 🌱 Initial commit

Files tracked: 22
- 7 React components
- 2 utility modules
- 5 config files
- 3 documentation files
- 5 other files
```

---

## 🎯 추천 .gitignore 항목

현재 `.gitignore`에 포함된 항목:
```
node_modules/       # npm 패키지
dist/              # 빌드 결과물
*.local            # 로컬 설정
.DS_Store          # macOS 파일
*.log              # 로그 파일
```

추가로 고려할 항목:
```
# 환경 변수
.env
.env.local
.env.production

# IDE 설정
.vscode/settings.json
.idea/

# 테스트 커버리지
coverage/

# 임시 파일
*.tmp
*.swp
```

---

## 🔐 GitHub 인증 설정

### SSH 키 설정 (권장)

#### 1. SSH 키 생성
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

#### 2. SSH 키 복사
```bash
# Windows (Git Bash)
cat ~/.ssh/id_ed25519.pub | clip

# 또는 수동으로 복사
cat ~/.ssh/id_ed25519.pub
```

#### 3. GitHub에 SSH 키 추가
1. GitHub 설정: https://github.com/settings/keys
2. **"New SSH key"** 클릭
3. 복사한 키 붙여넣기
4. **"Add SSH key"** 클릭

#### 4. SSH로 원격 저장소 변경
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/grow-mon.git
```

---

## 🚨 문제 해결

### "Permission denied" 오류
**원인:** GitHub 인증 실패
**해결:**
```bash
# Personal Access Token 생성
# GitHub → Settings → Developer settings → Personal access tokens

# Token을 비밀번호로 사용
git push
Username: YOUR_USERNAME
Password: YOUR_TOKEN
```

### "fatal: remote origin already exists"
**해결:**
```bash
git remote remove origin
git remote add origin <URL>
```

### 푸시가 거부됨 (rejected)
**해결:**
```bash
# 원격 변경사항 먼저 가져오기
git pull --rebase origin main
git push
```

### 대용량 파일 오류
**해결:**
```bash
# Git LFS 설치 및 사용
git lfs install
git lfs track "*.psd"
git add .gitattributes
```

---

## 📱 GitHub 저장소 활용

### README 뱃지 추가
```markdown
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)
![Vite](https://img.shields.io/badge/vite-5.1.4-purple.svg)
```

### GitHub Pages로 배포
```bash
# gh-pages 패키지 설치
npm install --save-dev gh-pages

# package.json에 추가
"homepage": "https://YOUR_USERNAME.github.io/grow-mon",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# 배포
npm run deploy
```

### GitHub Actions (CI/CD)
`.github/workflows/deploy.yml` 생성:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
```

---

## 📚 추가 학습 자료

### 공식 문서
- Git: https://git-scm.com/doc
- GitHub: https://docs.github.com
- GitHub CLI: https://cli.github.com/manual

### 튜토리얼
- GitHub Learning Lab: https://lab.github.com
- Git 시각화: https://learngitbranching.js.org

### 치트시트
- Git 명령어: https://training.github.com/downloads/github-git-cheat-sheet/

---

## ✅ 다음 단계 체크리스트

- [ ] GitHub 계정 생성/로그인
- [ ] 새 저장소 생성 (grow-mon)
- [ ] 원격 저장소 연결 (`git remote add origin`)
- [ ] 첫 푸시 (`git push -u origin main`)
- [ ] GitHub에서 확인
- [ ] README에 프로젝트 소개 추가
- [ ] 스크린샷 추가 (선택)
- [ ] GitHub Pages 배포 (선택)

---

**🎉 Git 설정 완료! 이제 GitHub에 업로드해보세요!**
