import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MoreVertical, Home, Calendar, PenSquare, BookOpen, User, Users, X } from 'lucide-react';

/**
 * 서브보드 공통 헤더
 * - 왼쪽: 메인보드로 돌아가기
 * - 가운데: 제목
 * - 오른쪽: 더보기 메뉴 (바로가기 + 프로필)
 */
const SubBoardHeader = ({ title, currentTab, onBack, onNavigate }) => {
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = [
    { id: 'home', title: '홈', icon: Home, color: 'text-green-600' },
    { id: 'calendar', title: '캘린더', icon: Calendar, color: 'text-blue-600' },
    { id: 'write', title: '작성', icon: PenSquare, color: 'text-orange-500' },
    { id: 'timeline', title: '타임라인', icon: BookOpen, color: 'text-purple-600' },
    { id: 'feed', title: '우리반', icon: Users, color: 'text-pink-600' },
    { id: 'profile', title: '프로필', icon: User, color: 'text-gray-600' },
  ];

  const handleMenuClick = (tabId) => {
    setShowMenu(false);
    if (tabId !== currentTab) {
      onNavigate(tabId);
    }
  };

  return (
    <>
      {/* 헤더 */}
      <div className="bg-white shadow-md border-b-2 border-primary/20 px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {/* 왼쪽: 뒤로가기 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            <ArrowLeft size={20} />
          </motion.button>

          {/* 가운데: 제목 */}
          <h1 className="text-lg font-bold text-textBrown">{title}</h1>

          {/* 오른쪽: 더보기 메뉴 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMenu(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
          >
            <MoreVertical size={20} />
          </motion.button>
        </div>
      </div>

      {/* 더보기 메뉴 오버레이 */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 bg-black/30 z-30"
            />

            {/* 메뉴 패널 */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-white shadow-2xl z-40"
            >
              {/* 메뉴 헤더 */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-bold text-textBrown">바로가기</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowMenu(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* 메뉴 아이템 */}
              <div className="p-2">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMenuClick(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl
                      ${currentTab === item.id ? 'bg-primary/10' : ''}
                    `}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 ${item.color}`}>
                      <item.icon size={18} />
                    </div>
                    <span className={`font-medium ${currentTab === item.id ? 'text-primary' : 'text-textBrown'}`}>
                      {item.title}
                    </span>
                    {currentTab === item.id && (
                      <span className="ml-auto text-xs text-primary font-bold">현재</span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* 메인보드로 가기 */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onBack}
                  className="w-full py-3 bg-primary text-white rounded-xl font-semibold"
                >
                  메인보드로 돌아가기
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SubBoardHeader;
