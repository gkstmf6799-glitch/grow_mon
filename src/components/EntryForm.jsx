import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Calendar, Save, X, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';

/**
 * 일지 작성 폼 컴포넌트
 */
const EntryForm = ({ onSave, onCancel, initialDate = null, existingEntry = null }) => {
  const [selectedDate, setSelectedDate] = useState(
    initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );
  const [photo, setPhoto] = useState(existingEntry?.photo || null);
  const [content, setContent] = useState(existingEntry?.content || '');
  const [previewUrl, setPreviewUrl] = useState(existingEntry?.photo || null);

  const fileInputRef = useRef(null);

  // 사진 선택 핸들러
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert('사진 크기는 5MB 이하여야 합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 사진 제거
  const handleRemovePhoto = () => {
    setPhoto(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 저장 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!photo) {
      alert('식물 사진을 추가해주세요!');
      return;
    }

    if (!content.trim()) {
      alert('오늘의 관찰 일기를 작성해주세요!');
      return;
    }

    onSave({
      date: selectedDate,
      photo,
      content: content.trim()
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-purple-50 pb-24">
      <div className="bg-white shadow-md border-b-4 border-textBrown px-6 py-4">
        <h2 className="text-xl font-bold text-textBrown text-center">
          ✏️ 식물 일기 작성
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6 max-w-lg mx-auto">
        {/* 날짜 선택 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 shadow-lg border-2 border-textBrown mb-4"
        >
          <label className="flex items-center text-sm font-bold text-textBrown mb-2">
            <Calendar className="mr-2" size={18} />
            날짜
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={format(new Date(), 'yyyy-MM-dd')}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-textBrown"
          />
        </motion.div>

        {/* 사진 업로드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-lg border-2 border-textBrown mb-4"
        >
          <label className="flex items-center text-sm font-bold text-textBrown mb-3">
            <Camera className="mr-2" size={18} />
            오늘의 식물 사진
          </label>

          {/* 사진 미리보기 */}
          {previewUrl ? (
            <div className="relative">
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={previewUrl}
                alt="식물 사진 미리보기"
                className="w-full h-64 object-cover rounded-lg border-2 border-primary"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleRemovePhoto}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600"
              >
                <X size={20} />
              </motion.button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer border-4 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors"
            >
              <ImageIcon className="mx-auto mb-3 text-gray-400" size={48} />
              <p className="text-gray-600 text-sm mb-2">
                사진을 선택하거나 드래그하세요
              </p>
              <p className="text-gray-400 text-xs">
                (JPG, PNG - 최대 5MB)
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />

          {!previewUrl && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full mt-3 bg-primary hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors flex items-center justify-center"
            >
              <Camera className="mr-2" size={20} />
              사진 선택
            </motion.button>
          )}
        </motion.div>

        {/* 관찰 일기 작성 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-lg border-2 border-textBrown mb-4"
        >
          <label className="flex items-center text-sm font-bold text-textBrown mb-3">
            📝 오늘의 관찰 일기
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 식물의 변화를 기록해보세요!&#10;예) 새 잎이 하나 더 났어요. 줄기가 조금 더 튼튼해진 것 같아요."
            rows={6}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none resize-none text-textBrown"
          />
          <div className="text-right mt-2 text-xs text-gray-500">
            {content.length} / 500자
          </div>
        </motion.div>

        {/* 버튼 그룹 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex space-x-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-textBrown font-bold py-4 px-6 rounded-xl shadow-lg transition-colors"
          >
            취소
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex-1 bg-primary hover:bg-green-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-colors flex items-center justify-center"
          >
            <Save className="mr-2" size={20} />
            저장하기
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
};

export default EntryForm;
