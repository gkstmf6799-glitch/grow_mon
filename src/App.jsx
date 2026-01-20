import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import EntryForm from './components/EntryForm';
import Timeline from './components/Timeline';
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
  const [activeTab, setActiveTab] = useState('home');
  const [entries, setEntries] = useState({});
  const [entryCount, setEntryCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);

  // 진화 축하 모달 상태
  const [showEvolution, setShowEvolution] = useState(false);
  const [evolutionData, setEvolutionData] = useState(null);

  // 초기 데이터 로드
  useEffect(() => {
    loadEntries();
  }, []);

  // 데이터 로드
  const loadEntries = () => {
    const allEntries = getAllEntries();
    setEntries(allEntries);
    setEntryCount(getEntryCount());
  };

  // 일지 저장 핸들러
  const handleSaveEntry = (entryData) => {
    const previousCount = entryCount;

    // 저장
    const success = saveEntry(entryData.date, entryData.photo, entryData.content);

    if (success) {
      // 데이터 새로고침
      loadEntries();

      // 진화 체크
      const newCount = getEntryCount();
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
  const handleDeleteEntry = (date) => {
    const success = deleteEntry(date);

    if (success) {
      loadEntries();
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

  return (
    <div className="min-h-screen bg-background">
      {/* 페이지 콘텐츠 */}
      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <Dashboard key="home" entryCount={entryCount} />
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
