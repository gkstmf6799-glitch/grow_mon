import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import EntryForm from './components/EntryForm';
import Timeline from './components/Timeline';
import Profile from './components/Profile';
import BottomNav from './components/BottomNav';
import EvolutionCelebration from './components/EvolutionCelebration';
import {
  getAllEntries,
  saveEntry,
  deleteEntry,
  getEntryCount,
  getEntriesByMonth
} from './utils/storage';
import { checkEvolution } from './utils/evolution';
import { format } from 'date-fns';

/**
 * 그로우몬 메인 앱 컴포넌트
 */
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [entries, setEntries] = useState({});
  const [entryCount, setEntryCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);

  // 진화 축하 모달 상태
  const [showEvolution, setShowEvolution] = useState(false);
  const [evolutionData, setEvolutionData] = useState(null);

  // 인증 상태 확인
  useEffect(() => {
    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  // 데이터 로드
  const loadEntries = async () => {
    const allEntries = await getAllEntries();
    setEntries(allEntries);
    const count = await getEntryCount();
    setEntryCount(count);
  };

  // 일지 저장 핸들러
  const handleSaveEntry = async (entryData) => {
    const previousCount = entryCount;

    // 저장
    const success = await saveEntry(entryData.date, entryData.photo, entryData.content);

    if (success) {
      // 데이터 새로고침
      await loadEntries();

      // 진화 체크
      const newCount = await getEntryCount();
      const evolution = checkEvolution(previousCount, newCount);

      if (evolution.evolved) {
        // 진화 축하 모달 표시
        setEvolutionData(evolution.newStage);
        setShowEvolution(true);
      }

      // 홈으로 이동
      setActiveTab('home');
    } else {
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 일지 삭제 핸들러
  const handleDeleteEntry = async (date) => {
    const success = await deleteEntry(date);

    if (success) {
      await loadEntries();
    } else {
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 캘린더에서 날짜 클릭
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setActiveTab('write');
  };

  // 탭 변경 핸들러
  const handleTabChange = (tab) => {
    if (tab === 'write') {
      setSelectedDate(new Date());
    }
    setActiveTab(tab);
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🌱</div>
          <p className="text-textBrown">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 로그인 안 됨
  if (!user) {
    return <Auth onAuthSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 페이지 콘텐츠 */}
      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <Dashboard
            key="home"
            entryCount={entryCount}
            onProfileClick={() => setActiveTab('profile')}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            key="calendar"
            entries={entries}
            onDateClick={handleDateClick}
          />
        )}

        {activeTab === 'write' && (
          <EntryForm
            key="write"
            initialDate={selectedDate}
            existingEntry={selectedDate ? entries[format(selectedDate, 'yyyy-MM-dd')] : null}
            onSave={handleSaveEntry}
            onCancel={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'timeline' && (
          <Timeline
            key="timeline"
            entries={entries}
            onDelete={handleDeleteEntry}
          />
        )}

        {activeTab === 'profile' && (
          <Profile
            key="profile"
            entries={entries}
            entryCount={entryCount}
          />
        )}
      </AnimatePresence>

      {/* 하단 네비게이션 */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 진화 축하 모달 */}
      <EvolutionCelebration
        show={showEvolution}
        newStage={evolutionData}
        onClose={() => setShowEvolution(false)}
      />
    </div>
  );
}

export default App;
