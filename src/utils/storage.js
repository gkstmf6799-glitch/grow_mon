/**
 * 그로우몬 Supabase Storage 유틸리티
 * 90일간의 식물 일기 데이터를 Supabase에 저장하고 관리합니다.
 */

import { supabase } from '../lib/supabase';
import { uploadPhoto, deletePhoto, isBase64 } from './photoStorage';

/**
 * 모든 일기 항목 가져오기
 */
export const getAllEntries = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('로그인이 필요합니다');
    }

    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) throw error;

    // 데이터를 객체 형태로 변환 (날짜를 키로)
    const entries = {};
    data.forEach(entry => {
      entries[entry.date] = {
        date: entry.date,
        photo: entry.photo_url,
        content: {
          weather: entry.weather,
          temperature: entry.temperature,
          observation: entry.observation
        },
        timestamp: new Date(entry.created_at).getTime()
      };
    });

    return entries;
  } catch (error) {
    console.error('데이터 로드 실패:', error);
    return {};
  }
};

/**
 * 특정 날짜의 일기 가져오기
 */
export const getEntry = async (date) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('로그인이 필요합니다');
    }

    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 데이터 없음
        return null;
      }
      throw error;
    }

    return {
      date: data.date,
      photo: data.photo_url,
      content: {
        weather: data.weather,
        temperature: data.temperature,
        observation: data.observation
      },
      timestamp: new Date(data.created_at).getTime()
    };
  } catch (error) {
    console.error('일기 로드 실패:', error);
    return null;
  }
};

/**
 * 일기 저장하기
 */
export const saveEntry = async (date, photo, content) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('로그인이 필요합니다');
    }

    // 기존 데이터 확인
    const { data: existing } = await supabase
      .from('diary_entries')
      .select('id, photo_url')
      .eq('user_id', user.id)
      .eq('date', date)
      .single();

    // 사진 처리: Base64면 Storage에 업로드
    let photoUrl = photo || '';
    if (photo && isBase64(photo)) {
      const uploadedUrl = await uploadPhoto(photo, user.id, date);
      if (uploadedUrl) {
        photoUrl = uploadedUrl;

        // 기존 사진이 있으면 삭제
        if (existing?.photo_url && !isBase64(existing.photo_url)) {
          await deletePhoto(existing.photo_url);
        }
      }
    }

    const entryData = {
      user_id: user.id,
      date,
      weather: content.weather || '',
      temperature: content.temperature || '',
      observation: content.observation || '',
      photo_url: photoUrl,
    };

    if (existing) {
      // 업데이트
      const { error } = await supabase
        .from('diary_entries')
        .update(entryData)
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      // 새로 생성
      const { error } = await supabase
        .from('diary_entries')
        .insert([entryData]);

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error('데이터 저장 실패:', error);
    return false;
  }
};

/**
 * 일기 삭제하기
 */
export const deleteEntry = async (date) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('로그인이 필요합니다');
    }

    // 삭제 전 사진 URL 가져오기
    const { data: entry } = await supabase
      .from('diary_entries')
      .select('photo_url')
      .eq('user_id', user.id)
      .eq('date', date)
      .single();

    // Storage에서 사진 삭제
    if (entry?.photo_url && !isBase64(entry.photo_url)) {
      await deletePhoto(entry.photo_url);
    }

    // 데이터베이스에서 일기 삭제
    const { error } = await supabase
      .from('diary_entries')
      .delete()
      .eq('user_id', user.id)
      .eq('date', date);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('데이터 삭제 실패:', error);
    return false;
  }
};

/**
 * 총 일기 개수 가져오기
 */
export const getEntryCount = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return 0;
    }

    const { count, error } = await supabase
      .from('diary_entries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('일기 개수 조회 실패:', error);
    return 0;
  }
};

/**
 * 날짜순으로 정렬된 일기 배열 가져오기 (최신순)
 */
export const getEntriesArray = async () => {
  const entries = await getAllEntries();
  return Object.values(entries).sort((a, b) => b.timestamp - a.timestamp);
};

/**
 * 특정 월의 일기 가져오기
 */
export const getEntriesByMonth = async (year, month) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {};
    }

    const monthStr = `${year}-${String(month).padStart(2, '0')}`;

    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', `${monthStr}-01`)
      .lte('date', `${monthStr}-31`)
      .order('date', { ascending: false });

    if (error) throw error;

    const entries = {};
    data.forEach(entry => {
      entries[entry.date] = {
        date: entry.date,
        photo: entry.photo_url,
        content: {
          weather: entry.weather,
          temperature: entry.temperature,
          observation: entry.observation
        },
        timestamp: new Date(entry.created_at).getTime()
      };
    });

    return entries;
  } catch (error) {
    console.error('월별 데이터 로드 실패:', error);
    return {};
  }
};

