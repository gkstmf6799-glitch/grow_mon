import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, User, Users as UsersIcon, GraduationCap,
  School, Plus, Copy, Trash2, UserPlus, UserMinus, X, Check
} from 'lucide-react';
import { getAllUsers, updateUserRole, getUserRole } from '../utils/storage';
import {
  getAllClasses, getClassMembersById, createClass,
  addUserToClass, removeUserFromClass, getUsersWithoutClass, deleteClass
} from '../utils/classStorage';

/**
 * 관리자 패널 - 사용자 및 학급 관리
 * admin 권한이 있는 사용자만 접근 가능
 */
const AdminPanel = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'classes'
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updating, setUpdating] = useState(null);

  // 학급 관리 상태
  const [selectedClass, setSelectedClass] = useState(null);
  const [classMembers, setClassMembers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [usersWithoutClass, setUsersWithoutClass] = useState([]);

  // 학급 생성 폼
  const [newClass, setNewClass] = useState({
    name: '',
    school: '',
    grade: '',
    classNumber: ''
  });

  useEffect(() => {
    checkAdmin();
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'classes') {
      loadClasses();
    }
  }, [activeTab]);

  const checkAdmin = async () => {
    const role = await getUserRole();
    setIsAdmin(role === 'admin');
  };

  const loadData = async () => {
    setLoading(true);
    const userList = await getAllUsers();
    setUsers(userList);
    setLoading(false);
  };

  const loadClasses = async () => {
    const classList = await getAllClasses();
    setClasses(classList);
  };

  const loadClassMembers = async (classId) => {
    const members = await getClassMembersById(classId);
    setClassMembers(members);
  };

  const loadUsersWithoutClass = async () => {
    const users = await getUsersWithoutClass();
    setUsersWithoutClass(users);
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!confirm(`이 사용자의 역할을 ${getRoleLabel(newRole)}(으)로 변경하시겠습니까?`)) {
      return;
    }

    setUpdating(userId);
    const result = await updateUserRole(userId, newRole);

    if (result.success) {
      await loadData();
      alert('역할이 변경되었습니다.');
    } else {
      alert(`역할 변경 실패: ${result.error}`);
    }

    setUpdating(null);
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClass.name.trim()) {
      alert('학급명을 입력해주세요.');
      return;
    }

    const result = await createClass(
      newClass.name,
      newClass.school,
      newClass.grade,
      newClass.classNumber
    );

    if (result.success) {
      alert('학급이 생성되었습니다!');
      setShowCreateForm(false);
      setNewClass({ name: '', school: '', grade: '', classNumber: '' });
      await loadClasses();
    } else {
      alert(`학급 생성 실패: ${result.error}`);
    }
  };

  const handleDeleteClass = async (classId, className) => {
    if (!confirm(`"${className}" 학급을 삭제하시겠습니까?\n모든 멤버가 학급에서 제거됩니다.`)) {
      return;
    }

    const result = await deleteClass(classId);
    if (result.success) {
      alert('학급이 삭제되었습니다.');
      setSelectedClass(null);
      await loadClasses();
    } else {
      alert(`삭제 실패: ${result.error}`);
    }
  };

  const handleAddMember = async (userId) => {
    if (!selectedClass) return;

    const result = await addUserToClass(userId, selectedClass.id);
    if (result.success) {
      await loadClassMembers(selectedClass.id);
      await loadUsersWithoutClass();
      await loadClasses();
    } else {
      alert(`추가 실패: ${result.error}`);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!selectedClass) return;
    if (!confirm('이 학생을 학급에서 제거하시겠습니까?')) return;

    const result = await removeUserFromClass(userId, selectedClass.id);
    if (result.success) {
      await loadClassMembers(selectedClass.id);
      await loadClasses();
    } else {
      alert(`제거 실패: ${result.error}`);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`학급 코드가 복사되었습니다: ${code}`);
  };

  const openClassDetail = async (cls) => {
    setSelectedClass(cls);
    await loadClassMembers(cls.id);
  };

  const openAddMember = async () => {
    await loadUsersWithoutClass();
    setShowAddMember(true);
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

      {/* 탭 네비게이션 */}
      <div className="px-4 pt-4 max-w-4xl mx-auto">
        <div className="flex bg-white rounded-xl shadow-md p-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'users'
                ? 'bg-red-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UsersIcon size={18} />
            사용자 관리
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'classes'
                ? 'bg-red-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <School size={18} />
            학급 관리
          </button>
        </div>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* 사용자 관리 탭 */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* 통계 */}
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
                <div className="max-h-[400px] overflow-y-auto">
                  {users.map((user, index) => {
                    const RoleIcon = getRoleIcon(user.role);

                    return (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="p-4 border-b hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
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
          </motion.div>
        )}

        {/* 학급 관리 탭 */}
        {activeTab === 'classes' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* 학급 통계 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-md p-4 text-center">
                <School className="mx-auto mb-2 text-purple-500" size={24} />
                <p className="text-2xl font-bold text-textBrown">{classes.length}</p>
                <p className="text-xs text-gray-600">전체 학급</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 text-center">
                <UsersIcon className="mx-auto mb-2 text-blue-500" size={24} />
                <p className="text-2xl font-bold text-textBrown">
                  {classes.reduce((sum, c) => sum + (c.memberCount || 0), 0)}
                </p>
                <p className="text-xs text-gray-600">배정된 학생</p>
              </div>
            </div>

            {/* 학급 생성 버튼 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateForm(true)}
              className="w-full mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
            >
              <Plus size={20} />
              새 학급 만들기
            </motion.button>

            {/* 학급 목록 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-bold text-textBrown">학급 목록</h3>
              </div>

              {classes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏫</div>
                  <p className="text-gray-600">등록된 학급이 없습니다</p>
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto">
                  {classes.map((cls, index) => (
                    <motion.div
                      key={cls.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => openClassDetail(cls)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-textBrown">{cls.name}</p>
                          <p className="text-xs text-gray-600">
                            {cls.school && `${cls.school} `}
                            {cls.grade && `${cls.grade}학년 `}
                            {cls.class_number && `${cls.class_number}반`}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <p className="text-lg font-bold text-purple-600">{cls.memberCount || 0}</p>
                            <p className="text-xs text-gray-500">명</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyCode(cls.code);
                            }}
                            className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-mono flex items-center gap-1 hover:bg-gray-200"
                          >
                            <Copy size={12} />
                            {cls.code}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 안내 메시지 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4"
        >
          <p className="text-sm text-yellow-800">
            {activeTab === 'users' ? (
              <>
                <strong>⚠️ 주의:</strong> 역할 변경은 즉시 적용됩니다. 교사는 반을 생성할 수 있으며, 관리자는 모든 사용자의 역할을 변경할 수 있습니다.
              </>
            ) : (
              <>
                <strong>💡 팁:</strong> 학급 코드를 학생들에게 공유하면 학생들이 직접 학급에 가입할 수 있습니다. 또는 학급을 클릭하여 학생을 직접 배정할 수도 있습니다.
              </>
            )}
          </p>
        </motion.div>
      </div>

      {/* 학급 생성 모달 */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-textBrown mb-4">새 학급 만들기</h3>

              <form onSubmit={handleCreateClass} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    학급명 *
                  </label>
                  <input
                    type="text"
                    value={newClass.name}
                    onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                    placeholder="예: 6학년 2반 식물반"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    학교명
                  </label>
                  <input
                    type="text"
                    value={newClass.school}
                    onChange={(e) => setNewClass({ ...newClass, school: e.target.value })}
                    placeholder="예: 서울초등학교"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      학년
                    </label>
                    <input
                      type="number"
                      value={newClass.grade}
                      onChange={(e) => setNewClass({ ...newClass, grade: e.target.value })}
                      placeholder="6"
                      min="1"
                      max="6"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      반
                    </label>
                    <input
                      type="number"
                      value={newClass.classNumber}
                      onChange={(e) => setNewClass({ ...newClass, classNumber: e.target.value })}
                      placeholder="2"
                      min="1"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold"
                  >
                    생성하기
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 학급 상세 모달 */}
      <AnimatePresence>
        {selectedClass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedClass(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-textBrown">{selectedClass.name}</h3>
                <button
                  onClick={() => setSelectedClass(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              {/* 학급 정보 */}
              <div className="bg-purple-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">학급 코드</span>
                  <button
                    onClick={() => copyCode(selectedClass.code)}
                    className="flex items-center gap-1 px-3 py-1 bg-white rounded-lg text-sm font-mono"
                  >
                    <Copy size={14} />
                    {selectedClass.code}
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedClass.school && `${selectedClass.school} `}
                  {selectedClass.grade && `${selectedClass.grade}학년 `}
                  {selectedClass.class_number && `${selectedClass.class_number}반`}
                </p>
              </div>

              {/* 멤버 목록 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-textBrown">
                    멤버 ({classMembers.length}명)
                  </h4>
                  <button
                    onClick={openAddMember}
                    className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg text-sm"
                  >
                    <UserPlus size={14} />
                    추가
                  </button>
                </div>

                {classMembers.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">멤버가 없습니다</p>
                ) : (
                  <div className="space-y-2">
                    {classMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-textBrown">
                            {member.profile?.name || '이름 없음'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {member.role === 'teacher' ? '교사' : '학생'}
                          </p>
                        </div>
                        {member.role !== 'teacher' && (
                          <button
                            onClick={() => handleRemoveMember(member.user_id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <UserMinus size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 학급 삭제 버튼 */}
              <button
                onClick={() => handleDeleteClass(selectedClass.id, selectedClass.name)}
                className="w-full py-3 bg-red-100 text-red-600 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                학급 삭제
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 멤버 추가 모달 */}
      <AnimatePresence>
        {showAddMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddMember(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-textBrown">학생 추가</h3>
                <button
                  onClick={() => setShowAddMember(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                학급에 배정되지 않은 사용자 목록입니다.
              </p>

              {usersWithoutClass.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  배정 가능한 사용자가 없습니다
                </p>
              ) : (
                <div className="space-y-2">
                  {usersWithoutClass.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-textBrown">
                          {user.name || '이름 없음'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getRoleLabel(user.role)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddMember(user.id)}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
