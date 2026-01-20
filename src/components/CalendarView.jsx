import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

/**
 * 월별 캘린더 뷰 - 사진 썸네일과 함께 표시
 */
const CalendarView = ({ entries, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // 현재 월의 모든 날짜 가져오기
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 월의 첫 날이 무슨 요일인지 확인 (0: 일요일)
  const firstDayOfWeek = monthStart.getDay();

  // 빈 칸 생성 (월 시작 전)
  const emptyDays = Array(firstDayOfWeek).fill(null);

  // 이전/다음 달로 이동
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // 날짜별 일기 데이터 가져오기
  const getEntryForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return entries[dateStr] || null;
  };

  const today = new Date();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50 pb-24">
      {/* 헤더 */}
      <div className="bg-white shadow-md border-b-4 border-textBrown px-6 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-textBrown"
          >
            <ChevronLeft size={24} />
          </motion.button>

          <h2 className="text-xl font-bold text-textBrown">
            {format(currentDate, 'yyyy년 M월')}
          </h2>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNextMonth}
            className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-textBrown"
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>
      </div>

      {/* 캘린더 그리드 */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border-2 border-textBrown p-4">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
              <div
                key={day}
                className={`text-center text-xs font-bold ${
                  idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-gray-600'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-2">
            {/* 빈 칸 */}
            {emptyDays.map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square" />
            ))}

            {/* 실제 날짜 */}
            {monthDays.map((date) => {
              const entry = getEntryForDate(date);
              const isToday = isSameDay(date, today);
              const dateNum = date.getDate();

              return (
                <motion.button
                  key={date.toISOString()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDateClick(date)}
                  className={`
                    aspect-square rounded-xl overflow-hidden relative
                    border-2 transition-all
                    ${isToday ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200'}
                    ${entry ? 'shadow-md' : 'bg-gray-50'}
                  `}
                >
                  {/* 사진이 있는 경우 썸네일 표시 */}
                  {entry && entry.photo ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full"
                    >
                      <img
                        src={entry.photo}
                        alt={`${dateNum}일 사진`}
                        className="w-full h-full object-cover"
                      />
                      {/* 날짜 오버레이 */}
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-1">
                        <span className="text-white text-xs font-bold">
                          {dateNum}
                        </span>
                      </div>
                      {/* 체크 마크 */}
                      <div className="absolute bottom-0 right-0 bg-primary rounded-tl-lg p-1">
                        <Camera size={10} className="text-white" />
                      </div>
                    </motion.div>
                  ) : (
                    /* 사진이 없는 경우 */
                    <div className="w-full h-full flex items-center justify-center">
                      <span className={`text-sm ${isToday ? 'font-bold text-primary' : 'text-gray-400'}`}>
                        {dateNum}
                      </span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 통계 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto mt-6 bg-white rounded-xl p-4 shadow-lg border-2 border-textBrown"
        >
          <div className="flex justify-around text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {Object.keys(entries).filter(date =>
                  date.startsWith(format(currentDate, 'yyyy-MM'))
                ).length}
              </div>
              <div className="text-xs text-gray-600 mt-1">이번 달 기록</div>
            </div>
            <div className="w-px bg-gray-300" />
            <div>
              <div className="text-2xl font-bold text-textBrown">
                {monthDays.length}
              </div>
              <div className="text-xs text-gray-600 mt-1">총 일수</div>
            </div>
            <div className="w-px bg-gray-300" />
            <div>
              <div className="text-2xl font-bold text-blue-500">
                {((Object.keys(entries).filter(date =>
                  date.startsWith(format(currentDate, 'yyyy-MM'))
                ).length / monthDays.length) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600 mt-1">달성률</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CalendarView;
