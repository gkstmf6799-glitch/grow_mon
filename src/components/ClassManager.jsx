import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Plus, Copy, Check, LogOut, Trash2 } from 'lucide-react';
import {
  getMyClass,
  joinClass,
  createClass,
  leaveClass,
  deleteClass,
  getClassMembers
} from '../utils/classStorage';
import { getUserRole } from '../utils/storage';

/**
 * 반 관리 컴포넌트
 * - 반 참여/생성
 * - 반 정보 확인
 * - 반 탈퇴/삭제
 */
const ClassManager = ({ onBack }) => {
  const [myClass, setMyClass] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('menu'); // menu, join, create
  const [copied, setCopied] = useState(false);
  const [userRole, setUserRole] = useState('student');

  // 폼 상태
  const [joinCode, setJoinCode] = useState('');
  const [className, setClassName] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');
  const [classNumber, setClassNumber] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadClassInfo();
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    const role = await getUserRole();
    setUserRole(role);
  };

  const loadClassInfo = async () => {
    setLoading(true);
    const classData = await getMyClass();
    setMyClass(classData);

    if (classData) {
      const memberList = await getClassMembers();
      setMembers(memberList);
    }

    setLoading(false);
  };

  // 반 참여
  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await joinClass(joinCode);

    if (result.success) {
      await loadClassInfo();
      setMode('menu');
    } else {
      setError(result.error || '반 참여에 실패했습니다');
    }

    setSubmitting(false);
  };

  // 반 생성
  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await createClass(
      className,
      school,
      parseInt(grade) || null,
      parseInt(classNumber) || null
    );

    if (result.success) {
      await loadClassInfo();
      setMode('menu');
    } else {
      setError(result.error || '반 생성에 실패했습니다');
    }

    setSubmitting(false);
  };

  // 반 탈퇴
  const handleLeave = async () => {
    if (!confirm('정말로 반을 나가시겠습니까?')) return;

    const result = await leaveClass();
    if (result.success) {
      setMyClass(null);
      setMembers([]);
    } else {
      alert(result.error || '탈퇴에 실패했습니다');
    }
  };

  // 반 삭제 (선생님만)
  const handleDelete = async () => {
    if (!confirm('정말로 반을 삭제하시겠습니까? 모든 멤버가 탈퇴됩니다.')) return;

    const result = await deleteClass(myClass.id);
    if (result.success) {
      setMyClass(null);
      setMembers([]);
    } else {
      alert(result.error || '삭제에 실패했습니다');
    }
  };

  // 코드 복사
  const copyCode = () => {
    navigator.clipboard.writeText(myClass.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🏫</div>
          <p className="text-gray-600">불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 이미 반에 참여 중인 경우 - 반 정보 표시
  if (myClass) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-blue-50 pb-8">
        {/* 헤더 */}
        <div className="bg-white shadow-md border-b-4 border-blue-400 px-6 py-4">
          <h2 className="text-xl font-bold text-textBrown text-center">
            반 관리
          </h2>
        </div>

        <div className="px-4 py-6 max-w-md mx-auto space-y-4">
          {/* 반 정보 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🏫</div>
              <h3 className="text-xl font-bold text-textBrown">{myClass.name}</h3>
              {myClass.school && (
                <p className="text-sm text-gray-600">
                  {myClass.school} {myClass.grade && `${myClass.grade}학년`} {myClass.class_number && `${myClass.class_number}반`}
                </p>
              )}
            </div>

            {/* 반 코드 */}
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-600 text-center mb-2">반 코드</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-mono font-bold text-blue-600 tracking-widest">
                  {myClass.code}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={copyCode}
                  className="p-2 rounded-lg bg-blue-100"
                >
                  {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-blue-600" />}
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                이 코드를 친구들에게 공유하세요!
              </p>
            </div>

            {/* 역할 표시 */}
            <div className="text-center mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                myClass.isTeacher ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
              }`}>
                {myClass.isTeacher ? '선생님' : '학생'}
              </span>
            </div>

            {/* 멤버 수 */}
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Users size={18} />
              <span>{members.length}명 참여 중</span>
            </div>
          </motion.div>

          {/* 멤버 목록 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-4"
          >
            <h4 className="font-bold text-textBrown mb-3">멤버 목록</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {members.map((member, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                    {member.profiles?.avatar ? (
                      <img
                        src={member.profiles.avatar}
                        alt="프로필"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>🌱</span>
                    )}
                  </div>
                  <span className="flex-1 text-sm text-textBrown">
                    {member.profiles?.name || '이름 없음'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    member.role === 'teacher' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {member.role === 'teacher' ? '선생님' : '학생'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 액션 버튼 */}
          <div className="space-y-2">
            {myClass.isTeacher ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl font-semibold"
              >
                <Trash2 size={18} />
                반 삭제하기
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLeave}
                className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl font-semibold"
              >
                <LogOut size={18} />
                반 나가기
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold"
            >
              돌아가기
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // 반에 참여하지 않은 경우 - 참여/생성 메뉴
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50 pb-8">
      {/* 헤더 */}
      <div className="bg-white shadow-md border-b-4 border-blue-400 px-6 py-4">
        <h2 className="text-xl font-bold text-textBrown text-center">
          반 관리
        </h2>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto">
        {mode === 'menu' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🏫</div>
              <h3 className="text-xl font-bold text-textBrown mb-2">
                반에 참여하세요
              </h3>
              <p className="text-gray-600 text-sm">
                친구들과 함께 식물 일기를 공유해요
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('join')}
              className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white py-4 rounded-2xl font-semibold shadow-lg"
            >
              <UserPlus size={22} />
              코드로 반 참여하기
            </motion.button>

            {userRole === 'teacher' && (
              <>
                <div className="text-center text-gray-500 my-4">또는</div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMode('create')}
                  className="w-full flex items-center justify-center gap-3 bg-green-500 text-white py-4 rounded-2xl font-semibold shadow-lg"
                >
                  <Plus size={22} />
                  새 반 만들기
                </motion.button>
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold mt-4"
            >
              돌아가기
            </motion.button>
          </motion.div>
        )}

        {mode === 'join' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-xl font-bold text-textBrown mb-6 text-center">
              반 코드 입력
            </h3>

            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  placeholder="6자리 코드 입력"
                  className="w-full text-center text-2xl font-mono tracking-widest px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={joinCode.length !== 6 || submitting}
                className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50"
              >
                {submitting ? '참여 중...' : '참여하기'}
              </motion.button>

              <button
                type="button"
                onClick={() => { setMode('menu'); setError(''); setJoinCode(''); }}
                className="w-full text-gray-600 py-2"
              >
                뒤로
              </button>
            </form>
          </motion.div>
        )}

        {mode === 'create' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-xl font-bold text-textBrown mb-6 text-center">
              새 반 만들기
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-textBrown mb-1">
                  반 이름 *
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="예: 우리반 식물 일기"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textBrown mb-1">
                  학교 이름
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="예: 행복초등학교"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-textBrown mb-1">
                    학년
                  </label>
                  <input
                    type="number"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    min="1"
                    max="6"
                    placeholder="3"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-textBrown mb-1">
                    반
                  </label>
                  <input
                    type="number"
                    value={classNumber}
                    onChange={(e) => setClassNumber(e.target.value)}
                    min="1"
                    placeholder="2"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!className || submitting}
                className="w-full bg-green-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50"
              >
                {submitting ? '만드는 중...' : '반 만들기'}
              </motion.button>

              <button
                type="button"
                onClick={() => { setMode('menu'); setError(''); }}
                className="w-full text-gray-600 py-2"
              >
                뒤로
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ClassManager;
