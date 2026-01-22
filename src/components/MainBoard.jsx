import { motion } from 'framer-motion';
import { Home, Calendar, PenSquare, BookOpen } from 'lucide-react';
import logoImage from '../assets/grow_mon_logo.png';

/**
 * 메인보드 - 로그인 후 초기 화면
 * 4개의 주요 기능 탭을 카드 형태로 표시
 */
const MainBoard = ({ onNavigate, entryCount }) => {
  const menuItems = [
    {
      id: 'home',
      title: '홈',
      description: '나의 캐릭터와 성장 현황',
      icon: Home,
      color: 'from-green-400 to-green-600',
      emoji: '🌱',
    },
    {
      id: 'calendar',
      title: '캘린더',
      description: '날짜별 일기 모아보기',
      icon: Calendar,
      color: 'from-blue-400 to-blue-600',
      emoji: '📅',
    },
    {
      id: 'write',
      title: '작성',
      description: '오늘의 식물 일기 쓰기',
      icon: PenSquare,
      color: 'from-yellow-400 to-orange-500',
      emoji: '✏️',
    },
    {
      id: 'timeline',
      title: '타임라인',
      description: '성장 기록 한눈에 보기',
      icon: BookOpen,
      color: 'from-purple-400 to-purple-600',
      emoji: '📚',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      {/* 상단 로고 영역 */}
      <div className="pt-8 pb-4 px-6">
        <motion.img
          src={logoImage}
          alt="그로우몬"
          className="h-20 mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* 환영 메시지 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center px-6 mb-6"
      >
        <p className="text-textBrown/70 text-sm">
          지금까지 <span className="font-bold text-primary">{entryCount}개</span>의 일기를 작성했어요!
        </p>
      </motion.div>

      {/* 메뉴 카드 그리드 */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate(item.id)}
              className={`
                relative overflow-hidden rounded-2xl p-5
                bg-gradient-to-br ${item.color}
                shadow-lg hover:shadow-xl
                transition-shadow duration-300
                text-white text-left
                min-h-[140px]
              `}
            >
              {/* 배경 이모지 */}
              <span className="absolute -right-2 -bottom-2 text-6xl opacity-20">
                {item.emoji}
              </span>

              {/* 아이콘 */}
              <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                <item.icon size={22} />
              </div>

              {/* 텍스트 */}
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-white/80 text-xs leading-relaxed">
                {item.description}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 하단 격려 메시지 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="px-6 pb-8"
      >
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-4 border-2 border-primary/20">
          <p className="text-center text-sm text-textBrown">
            {entryCount === 0 && '🌱 첫 번째 일기를 작성해보세요!'}
            {entryCount > 0 && entryCount < 10 && '🌿 좋은 시작이에요! 꾸준히 기록해봐요!'}
            {entryCount >= 10 && entryCount < 30 && '🌸 대단해요! 벌써 10개 이상 작성했어요!'}
            {entryCount >= 30 && entryCount < 60 && '🌻 절반을 넘겼어요! 파이팅!'}
            {entryCount >= 60 && entryCount < 90 && '🍎 거의 다 왔어요! 조금만 더 힘내요!'}
            {entryCount >= 90 && '🧚 90일 완주! 정말 대단해요!'}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MainBoard;