/**
 * 프로필 데이터 가져오기
 */
export const getProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return getDefaultProfile();
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 프로필 없음 - 기본값 반환
        return getDefaultProfile();
      }
      throw error;
    }

    return {
      name: data.name || '',
      avatar: data.avatar || null,
      grade: data.grade || null,
      plantName: data.plant_name || '',
      plantType: '',
      startDate: data.start_date || null,
      school: data.school || '',
      classNumber: data.class_number || null,
      role: data.role || 'student',
      notificationTime: '20:00',
      notificationEnabled: false
    };
  } catch (error) {
    console.error('프로필 로드 실패:', error);
    return getDefaultProfile();
  }
};

const getDefaultProfile = () => ({
  name: '',
  avatar: null,
  grade: null,
  plantName: '',
  plantType: '',
  startDate: null,
  school: '',
  classNumber: null,
  role: 'student',
  notificationTime: '20:00',
  notificationEnabled: false
});

/**
 * 프로필 데이터 저장하기
 */
export const saveProfile = async (profileData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('로그인이 필요합니다');
    }

    // 기존 프로필 확인
    const { data: existing } = await supabase
      .from('profiles')
      .select('id, avatar')
      .eq('user_id', user.id)
      .single();

    // 아바타 사진 처리: Base64면 Storage에 업로드
    let avatarUrl = profileData.avatar || null;
    if (profileData.avatar && isBase64(profileData.avatar)) {
      const uploadedUrl = await uploadPhoto(profileData.avatar, user.id, 'avatar');
      if (uploadedUrl) {
        avatarUrl = uploadedUrl;

        // 기존 아바타가 있으면 삭제
        if (existing?.avatar && !isBase64(existing.avatar)) {
          await deletePhoto(existing.avatar);
        }
      }
    }

    const dbProfile = {
      user_id: user.id,
      name: profileData.name || '',
      plant_name: profileData.plantName || '',
      avatar: avatarUrl,
      school: profileData.school || '',
      grade: profileData.grade || null,
      class_number: profileData.classNumber || null,
      start_date: profileData.startDate || null,
    };

    if (existing) {
      // 업데이트
      const { error } = await supabase
        .from('profiles')
        .update(dbProfile)
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      // 새로 생성
      const { error } = await supabase
        .from('profiles')
        .insert([dbProfile]);

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error('프로필 저장 실패:', error);
    return false;
  }
};

/**
 * 프로필 특정 필드 업데이트
 */
export const updateProfileField = async (field, value) => {
  const profile = await getProfile();
  profile[field] = value;
  return await saveProfile(profile);
};

/**
 * 사용자 데이터 (하위 호환성)
 */
export const getUserData = async () => {
  const profile = await getProfile();
  return { startDate: profile.startDate };
};

export const setStartDate = async (date) => {
  return await updateProfileField('startDate', date);
};

/**
 * 모든 데이터 초기화 (주의!)
 */
export const clearAllData = async () => {
  if (confirm('정말로 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('로그인이 필요합니다');
      }

      // 모든 일기 삭제
      await supabase
        .from('diary_entries')
        .delete()
        .eq('user_id', user.id);

      // 프로필 삭제
      await supabase
        .from('profiles')
        .delete()
        .eq('user_id', user.id);

      return true;
    } catch (error) {
      console.error('데이터 초기화 실패:', error);
      return false;
    }
  }
  return false;
};

/**
 * 데이터 백업/복원 기능은 현재 미지원
 */
export const exportData = () => {
  alert('Supabase 버전에서는 데이터가 서버에 안전하게 저장됩니다.');
  return false;
};

export const importData = () => {
  alert('Supabase 버전에서는 데이터 가져오기가 지원되지 않습니다.');
  return Promise.reject(new Error('Not supported'));
};

/**
 * 사용자 역할(role) 가져오기
 */
export const getUserRole = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return 'student'; // 기본값
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('역할 조회 실패:', error);
      return 'student';
    }

    return data?.role || 'student';
  } catch (error) {
    console.error('역할 조회 실패:', error);
    return 'student';
  }
};

/**
 * 모든 사용자 목록 가져오기 (관리자 전용)
 */
export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, user_id, name, school, grade, class_number, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('사용자 목록 조회 실패:', error);
    return [];
  }
};

/**
 * 사용자 역할 변경 (관리자 전용)
 */
export const updateUserRole = async (userId, newRole) => {
  try {
    const { error } = await supabase.rpc('update_user_role', {
      target_user_id: userId,
      new_role: newRole
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('역할 변경 실패:', error);
    return { success: false, error: error.message };
  }
};
