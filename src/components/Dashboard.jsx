import { motion } from 'framer-motion';
import Character from './Character';
import { getNextStageInfo } from '../utils/evolution';
import { getProfile } from '../utils/storage';
import { getDaysSinceStart } from '../utils/statistics';
import { BookOpen, Calendar, TrendingUp, User } from 'lucide-react';
import logoImage from '../assets/grow_mon_logo.png';

/**
 * 메인 대시보드 - 캐릭터 상태와 진행도 표시
 */
const Dashboard = ({ entryCount, onProfileClick }) => {
  const nextStageInfo = getNextStageInfo(entryCount);
  const profile = getProfile();
  const daysSinceStart = getDaysSinceStart(profile.startDate);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-green-50 pb-24">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-md border-b-4 border-textBrown px-6 py-4 relative"
      >
        {/* 프로필 아이콘 버튼 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onProfileClick}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
          aria-label="프로필"
        >
          <User className="w-6 h-6 text-primary" />
        </motion.button>

        <div className="text-center pr-10">
          <img
            src={logoImage}
            alt="그로우몬: 90일의 여정"
            className="h-16 mx-auto"
          />
        </div>
      </motion.div>

      {/* 캐릭터 섹션 */}
      <div className="py-8">
        <Character entryCount={entryCount} />
      </div>

      {/* 통계 카드 */}
      <div className="px-4 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3"
        >
          {/* 총 일기 개수 */}
          <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-textBrown text-center">
            <BookOpen className="mx-auto mb-2 text-primary" size={24} />
            <div className="text-2xl font-bold text-textBrown">{entryCount}</div>
            <div className="text-xs text-gray-600 mt-1">일기</div>
          </div>

          {/* 경과 일수 */}
          <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-textBrown text-center">
            <Calendar className="mx-auto mb-2 text-blue-500" size={24} />
            <div className="text-2xl font-bold text-textBrown">
              {daysSinceStart > 0 ? `D+${daysSinceStart}` : '-'}
            </div>
            <div className="text-xs text-gray-600 mt-1">경과 일수</div>
          </div>

          {/* 다음 진화까지 */}
          <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-textBrown text-center">
            <TrendingUp className="mx-auto mb-2 text-yellow-500" size={24} />
            <div className="text-2xl font-bold text-textBrown">
              {nextStageInfo.isMaxLevel ? '완료' : nextStageInfo.remaining}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {nextStageInfo.isMaxLevel ? '최고 레벨!' : '다음까지'}
            </div>
          </div>
        </motion.div>
      </div>

      {/* 다음 단계 미리보기 */}
      {!nextStageInfo.isMaxLevel && nextStageInfo.nextStage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mx-4 mt-6 bg-white rounded-xl p-6 shadow-lg border-2 border-dashed border-primary"
        >
          <h3 className="text-sm font-bold text-gray-600 mb-3 text-center">
            다음 진화 단계
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="text-4xl p-3 rounded-xl"
                style={{
                  background: `${nextStageInfo.nextStage.color}22`
                }}
              >
                {nextStageInfo.nextStage.emoji}
              </div>
              <div>
                <div className="font-bold text-textBrown">
                  {nextStageInfo.nextStage.name}
                </div>
                <div className="text-xs text-gray-600">
                  Lv.{nextStageInfo.nextStage.level}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">앞으로</div>
              <div className="text-xl font-bold text-primary">
                {nextStageInfo.remaining}일
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 격려 메시지 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mx-4 mt-6 bg-gradient-to-r from-primary/10 to-green-200/30 rounded-xl p-4 border-2 border-primary/30"
      >
        <p className="text-center text-sm text-textBrown">
          {entryCount === 0 && '🌟 첫 일기를 작성하고 여정을 시작해보세요!'}
          {entryCount > 0 && entryCount < 30 && '💪 잘하고 있어요! 꾸준히 기록해봐요.'}
          {entryCount >= 30 && entryCount < 60 && '🎯 절반을 넘겼어요! 대단해요!'}
          {entryCount >= 60 && entryCount < 85 && '🚀 거의 다 왔어요! 조금만 더 힘내요!'}
          {entryCount >= 85 && entryCount < 90 && '🔥 마지막 스퍼트! 곧 완성이에요!'}
          {entryCount >= 90 && '🎊 90일 완주를 축하합니다! 최고예요!'}
        </p>
      </motion.div>
    </div>
  );
};

export default Dashboard;
