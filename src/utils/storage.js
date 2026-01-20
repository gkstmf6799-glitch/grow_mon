/**
 * 그로우몬 LocalStorage 유틸리티
 * 90일간의 식물 일기 데이터를 효율적으로 관리합니다.
 *
 * 데이터 구조:
 * {
 *   "2026-01-20": {
 *     date: "2026-01-20",
 *     photo: "data:image/jpeg;base64,...",
 *     content: "오늘 새싹이 조금 더 자랐어요!",
 *     timestamp: 1737331200000
 *   },
 *   ...
 * }
 */

const STORAGE_KEY = 'growmon_diary_entries';
const USER_DATA_KEY = 'growmon_user_data';

/**
 * 모든 일기 항목 가져오기
 */
export const getAllEntries = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('데이터 로드 실패:', error);
    return {};
  }
};

/**
 * 특정 날짜의 일기 가져오기
 */
export const getEntry = (date) => {
  const entries = getAllEntries();
  return entries[date] || null;
};

/**
 * 일기 저장하기
 */
export const saveEntry = (date, photo, content) => {
  const entries = getAllEntries();

  entries[date] = {
    date,
    photo,
    content,
    timestamp: Date.now()
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error('데이터 저장 실패:', error);
    return false;
  }
};

/**
 * 일기 삭제하기
 */
export const deleteEntry = (date) => {
  const entries = getAllEntries();
  delete entries[date];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error('데이터 삭제 실패:', error);
    return false;
  }
};

/**
 * 총 일기 개수 가져오기
 */
export const getEntryCount = () => {
  const entries = getAllEntries();
  return Object.keys(entries).length;
};

/**
 * 날짜순으로 정렬된 일기 배열 가져오기 (최신순)
 */
export const getEntriesArray = () => {
  const entries = getAllEntries();
  return Object.values(entries).sort((a, b) => b.timestamp - a.timestamp);
};

/**
 * 특정 월의 일기 가져오기
 */
export const getEntriesByMonth = (year, month) => {
  const entries = getAllEntries();
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;

  return Object.entries(entries)
    .filter(([date]) => date.startsWith(monthStr))
    .reduce((acc, [date, entry]) => {
      acc[date] = entry;
      return acc;
    }, {});
};

/**
 * 사용자 시작 날짜 저장/불러오기
 */
export const getUserData = () => {
  try {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : { startDate: null };
  } catch (error) {
    console.error('사용자 데이터 로드 실패:', error);
    return { startDate: null };
  }
};

export const setStartDate = (date) => {
  const userData = getUserData();
  userData.startDate = date;

  try {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('시작 날짜 저장 실패:', error);
    return false;
  }
};

/**
 * 모든 데이터 초기화 (주의!)
 */
export const clearAllData = () => {
  if (confirm('정말로 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    return true;
  }
  return false;
};
