/**
 * 반(클래스) 관련 Supabase 유틸리티
 */

import { supabase } from '../lib/supabase';

/**
 * 6자리 랜덤 코드 생성
 */
const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * 반 생성 (선생님용)
 */
export const createClass = async (className, school, grade, classNumber) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('로그인이 필요합니다');

    // 고유한 코드 생성 (중복 체크)
    let code = generateCode();
    let attempts = 0;
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from('classes')
        .select('id')
        .eq('code', code)
        .single();

      if (!existing) break;
      code = generateCode();
      attempts++;
    }

    // 반 생성
    const { data, error } = await supabase
      .from('classes')
      .insert({
        code,
        name: className,
        teacher_id: user.id,
        school,
        grade,
        class_number: classNumber,
      })
      .select()
      .single();

    if (error) throw error;

    // 생성자를 멤버로 추가 (teacher 역할)
    await supabase
      .from('class_members')
      .insert({
        class_id: data.id,
        user_id: user.id,
        role: 'teacher',
      });

    return { success: true, data };
  } catch (error) {
    console.error('반 생성 실패:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 반 참여 (학생용)
 */
export const joinClass = async (code) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('로그인이 필요합니다');

    // 코드로 반 찾기
    const { data: classData, error: findError } = await supabase
      .from('classes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (findError || !classData) {
      throw new Error('존재하지 않는 반 코드입니다');
    }

    // 이미 참여 중인지 확인
    const { data: existing } = await supabase
      .from('class_members')
      .select('id')
      .eq('class_id', classData.id)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      throw new Error('이미 참여 중인 반입니다');
    }

    // 반 참여
    const { error: joinError } = await supabase
      .from('class_members')
      .insert({
        class_id: classData.id,
        user_id: user.id,
        role: 'student',
      });

    if (joinError) throw joinError;

    return { success: true, data: classData };
  } catch (error) {
    console.error('반 참여 실패:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 내가 속한 반 정보 가져오기
 */
export const getMyClass = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('class_members')
      .select(`
        role,
        classes (
          id,
          code,
          name,
          school,
          grade,
          class_number,
          teacher_id
        )
      `)
      .eq('user_id', user.id)
      .single();

    if (error || !data) return null;

    return {
      ...data.classes,
      myRole: data.role,
      isTeacher: data.role === 'teacher',
    };
  } catch (error) {
    console.error('반 정보 조회 실패:', error);
    return null;
  }
};

/**
 * 반 탈퇴
 */
export const leaveClass = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('로그인이 필요합니다');

    const { error } = await supabase
      .from('class_members')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('반 탈퇴 실패:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 반 삭제 (선생님만)
 */
export const deleteClass = async (classId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('로그인이 필요합니다');

    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId)
      .eq('teacher_id', user.id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('반 삭제 실패:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 우리반 오늘의 피드 가져오기
 */
export const getClassFeed = async (date = null) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('로그인이 필요합니다');

    // 내가 속한 반 확인
    const myClass = await getMyClass();
    if (!myClass) {
      return { success: false, entries: [], error: '참여 중인 반이 없습니다' };
    }

    // 같은 반 멤버 ID 목록 가져오기
    const { data: members } = await supabase
      .from('class_members')
      .select('user_id')
      .eq('class_id', myClass.id);

    if (!members || members.length === 0) {
      return { success: true, entries: [], classInfo: myClass };
    }

    const memberIds = members.map(m => m.user_id);

    // 오늘 날짜 (또는 지정된 날짜)
    const targetDate = date || new Date().toISOString().split('T')[0];

    // 해당 날짜의 일기 가져오기 (프로필 정보 포함)
    const { data: entries, error } = await supabase
      .from('diary_entries')
      .select(`
        *,
        profiles!diary_entries_user_id_fkey (
          name,
          plant_name,
          avatar
        )
      `)
      .in('user_id', memberIds)
      .eq('date', targetDate)
      .order('created_at', { ascending: false });

    if (error) {
      // profiles 조인 실패시 일기만 가져오기
      const { data: entriesOnly } = await supabase
        .from('diary_entries')
        .select('*')
        .in('user_id', memberIds)
        .eq('date', targetDate)
        .order('created_at', { ascending: false });

      return {
        success: true,
        entries: entriesOnly || [],
        classInfo: myClass
      };
    }

    return { success: true, entries: entries || [], classInfo: myClass };
  } catch (error) {
    console.error('피드 조회 실패:', error);
    return { success: false, entries: [], error: error.message };
  }
};

/**
 * 반 멤버 목록 가져오기
 */
export const getClassMembers = async () => {
  try {
    const myClass = await getMyClass();
    if (!myClass) return [];

    const { data, error } = await supabase
      .from('class_members')
      .select(`
        user_id,
        role,
        joined_at,
        profiles!class_members_user_id_fkey (
          name,
          plant_name,
          avatar
        )
      `)
      .eq('class_id', myClass.id)
      .order('joined_at', { ascending: true });

    if (error) {
      // profiles 조인 실패시 멤버만
      const { data: membersOnly } = await supabase
        .from('class_members')
        .select('user_id, role, joined_at')
        .eq('class_id', myClass.id);
      return membersOnly || [];
    }

    return data || [];
  } catch (error) {
    console.error('멤버 조회 실패:', error);
    return [];
  }
};

// ==================== 관리자용 함수 ====================

/**
 * 모든 학급 목록 조회 (관리자용)
 */
export const getAllClasses = async () => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // 각 학급의 멤버 수 조회
    const classesWithCount = await Promise.all(
      (data || []).map(async (cls) => {
        const { count } = await supabase
          .from('class_members')
          .select('*', { count: 'exact', head: true })
          .eq('class_id', cls.id);
        return { ...cls, memberCount: count || 0 };
      })
    );

    return classesWithCount;
  } catch (error) {
    console.error('학급 목록 조회 실패:', error);
    return [];
  }
};

