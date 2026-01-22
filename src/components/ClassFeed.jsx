import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Users, UserPlus, Settings } from 'lucide-react';
import { getClassFeed, getMyClass } from '../utils/classStorage';

/**
 * 우리반 피드 컴포넌트
 */
const ClassFeed = ({ onManageClass }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasClass, setHasClass] = useState(false);

  // 데이터 로드
  useEffect(() => {
    loadFeed();
  }, [selectedDate]);

  const loadFeed = async () => {
    setLoading(true);

    // 반 정보 확인
    const myClass = await getMyClass();
    setHasClass(!!myClass);
    setClassInfo(myClass);

    if (myClass) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const result = await getClassFeed(dateStr);
      setEntries(result.entries || []);
    }

    setLoading(false);
  };

  // 날짜 이동
  const goToPrevDay = () => setSelectedDate(prev => subDays(prev, 1));
  const goToNextDay = () => setSelectedDate(prev => addDays(prev, 1));
  const goToToday = () => setSelectedDate(new Date());

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  // 반에 참여하지 않은 경우
  if (!loading && !hasClass) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-blue-50 pb-8">
        {/* 헤더 */}
        <div className="bg-white shadow-md border-b-4 border-blue-400 px-6 py-4">
          <h2 className="text-xl font-bold text-textBrown text-center">
            우리반 피드
          </h2>
        </div>

        {/* 반 참여 안내 */}
        <div className="px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="text-6xl mb-6">🏫</div>
            <h3 className="text-xl font-bold text-textBrown mb-3">
              아직 참여 중인 반이 없어요
            </h3>
            <p className="text-gray-600 mb-8">
              선생님에게 반 코드를 받아서 참여하거나,<br />
              직접 반을 만들어보세요!
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onManageClass}
              className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 bg-blue-500 text-white py-4 rounded-2xl font-semibold shadow-lg"
            >
              <UserPlus size={20} />
              반 참여하기
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50 pb-8">
      {/* 헤더 */}
      <div className="bg-white shadow-md border-b-4 border-blue-400 px-6 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-textBrown">
            우리반 피드
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onManageClass}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100"
          >
            <Settings size={20} className="text-gray-600" />
          </motion.button>
        </div>

        {/* 반 정보 */}
        {classInfo && (
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-600">
              <Users size={14} className="inline mr-1" />
              {classInfo.name}
              {classInfo.school && ` | ${classInfo.school}`}
            </p>
          </div>
        )}
      </div>

      {/* 날짜 선택 */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPrevDay}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100"
          >
            <ChevronLeft size={20} />
          </motion.button>

          <div className="text-center">
            <p className="font-bold text-textBrown">
              {format(selectedDate, 'M월 d일 (EEEE)', { locale: ko })}
            </p>
            {!isToday && (
              <button
                onClick={goToToday}
                className="text-xs text-blue-500 font-semibold"
              >
                오늘로 이동
              </button>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNextDay}
            disabled={isToday}
            className={`w-10 h-10 flex items-center justify-center rounded-full ${
              isToday ? 'bg-gray-50 text-gray-300' : 'bg-gray-100'
            }`}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>

      {/* 피드 목록 */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4 animate-bounce">🌱</div>
            <p className="text-gray-600">불러오는 중...</p>
          </div>
        ) : entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-bold text-textBrown mb-2">
              {isToday ? '오늘은 아직 작성된 일기가 없어요' : '이 날은 일기가 없어요'}
            </h3>
            <p className="text-gray-600 text-sm">
              {isToday && '첫 번째로 일기를 작성해보세요!'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center mb-4">
              {entries.length}명이 일기를 작성했어요
            </p>

            <AnimatePresence>
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden"
                >
                  {/* 작성자 정보 */}
                  <div className="flex items-center gap-3 p-4 border-b bg-gray-50">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                      {entry.profiles?.avatar ? (
                        <img
                          src={entry.profiles.avatar}
                          alt="프로필"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg">🌱</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-textBrown">
                        {entry.profiles?.name || '익명'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {entry.profiles?.plant_name && `${entry.profiles.plant_name} 키우는 중`}
                      </p>
                    </div>
                  </div>

                  {/* 사진 */}
                  {entry.photo_url && (
                    <img
                      src={entry.photo_url}
                      alt="식물 사진"
                      className="w-full h-64 object-cover"
                    />
                  )}

                  {/* 내용 */}
                  <div className="p-4">
                    {(entry.weather || entry.temperature) && (
                      <p className="text-sm text-gray-500 mb-2">
                        {entry.weather && `날씨: ${entry.weather}`}
                        {entry.temperature && ` | ${entry.temperature}`}
                      </p>
                    )}
                    <p className="text-textBrown leading-relaxed whitespace-pre-wrap">
                      {entry.observation || ''}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassFeed;
