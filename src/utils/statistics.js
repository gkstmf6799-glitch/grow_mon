/**
 * 그로우몬 통계 계산 유틸리티
 */

import { parseISO, differenceInDays, format, isSameDay, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 연속 기록일 계산 (Streak)
 * 오늘부터 과거로 거슬러 올라가며 연속된 날 계산
 */
export const calculateStreak = (entries) => {
  if (!entries || Object.keys(entries).length === 0) {
    return 0;
  }

  const dates = Object.keys(entries).sort().reverse(); // 최신순 정렬
  const today = new Date();
  let streak = 0;
  let checkDate = today;

  // 오늘부터 과거로 하루씩 거슬러 올라가며 확인
  for (let i = 0; i < 90; i++) {
    const checkDateStr = format(checkDate, 'yyyy-MM-dd');

    if (dates.includes(checkDateStr)) {
      streak++;
      checkDate = addDays(checkDate, -1);
    } else {
      // 연속이 끊김
      break;
    }
  }

  return streak;
};

/**
 * 요일별 기록 통계
 * 각 요일(월~일)별로 몇 개의 일지가 작성되었는지 계산
 */
export const getDayOfWeekStats = (entries) => {
  const stats = {
    0: 0, // 일요일
    1: 0, // 월요일
    2: 0, // 화요일
    3: 0, // 수요일
    4: 0, // 목요일
    5: 0, // 금요일
    6: 0  // 토요일
  };

  Object.keys(entries).forEach(dateStr => {
    const date = parseISO(dateStr);
    const dayOfWeek = date.getDay();
    stats[dayOfWeek]++;
  });

  return stats;
};

/**
 * 가장 많이 기록한 요일 찾기
 */
export const getMostActiveDay = (entries) => {
  const stats = getDayOfWeekStats(entries);
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

  let maxDay = 0;
  let maxCount = 0;

  Object.entries(stats).forEach(([day, count]) => {
    if (count > maxCount) {
      maxCount = count;
      maxDay = parseInt(day);
    }
  });

  return maxCount > 0 ? dayNames[maxDay] : '-';
};

/**
 * 주간 기록 추세 (최근 4주)
 */
export const getWeeklyTrend = (entries) => {
  const weeks = [];
  const today = new Date();

  for (let i = 3; i >= 0; i--) {
    const weekStart = addDays(today, -7 * (i + 1));
    const weekEnd = addDays(today, -7 * i);

    let count = 0;
    Object.keys(entries).forEach(dateStr => {
      const date = parseISO(dateStr);
      if (date >= weekStart && date < weekEnd) {
        count++;
      }
    });

    weeks.push({
      label: `${i + 1}주 전`,
      count
    });
  }

  return weeks;
};

/**
 * 월간 기록 추세 (최근 3개월)
 */
export const getMonthlyTrend = (entries) => {
  const months = [];
  const today = new Date();

  for (let i = 2; i >= 0; i--) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthStr = format(monthDate, 'yyyy-MM');

    let count = 0;
    Object.keys(entries).forEach(dateStr => {
      if (dateStr.startsWith(monthStr)) {
        count++;
      }
    });

    months.push({
      label: format(monthDate, 'M월', { locale: ko }),
      count
    });
  }

  return months;
};

/**
 * 전체 달성률 계산 (90일 기준)
 */
export const getOverallProgress = (entryCount) => {
  return Math.min(Math.round((entryCount / 90) * 100), 100);
};

/**
 * 시작일부터 경과 일수 계산
 */
export const getDaysSinceStart = (startDate) => {
  if (!startDate) return 0;

  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const today = new Date();

  return Math.max(0, differenceInDays(today, start) + 1);
};

/**
 * 평균 주간 기록 수
 */
export const getAverageWeeklyEntries = (entries, startDate) => {
  const totalEntries = Object.keys(entries).length;
  const daysSinceStart = getDaysSinceStart(startDate);

  if (daysSinceStart === 0) return 0;

  const weeks = Math.max(1, Math.ceil(daysSinceStart / 7));
  return (totalEntries / weeks).toFixed(1);
};

/**
 * 진화 단계별 달성 날짜 계산
 */
export const getEvolutionMilestones = (entries) => {
  const sortedEntries = Object.keys(entries)
    .sort()
    .map(date => ({ date, ...entries[date] }));

  const milestones = {
    1: null,  // 알 (시작)
    2: null,  // 새싹 (1개)
    3: null,  // 줄기와 잎 (16개)
    4: null,  // 꽃 (36개)
    5: null,  // 열매 (61개)
    6: null   // 요정 (86개)
  };

  const thresholds = [0, 1, 16, 36, 61, 86];

  thresholds.forEach((threshold, index) => {
    if (sortedEntries.length >= threshold && threshold > 0) {
      milestones[index + 1] = sortedEntries[threshold - 1].date;
    } else if (threshold === 0 && sortedEntries.length > 0) {
      milestones[1] = sortedEntries[0].date;
    }
  });

  return milestones;
};
