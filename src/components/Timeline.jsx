import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Trash2 } from 'lucide-react';

/**
 * 타임라인 뷰 - 시간 역순으로 일지 표시
 */
const Timeline = ({ entries, onDelete }) => {
  // 날짜순으로 정렬된 일지 배열 (최신순)
  const sortedEntries = Object.values(entries).sort((a, b) => b.timestamp - a.timestamp);

  const handleDelete = (date) => {
    if (confirm('정말로 이 일기를 삭제하시겠습니까?')) {
      onDelete(date);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pink-50 pb-24">
      {/* 헤더 */}
      <div className="bg-white shadow-md border-b-4 border-textBrown px-6 py-4">
        <h2 className="text-xl font-bold text-textBrown text-center">
          📚 나의 식물 일기
        </h2>
        <p className="text-sm text-gray-600 text-center mt-1">
          총 {sortedEntries.length}개의 기록
        </p>
      </div>

      {/* 타임라인 */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {sortedEntries.length === 0 ? (
          /* 빈 상태 */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-bold text-textBrown mb-2">
              아직 일기가 없어요
            </h3>
            <p className="text-gray-600">
              첫 식물 일기를 작성해보세요!
            </p>
          </motion.div>
        ) : (
          /* 타임라인 항목들 */
          <div className="relative">
            {/* 세로 타임라인 */}
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-green-300" />

            <div className="space-y-6">
              {sortedEntries.map((entry, index) => (
                <motion.div
                  key={entry.date}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-16"
                >
                  {/* 타임라인 점 */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="absolute left-3 top-6 w-6 h-6 bg-primary border-4 border-white rounded-full shadow-lg z-10"
                  />

                  {/* 카드 */}
                  <div className="bg-white rounded-2xl shadow-lg border-2 border-textBrown overflow-hidden hover:shadow-xl transition-shadow">
                    {/* 사진 */}
                    {entry.photo && (
                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        src={entry.photo}
                        alt={`${entry.date} 식물 사진`}
                        className="w-full h-64 object-cover"
                      />
                    )}

                    {/* 내용 */}
                    <div className="p-4">
                      {/* 날짜 */}
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Calendar size={16} className="mr-2" />
                        <span className="font-bold">
                          {format(new Date(entry.date), 'yyyy년 M월 d일')}
                        </span>
                      </div>

                      {/* 일기 내용 */}
                      {entry.content?.weather && (
                        <p className="text-sm text-gray-500 mb-2">
                          날씨: {entry.content.weather} {entry.content.temperature && `| ${entry.content.temperature}`}
                        </p>
                      )}
                      <p className="text-textBrown leading-relaxed whitespace-pre-wrap mb-4">
                        {typeof entry.content === 'string'
                          ? entry.content
                          : entry.content?.observation || ''}
                      </p>

                      {/* 삭제 버튼 */}
                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(entry.date)}
                          className="flex items-center text-sm text-red-500 hover:text-red-700 font-bold"
                        >
                          <Trash2 size={16} className="mr-1" />
                          삭제
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 격려 메시지 */}
        {sortedEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: sortedEntries.length * 0.1 + 0.5 }}
            className="mt-8 bg-gradient-to-r from-primary/10 to-green-200/30 rounded-xl p-4 border-2 border-primary/30 text-center"
          >
            <p className="text-sm text-textBrown">
              {sortedEntries.length < 10 && '🌱 훌륭한 시작이에요!'}
              {sortedEntries.length >= 10 && sortedEntries.length < 30 && '🌿 꾸준히 잘하고 있어요!'}
              {sortedEntries.length >= 30 && sortedEntries.length < 60 && '🌸 대단해요! 절반을 넘겼어요!'}
              {sortedEntries.length >= 60 && sortedEntries.length < 90 && '🍎 거의 다 왔어요! 파이팅!'}
              {sortedEntries.length >= 90 && '🧚 완벽해요! 90일 완주를 축하합니다!'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
