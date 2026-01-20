import { motion } from 'framer-motion';
import { getEvolutionStage, getExperiencePercent } from '../utils/evolution';

/**
 * 진화 단계별 캐릭터 표시 컴포넌트
 */
const Character = ({ entryCount }) => {
  const stage = getEvolutionStage(entryCount);
  const experiencePercent = getExperiencePercent(entryCount);

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* 캐릭터 이미지 */}
      <motion.div
        key={stage.level}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20
        }}
        className="relative"
      >
        {/* 픽셀 아트 스타일 배경 */}
        <div
          className="w-48 h-48 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-textBrown"
          style={{
            background: `linear-gradient(135deg, ${stage.color}22 0%, ${stage.color}55 100%)`,
          }}
        >
          {/* 반짝이는 효과 */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={{
              boxShadow: [
                `0 0 20px ${stage.color}44`,
                `0 0 40px ${stage.color}88`,
                `0 0 20px ${stage.color}44`,
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          {/* 이모지 캐릭터 */}
          <motion.div
            className="text-8xl z-10"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {stage.emoji}
          </motion.div>
        </div>

        {/* 레벨 뱃지 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -top-3 -right-3 bg-textBrown text-white px-4 py-2 rounded-full shadow-lg border-2 border-white"
        >
          <span className="text-sm font-bold">Lv.{stage.level}</span>
        </motion.div>
      </motion.div>

      {/* 캐릭터 이름 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-textBrown mb-2">{stage.name}</h2>
        <p className="text-gray-600 text-sm px-4">{stage.message}</p>
      </motion.div>

      {/* 경험치 바 */}
      <div className="w-full max-w-md px-4">
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>일기 {entryCount}개</span>
          <span>목표 90개</span>
        </div>

        {/* 프로그레스 바 */}
        <div className="h-6 bg-gray-200 rounded-full overflow-hidden border-2 border-textBrown shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-green-400 relative"
            initial={{ width: 0 }}
            animate={{ width: `${experiencePercent}%` }}
            transition={{
              duration: 1,
              ease: 'easeOut'
            }}
          >
            {/* 프로그레스 바 반짝임 효과 */}
            <motion.div
              className="absolute inset-0 bg-white"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
              }}
            />
          </motion.div>
        </div>

        {/* 퍼센트 표시 */}
        <div className="text-center mt-2">
          <span className="text-lg font-bold text-primary">
            {experiencePercent.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default Character;
