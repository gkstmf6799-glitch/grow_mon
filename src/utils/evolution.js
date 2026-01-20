/**
 * 그로우몬 진화 시스템
 * 일기 개수에 따라 6단계로 진화하는 로직
 */

import {
  Level1Egg,
  Level2Sprout,
  Level3Plant,
  Level4Flower,
  Level5Fruit,
  Level6Fairy
} from '../components/characters';

export const EVOLUTION_STAGES = [
  {
    level: 1,
    name: '알',
    minEntries: 0,
    maxEntries: 0,
    emoji: '🥚',
    component: Level1Egg,
    message: '여정의 시작! 첫 일기를 작성해보세요.',
    color: '#E0E0E0'
  },
  {
    level: 2,
    name: '새싹',
    minEntries: 1,
    maxEntries: 15,
    emoji: '🌱',
    component: Level2Sprout,
    message: '작은 새싹이 돋아났어요! 계속 관찰해주세요.',
    color: '#A5D6A7'
  },
  {
    level: 3,
    name: '줄기와 잎',
    minEntries: 16,
    maxEntries: 35,
    emoji: '🌿',
    component: Level3Plant,
    message: '튼튼한 줄기와 잎이 자라고 있어요!',
    color: '#66BB6A'
  },
  {
    level: 4,
    name: '꽃',
    minEntries: 36,
    maxEntries: 60,
    emoji: '🌸',
    component: Level4Flower,
    message: '아름다운 꽃이 피었어요! 벌써 절반이 넘었네요.',
    color: '#F48FB1'
  },
  {
    level: 5,
    name: '열매',
    minEntries: 61,
    maxEntries: 85,
    emoji: '🍎',
    component: Level5Fruit,
    message: '탐스러운 열매가 열렸어요! 거의 다 왔어요.',
    color: '#EF5350'
  },
  {
    level: 6,
    name: '요정',
    minEntries: 86,
    maxEntries: 90,
    emoji: '🧚',
    component: Level6Fairy,
    message: '축하합니다! 최종 진화 완료! 당신은 진정한 식물 마스터에요!',
    color: '#AB47BC'
  }
];

/**
 * 일기 개수로 현재 진화 단계 계산
 */
export const getEvolutionStage = (entryCount) => {
  // 90개를 초과해도 최종 단계 유지
  const count = Math.min(entryCount, 90);

  for (let i = EVOLUTION_STAGES.length - 1; i >= 0; i--) {
    const stage = EVOLUTION_STAGES[i];
    if (count >= stage.minEntries) {
      return stage;
    }
  }

  return EVOLUTION_STAGES[0];
};

/**
 * 다음 단계까지 필요한 일기 개수 계산
 */
export const getNextStageInfo = (entryCount) => {
  const currentStage = getEvolutionStage(entryCount);

  // 이미 최종 단계인 경우
  if (currentStage.level === 6 && entryCount >= 90) {
    return {
      isMaxLevel: true,
      remaining: 0,
      nextStage: null
    };
  }

  const nextStage = EVOLUTION_STAGES.find(
    stage => stage.level === currentStage.level + 1
  );

  return {
    isMaxLevel: false,
    remaining: nextStage ? nextStage.minEntries - entryCount : 0,
    nextStage
  };
};

/**
 * 경험치 퍼센트 계산 (0-100)
 */
export const getExperiencePercent = (entryCount) => {
  return Math.min((entryCount / 90) * 100, 100);
};

/**
 * 진화 체크 (이전 개수와 비교하여 진화 발생 여부 확인)
 */
export const checkEvolution = (previousCount, newCount) => {
  const previousStage = getEvolutionStage(previousCount);
  const newStage = getEvolutionStage(newCount);

  return {
    evolved: newStage.level > previousStage.level,
    previousStage,
    newStage
  };
};
