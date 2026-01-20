import { motion } from 'framer-motion';
import { Home, Calendar, PenSquare, BookOpen } from 'lucide-react';

/**
 * 하단 네비게이션 바
 */
const BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'calendar', label: '캘린더', icon: Calendar },
    { id: 'write', label: '작성', icon: PenSquare },
    { id: 'timeline', label: '타임라인', icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-textBrown shadow-2xl z-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-around items-center h-20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative flex flex-col items-center justify-center
                  px-4 py-2 rounded-xl transition-all
                  ${isActive ? 'text-primary' : 'text-gray-400'}
                `}
              >
                {/* 활성 배경 */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}

                {/* 아이콘 */}
                <motion.div
                  animate={{
                    y: isActive ? -2 : 0,
                  }}
                  className="relative z-10"
                >
                  <Icon
                    size={24}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </motion.div>

                {/* 라벨 */}
                <motion.span
                  animate={{
                    fontWeight: isActive ? 700 : 400,
                    fontSize: isActive ? '0.75rem' : '0.7rem',
                  }}
                  className="relative z-10 mt-1"
                >
                  {tab.label}
                </motion.span>

                {/* 활성 점 */}
                {isActive && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute -top-1 w-1.5 h-1.5 bg-primary rounded-full"
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
