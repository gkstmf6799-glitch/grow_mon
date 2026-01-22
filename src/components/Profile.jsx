import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Camera,
  Leaf,
  Calendar,
  TrendingUp,
  Award,
  BarChart3,
  Settings,
  Download,
  Upload,
  Trash2,
  Bell,
  BellOff,
  Save,
  LogOut,
  Shield
} from 'lucide-react';
import { getProfile, saveProfile, exportData, importData, clearAllData } from '../utils/storage';
import { getEvolutionStage } from '../utils/evolution';
import { supabase } from '../lib/supabase';
import {
  calculateStreak,
  getMostActiveDay,
  getOverallProgress,
  getDaysSinceStart,
  getAverageWeeklyEntries,
  getWeeklyTrend
} from '../utils/statistics';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 프로필 페이지 컴포넌트
 */
function Profile({ entries, entryCount, onNavigate }) {
  const [profile, setProfile] = useState({
    name: '',
    avatar: null,
    grade: null,
    plantName: '',
    plantType: '',
    startDate: null,
    notificationTime: '20:00',
    notificationEnabled: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const fileInputRef = useRef(null);
  const importInputRef = useRef(null);

  // 프로필 데이터 로드
  useEffect(() => {
    const loadProfile = async () => {
      const loadedProfile = await getProfile();
      setProfile(loadedProfile);
      setEditedProfile(loadedProfile);
    };
    loadProfile();
  }, []);

  // 통계 데이터 계산
  const streak = calculateStreak(entries);
  const mostActiveDay = getMostActiveDay(entries);
  const overallProgress = getOverallProgress(entryCount);
  const daysSinceStart = getDaysSinceStart(profile.startDate);
  const averageWeekly = getAverageWeeklyEntries(entries, profile.startDate);
  const currentStage = getEvolutionStage(entryCount);
  const weeklyTrend = getWeeklyTrend(entries);

  // 프로필 저장
  const handleSaveProfile = async () => {
    const success = await saveProfile(editedProfile);
    if (success) {
      setProfile(editedProfile);
      setIsEditing(false);
      alert('프로필이 저장되었습니다! 🎉');
    } else {
      alert('프로필 저장에 실패했습니다.');
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    if (confirm('정말 로그아웃하시겠습니까?')) {
      await supabase.auth.signOut();
      window.location.reload();
    }
  };

  // 프로필 수정 취소
  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  // 아바타 이미지 업로드
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 크기 체크 (2MB 제한)
    if (file.size > 2 * 1024 * 1024) {
      alert('이미지 크기는 2MB 이하여야 합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedProfile({ ...editedProfile, avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // 데이터 백업
  const handleExportData = () => {
    try {
      exportData();
      alert('데이터가 다운로드되었습니다! 💾');
    } catch (error) {
      alert('백업 실패: ' + error.message);
    }
  };

  // 데이터 복원
  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    importData(file)
      .then(() => {
        alert('데이터가 복원되었습니다! 🎉\n페이지를 새로고침합니다.');
        window.location.reload();
      })
      .catch((error) => {
        alert('복원 실패: ' + error.message);
      });
  };

  // 모든 데이터 초기화
  const handleClearAll = async () => {
    if (await clearAllData()) {
      alert('모든 데이터가 삭제되었습니다.\n페이지를 새로고침합니다.');
      window.location.reload();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20"
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-textBrown flex items-center gap-2">
            <User className="w-6 h-6" />
            프로필
          </h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              수정하기
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
              >
                <Save className="w-4 h-4" />
                저장
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
            </div>
          )}
        </div>

        {/* 사용자 정보 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-textBrown mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            사용자 정보
          </h2>

          <div className="flex items-center gap-6">
            {/* 아바타 */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {editedProfile.avatar ? (
                  <img
                    src={editedProfile.avatar}
                    alt="프로필"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            {/* 정보 입력 */}
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">이름</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, name: e.target.value })
                    }
                    placeholder="이름을 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-textBrown font-medium">
                    {profile.name || '이름을 설정해주세요'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">학년</label>
                {isEditing ? (
                  <select
                    value={editedProfile.grade || ''}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, grade: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">선택하세요</option>
                    <option value="4">초등 4학년</option>
                    <option value="5">초등 5학년</option>
                    <option value="6">초등 6학년</option>
                  </select>
                ) : (
                  <p className="text-textBrown font-medium">
                    {profile.grade ? `초등 ${profile.grade}학년` : '학년을 설정해주세요'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">역할</label>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                    profile.role === 'admin' ? 'bg-red-100 text-red-700' :
                    profile.role === 'teacher' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {profile.role === 'admin' && <Shield className="w-3 h-3" />}
                    {profile.role === 'admin' && '관리자'}
                    {profile.role === 'teacher' && '교사'}
                    {profile.role === 'student' && '학생'}
                  </span>
                  {profile.role === 'admin' && onNavigate && (
                    <button
                      onClick={() => onNavigate('admin')}
                      className="text-xs text-red-600 hover:underline"
                    >
                      관리자 패널
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 식물 정보 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-textBrown mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            식물 정보
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">식물 이름</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.plantName}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, plantName: e.target.value })
                  }
                  placeholder="예: 초록이"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-textBrown font-medium">
                  {profile.plantName || '식물 이름을 설정해주세요'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">식물 종류</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.plantType}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, plantType: e.target.value })
                  }
                  placeholder="예: 방울토마토"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-textBrown font-medium">
                  {profile.plantType || '식물 종류를 설정해주세요'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">시작일</label>
              {isEditing ? (
                <input
                  type="date"
                  value={editedProfile.startDate || ''}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, startDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-textBrown font-medium">
                  {profile.startDate
                    ? format(new Date(profile.startDate), 'yyyy년 MM월 dd일', { locale: ko })
                    : '시작일을 설정해주세요'}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">경과 일수</label>
                <p className="text-2xl font-bold text-primary">
                  {daysSinceStart > 0 ? `D+${daysSinceStart}` : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 통계 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-textBrown mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            나의 통계
          </h2>

          {/* 주요 통계 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">전체 달성률</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{overallProgress}%</p>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-gray-600">연속 기록</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{streak}일</p>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">총 기록</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{entryCount}개</p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{currentStage.emoji}</span>
                <span className="text-sm text-gray-600">현재 단계</span>
              </div>
              <p className="text-lg font-bold text-purple-600">{currentStage.name}</p>
            </div>
          </div>

          {/* 추가 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">가장 많이 기록한 요일</p>
              <p className="text-xl font-bold text-textBrown">{mostActiveDay}</p>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">주간 평균 기록</p>
              <p className="text-xl font-bold text-textBrown">{averageWeekly}개</p>
            </div>
          </div>

          {/* 주간 추세 */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-3">최근 4주 기록 추세</p>
            <div className="flex items-end justify-between gap-2 h-32">
              {weeklyTrend.map((week, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-green-200 rounded-t-lg relative" style={{ height: `${Math.max(week.count * 10, 5)}%` }}>
                    <div className="absolute -top-6 left-0 right-0 text-center text-sm font-bold text-textBrown">
                      {week.count}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{week.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 설정 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-textBrown mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            설정
          </h2>

          <div className="space-y-4">
            {/* 알림 설정 */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3">
                {editedProfile.notificationEnabled ? (
                  <Bell className="w-5 h-5 text-primary" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-textBrown">매일 알림</p>
                  <p className="text-sm text-gray-500">
                    {editedProfile.notificationEnabled
                      ? `매일 ${editedProfile.notificationTime}에 알림`
                      : '알림 꺼짐'}
                  </p>
                </div>
              </div>
              {isEditing && (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={editedProfile.notificationTime}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, notificationTime: e.target.value })
                    }
                    className="px-2 py-1 border border-gray-300 rounded"
                  />
                  <button
                    onClick={() =>
                      setEditedProfile({
                        ...editedProfile,
                        notificationEnabled: !editedProfile.notificationEnabled
                      })
                    }
                    className={`px-3 py-1 rounded ${
                      editedProfile.notificationEnabled
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {editedProfile.notificationEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              )}
            </div>

            {/* 데이터 백업 */}
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-textBrown">데이터 백업</p>
                  <p className="text-sm text-gray-500">모든 데이터를 JSON 파일로 다운로드</p>
                </div>
              </div>
            </button>

            {/* 데이터 복원 */}
            <button
              onClick={() => importInputRef.current?.click()}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-textBrown">데이터 복원</p>
                  <p className="text-sm text-gray-500">백업 파일에서 데이터 불러오기</p>
                </div>
              </div>
            </button>
            <input
              ref={importInputRef}
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />

            {/* 로그아웃 */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-medium text-textBrown">로그아웃</p>
                  <p className="text-sm text-gray-500">현재 계정에서 로그아웃합니다</p>
                </div>
              </div>
            </button>

            {/* 모든 데이터 초기화 */}
            <button
              onClick={handleClearAll}
              className="w-full flex items-center justify-between p-4 border-2 border-red-200 rounded-xl hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <p className="font-medium text-red-600">모든 데이터 초기화</p>
                  <p className="text-sm text-red-400">주의: 이 작업은 되돌릴 수 없습니다</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;
