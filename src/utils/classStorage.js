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