/**
 * 특정 학급의 멤버 목록 조회 (관리자용)
 */
export const getClassMembersById = async (classId) => {
  try {
    const { data, error } = await supabase
      .from('class_members')
      .select(`
        id,
        user_id,
        role,
        joined_at
      `)
      .eq('class_id', classId)
      .order('joined_at', { ascending: true });

    if (error) throw error;

    // 프로필 정보 별도 조회 (user_id로 조회)
    const membersWithProfiles = await Promise.all(
      (data || []).map(async (member) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, plant_name, avatar')
          .eq('user_id', member.user_id)
          .single();
        return { ...member, profile: profile || {} };
      })
    );

    return membersWithProfiles;
  } catch (error) {
    console.error('학급 멤버 조회 실패:', error);
    return [];
  }
};

/**
 * 학생을 학급에 추가 (관리자용)
 */
export const addUserToClass = async (userId, classId) => {
  try {
    // 이미 가입되어 있는지 확인
    const { data: existing } = await supabase
      .from('class_members')
      .select('id')
      .eq('user_id', userId)
      .eq('class_id', classId)
      .single();

    if (existing) {
      throw new Error('이미 해당 학급에 가입되어 있습니다');
    }

    // 다른 학급에 가입되어 있으면 탈퇴
    await supabase
      .from('class_members')
      .delete()
      .eq('user_id', userId);

    // 새 학급에 추가
    const { error } = await supabase
      .from('class_members')
      .insert({
        class_id: classId,
        user_id: userId,
        role: 'student',
      });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('학급 추가 실패:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 학생을 학급에서 제거 (관리자용)
 */
export const removeUserFromClass = async (userId, classId) => {
  try {
    const { error } = await supabase
      .from('class_members')
      .delete()
      .eq('user_id', userId)
      .eq('class_id', classId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('학급 제거 실패:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 학급에 속하지 않은 사용자 목록 조회 (관리자용)
 */
export const getUsersWithoutClass = async () => {
  try {
    // 모든 프로필 조회 (user_id 포함)
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('id, user_id, name, role')
      .order('created_at', { ascending: false });

    // 학급에 속한 사용자 ID 조회
    const { data: members } = await supabase
      .from('class_members')
      .select('user_id');

    const memberIds = (members || []).map(m => m.user_id);

    // 학급에 속하지 않은 사용자 필터링 (user_id로 비교)
    const usersWithoutClass = (allProfiles || []).filter(
      p => !memberIds.includes(p.user_id)
    );

    return usersWithoutClass;
  } catch (error) {
    console.error('미배정 사용자 조회 실패:', error);
    return [];
  }
};

/**
 * 사용자의 소속 학급 정보 조회
 */
export const getUserClassInfo = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('class_members')
      .select(`
        role,
        classes (
          id,
          name,
          code,
          school,
          grade,
          class_number
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;

    return data.classes;
  } catch (error) {
    return null;
  }
};
