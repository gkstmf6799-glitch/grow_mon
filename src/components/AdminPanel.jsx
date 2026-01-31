import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Users as UsersIcon, GraduationCap } from 'lucide-react';
import { getAllUsers, updateUserRole, getUserRole } from '../utils/storage';

/**
 * 관리자 패널 - 사용자 역할 관리
 * admin 권한이 있는 사용자만 접근 가능
 */
const AdminPanel = ({ onBack }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    checkAdmin();
    loadUsers();
  }, []);

  const checkAdmin = async () => {
    const role = await getUserRole();
    setIsAdmin(role === 'admin');
  };

  const loadUsers = async () => {
    setLoading(true);
    const userList = await getAllUsers();
    setUsers(userList);
    setLoading(false);
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!confirm(`이 사용자의 역할을 ${getRoleLabel(newRole)}(으)로 변경하시겠습니까?`)) {
      return;
    }

    setUpdating(userId);
    const result = await updateUserRole(userId, newRole);

    if (result.success) {
      await loadUsers();
      alert('역할이 변경되었습니다.');
    } else {
      alert(`역할 변경 실패: ${result.error}`);
    }

    setUpdating(null);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return '관리자';
      case 'teacher': return '교사';
      case 'student': return '학생';
      default: return '알 수 없음';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'teacher': return 'bg-yellow-100 text-yellow-700';
      case 'student': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return Shield;
      case 'teacher': return GraduationCap;
      case 'student': return User;
      default: return User;
    }
  };

  // 관리자가 아닌 경우
  if (!loading && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-red-50 pb-8">
        <div className="bg-white shadow-md border-b-4 border-red-400 px-6 py-4">
          <h2 className="text-xl font-bold text-textBrown text-center">
            관리자 패널
          </h2>
        </div>

        <div className="px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="text-6xl mb-6">🔒</div>
            <h3 className="text-xl font-bold text-textBrown mb-3">
              접근 권한이 없습니다
            </h3>
            <p className="text-gray-600 mb-8">
              이 페이지는 관리자만 접근할 수 있습니다.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="w-full max-w-xs mx-auto bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold"
            >
              돌아가기
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-red-50 pb-8">
      {/* 헤더 */}
      <div className="bg-white shadow-md border-b-4 border-red-400 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-textBrown">
            <Shield className="inline mr-2" size={20} />
            관리자 패널
          </h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm"
          >
            돌아가기
          </motion.button>
        </div>
      </div>

      {/* 통계 */}
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-4 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-4 text-center"
          >
            <UsersIcon className="mx-auto mb-2 text-blue-500" size={24} />
            <p className="text-2xl font-bold text-textBrown">{users.length}</p>
            <p className="text-xs text-gray-600">전체 사용자</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-4 text-center"
          >
            <User className="mx-auto mb-2 text-green-500" size={24} />
            <p className="text-2xl font-bold text-textBrown">
              {users.filter(u => u.role === 'student').length}
            </p>
            <p className="text-xs text-gray-600">학생</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-4 text-center"
          >
            <GraduationCap className="mx-auto mb-2 text-yellow-500" size={24} />
            <p className="text-2xl font-bold text-textBrown">
              {users.filter(u => u.role === 'teacher').length}
            </p>
            <p className="text-xs text-gray-600">교사</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-4 text-center"
          >
            <Shield className="mx-auto mb-2 text-red-500" size={24} />
            <p className="text-2xl font-bold text-textBrown">
              {users.filter(u => u.role === 'admin').length}
            </p>
            <p className="text-xs text-gray-600">관리자</p>
          </motion.div>
        </div>

        {/* 사용자 목록 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-bold text-textBrown">사용자 목록</h3>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4 animate-bounce">⚙️</div>
              <p className="text-gray-600">불러오는 중...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-gray-600">사용자가 없습니다</p>
            </div>
          ) : (
            <div className="max-h-[500px] overflow-y-auto">
              {users.map((user, index) => {
                const RoleIcon = getRoleIcon(user.role);

                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border-b hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* 사용자 정보 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <RoleIcon size={16} className="text-gray-500" />
                          <p className="font-semibold text-textBrown">
                            {user.name || '이름 없음'}
                          </p>
                        </div>
                        <div className="text-xs text-gray-600">
                          {user.school && `${user.school} `}
                          {user.grade && `${user.grade}학년 `}
                          {user.class_number && `${user.class_number}반`}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          가입: {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {/* 역할 변경 버튼 */}
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>

                        {updating === user.user_id ? (
                          <div className="text-xs text-gray-500">변경 중...</div>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                            className="text-xs border rounded px-2 py-1 bg-white cursor-pointer"
                          >
                            <option value="student">학생</option>
                            <option value="teacher">교사</option>
                            <option value="admin">관리자</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* 안내 메시지 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4"
        >
          <p className="text-sm text-yellow-800">
            <strong>⚠️ 주의:</strong> 역할 변경은 즉시 적용됩니다. 교사는 반을 생성할 수 있으며, 관리자는 모든 사용자의 역할을 변경할 수 있습니다.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;