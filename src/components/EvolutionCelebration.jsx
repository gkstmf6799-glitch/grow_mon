import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * 진화 축하 모달 애니메이션
 */
const EvolutionCelebration = ({ show, newStage, onClose }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (show) {
      // 컨페티 생성
      const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        rotation: Math.random() * 360
      }));
      setConfetti(particles);

      // 5초 후 자동으로 닫기
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && newStage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* 컨페티 효과 */}
          {confetti.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute top-0"
              style={{ left: `${particle.x}%` }}
              initial={{ y: -20, opacity: 1, rotate: 0 }}
              animate={{
                y: window.innerHeight + 20,
                opacity: 0,
                rotate: particle.rotation
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: 'easeIn'
              }}
            >
              <Star
                size={20}
                fill={newStage.color}
                color={newStage.color}
                className="drop-shadow-lg"
              />
            </motion.div>
          ))}

          {/* 메인 모달 */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
            className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl border-4 border-textBrown relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 배경 반짝임 */}
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                background: [
                  `radial-gradient(circle at 20% 30%, ${newStage.color} 0%, transparent 50%)`,
                  `radial-gradient(circle at 80% 70%, ${newStage.color} 0%, transparent 50%)`,
                  `radial-gradient(circle at 20% 30%, ${newStage.color} 0%, transparent 50%)`,
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />

            {/* 축하 아이콘 */}
            <motion.div
              className="text-center mb-4"
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <Sparkles size={48} className="mx-auto text-yellow-400 drop-shadow-lg" />
            </motion.div>

            {/* 축하 메시지 */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-center text-textBrown mb-2"
            >
              🎉 진화 성공! 🎉
            </motion.h2>

            {/* 새로운 단계 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="text-center my-6"
            >
              <div
                className="inline-block p-8 rounded-2xl border-4 border-textBrown shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${newStage.color}33 0%, ${newStage.color}66 100%)`
                }}
              >
                <motion.div
                  className="text-9xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  {newStage.emoji}
                </motion.div>
              </div>
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-2xl font-bold text-textBrown mt-4"
              >
                {newStage.name}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-gray-600 mt-2 px-4"
              >
                {newStage.message}
              </motion.p>
            </motion.div>

            {/* 닫기 버튼 */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full bg-primary hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-colors"
            >
              계속하기
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EvolutionCelebration;
