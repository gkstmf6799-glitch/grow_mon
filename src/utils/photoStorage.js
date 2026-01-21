/**
 * Supabase Storage를 이용한 사진 업로드 유틸리티
 */

import { supabase } from '../lib/supabase';

const BUCKET_NAME = 'diary_photos';

/**
 * Base64 문자열을 Blob으로 변환
 */
const base64ToBlob = (base64String) => {
  // data:image/jpeg;base64, 부분 제거
  const base64Data = base64String.split(',')[1];
  const mimeType = base64String.split(',')[0].split(':')[1].split(';')[0];

  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

/**
 * 사진을 Supabase Storage에 업로드
 * @param {string} base64String - Base64 인코딩된 이미지 문자열
 * @param {string} userId - 사용자 ID
 * @param {string} date - 날짜 (YYYY-MM-DD)
 * @returns {Promise<string|null>} 업로드된 파일의 공개 URL 또는 null
 */
export const uploadPhoto = async (base64String, userId, date) => {
  if (!base64String) return null;

  try {
    // Base64를 Blob으로 변환
    const blob = base64ToBlob(base64String);

    // 파일명 생성: userId/YYYY-MM-DD_timestamp.jpg
    const timestamp = Date.now();
    const fileName = `${userId}/${date}_${timestamp}.jpg`;

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true, // 같은 이름 파일이 있으면 덮어쓰기
      });

    if (error) {
      console.error('사진 업로드 실패:', error);
      return null;
    }

    // 공개 URL 가져오기
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('사진 업로드 중 오류:', error);
    return null;
  }
};

/**
 * Storage에서 사진 삭제
 * @param {string} photoUrl - 삭제할 사진의 URL
 * @returns {Promise<boolean>} 삭제 성공 여부
 */
export const deletePhoto = async (photoUrl) => {
  if (!photoUrl) return true;

  try {
    // URL에서 파일 경로 추출
    const urlParts = photoUrl.split(`${BUCKET_NAME}/`);
    if (urlParts.length < 2) return true;

    const filePath = urlParts[1].split('?')[0]; // 쿼리 파라미터 제거

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('사진 삭제 실패:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('사진 삭제 중 오류:', error);
    return false;
  }
};

/**
 * 사진 URL이 Base64인지 Storage URL인지 확인
 */
export const isBase64 = (str) => {
  return str && str.startsWith('data:image');
};

/**
 * 기존 Base64 사진을 Storage로 마이그레이션
 */
export const migratePhotoToStorage = async (base64String, userId, date) => {
  if (!isBase64(base64String)) {
    // 이미 Storage URL이면 그대로 반환
    return base64String;
  }

  // Base64를 Storage에 업로드
  return await uploadPhoto(base64String, userId, date);
};
