import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // 로그인
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          onAuthSuccess(data.user);
        }
      } else {
        // 회원가입
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          alert('회원가입이 완료되었습니다! 이제 로그인해주세요.');
          setIsLogin(true);
          setPassword('');
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* 로고 */}
        <div className="text-center mb-8">
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="text-6xl mb-4"
          >
            🌱
          </motion.div>
          <h1 className="text-3xl font-bold text-primary mb-2">그로우몬</h1>
          <p className="text-textBrown/70">90일의 성장 여정</p>
        </div>

        {/* 탭 전환 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              isLogin
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              !isLogin
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textBrown mb-2">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textBrown mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
              placeholder="6자 이상"
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-600 p-3 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
          </motion.button>
        </form>

        {/* 안내 메시지 */}
        <div className="mt-6 text-center text-sm text-textBrown/60">
          {isLogin ? (
            <p>계정이 없으신가요? 회원가입 탭을 클릭하세요.</p>
          ) : (
            <p>이미 계정이 있으신가요? 로그인 탭을 클릭하세요.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
