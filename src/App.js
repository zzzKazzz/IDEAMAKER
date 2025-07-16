import React, { useState, useEffect } from 'react';
import { Plus, Shuffle, Heart, Zap, X } from 'lucide-react';

export default function WordCombinationApp() {
  const [likeInput, setLikeInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [likeWords, setLikeWords] = useState([]);
  const [skillWords, setSkillWords] = useState([]);
  const [combination, setCombination] = useState('');
  const [combinationType, setCombinationType] = useState('');

  // コンポーネントマウント時にlocalStorageから単語を読み込み
  useEffect(() => {
    try {
      const savedLikeWords = JSON.parse(localStorage.getItem('likeWords') || '[]');
      const savedSkillWords = JSON.parse(localStorage.getItem('skillWords') || '[]');
      setLikeWords(savedLikeWords);
      setSkillWords(savedSkillWords);
    } catch (error) {
      console.error('保存された単語の読み込みに失敗しました:', error);
      setLikeWords([]);
      setSkillWords([]);
    }
  }, []);

  // 好きなことの単語が更新されるたびにlocalStorageに保存
  useEffect(() => {
    try {
      localStorage.setItem('likeWords', JSON.stringify(likeWords));
    } catch (error) {
      console.error('好きなことの保存に失敗しました:', error);
    }
  }, [likeWords]);

  // できることの単語が更新されるたびにlocalStorageに保存
  useEffect(() => {
    try {
      localStorage.setItem('skillWords', JSON.stringify(skillWords));
    } catch (error) {
      console.error('できることの保存に失敗しました:', error);
    }
  }, [skillWords]);

  const addLikeWord = () => {
    if (likeInput.trim() && !likeWords.includes(likeInput.trim())) {
      setLikeWords([...likeWords, likeInput.trim()]);
      setLikeInput('');
    }
  };

  const addSkillWord = () => {
    if (skillInput.trim() && !skillWords.includes(skillInput.trim())) {
      setSkillWords([...skillWords, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeLikeWord = (indexToRemove) => {
    setLikeWords(likeWords.filter((_, index) => index !== indexToRemove));
  };

  const removeSkillWord = (indexToRemove) => {
    setSkillWords(skillWords.filter((_, index) => index !== indexToRemove));
  };

  const generateLikeSkillCombination = () => {
    if (likeWords.length === 0 || skillWords.length === 0) {
      setCombination('「好きなこと」と「できること」を最低1つずつ追加してください');
      setCombinationType('error');
      return;
    }

    const randomLike = likeWords[Math.floor(Math.random() * likeWords.length)];
    const randomSkill = skillWords[Math.floor(Math.random() * skillWords.length)];
    setCombination(`${randomLike} × ${randomSkill}`);
    setCombinationType('like-skill');
  };

  const generateRandomCombination = () => {
    const allWords = [...likeWords, ...skillWords];
    if (allWords.length < 2) {
      setCombination('単語を2つ以上追加してください');
      setCombinationType('error');
      return;
    }

    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, 2);

    // どのカテゴリから選ばれたかを判定
    const word1IsLike = likeWords.includes(selectedWords[0]);
    const word2IsLike = likeWords.includes(selectedWords[1]);

    let typeText = '';
    if (word1IsLike && word2IsLike) {
      typeText = '好きなこと × 好きなこと';
    } else if (!word1IsLike && !word2IsLike) {
      typeText = 'できること × できること';
    } else {
      typeText = '好きなこと × できること';
    }

    setCombination(`${selectedWords[0]} × ${selectedWords[1]}`);
    setCombinationType(`random (${typeText})`);
  };

  const clearAllLikeWords = () => {
    if (window.confirm('「好きなこと」の単語を全て削除しますか？')) {
      setLikeWords([]);
    }
  };

  const clearAllSkillWords = () => {
    if (window.confirm('「できること」の単語を全て削除しますか？')) {
      setSkillWords([]);
    }
  };

  const handleLikeKeyPress = (e) => {
    if (e.key === 'Enter') {
      addLikeWord();
    }
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSkillWord();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🎯 好きなこと × できること 組み合わせアプリ
          </h1>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* 好きなこと入力エリア */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-pink-700 flex items-center gap-2">
                <Heart className="text-pink-600" size={24} />
                好きなこと
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={likeInput}
                  onChange={(e) => setLikeInput(e.target.value)}
                  onKeyPress={handleLikeKeyPress}
                  placeholder="好きなことを入力..."
                  className="flex-1 px-4 py-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                />
                <button
                  onClick={addLikeWord}
                  disabled={!likeInput.trim()}
                  className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                >
                  <Plus size={20} />
                  追加
                </button>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    保存済み ({likeWords.length}個)
                  </span>
                  {likeWords.length > 0 && (
                    <button
                      onClick={clearAllLikeWords}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors duration-200"
                    >
                      全削除
                    </button>
                  )}
                </div>
                {likeWords.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 bg-pink-50 rounded-lg text-sm">
                    好きなことを追加してください
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {likeWords.map((word, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-3 py-2 rounded-lg flex items-center justify-between group hover:shadow-lg transition-shadow duration-200"
                      >
                        <span className="font-medium text-sm">{word}</span>
                        <button
                          onClick={() => removeLikeWord(index)}
                          className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all duration-200"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* できること入力エリア */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
                <Zap className="text-blue-600" size={24} />
                できること
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleSkillKeyPress}
                  placeholder="できることを入力..."
                  className="flex-1 px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <button
                  onClick={addSkillWord}
                  disabled={!skillInput.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                >
                  <Plus size={20} />
                  追加
                </button>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    保存済み ({skillWords.length}個)
                  </span>
                  {skillWords.length > 0 && (
                    <button
                      onClick={clearAllSkillWords}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors duration-200"
                    >
                      全削除
                    </button>
                  )}
                </div>
                {skillWords.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 bg-blue-50 rounded-lg text-sm">
                    できることを追加してください
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {skillWords.map((word, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-between group hover:shadow-lg transition-shadow duration-200"
                      >
                        <span className="font-medium text-sm">{word}</span>
                        <button
                          onClick={() => removeSkillWord(index)}
                          className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all duration-200"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 組み合わせ生成ボタン */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
            <button
              onClick={generateLikeSkillCombination}
              disabled={likeWords.length === 0 || skillWords.length === 0}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3 justify-center text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              <Heart size={24} />
              <span>×</span>
              <Zap size={24} />
              好きなこと × できること
            </button>

            <button
              onClick={generateRandomCombination}
              disabled={likeWords.length + skillWords.length < 2}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3 justify-center text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              <Shuffle size={24} />
              ランダム組み合わせ
            </button>
          </div>

          {/* 結果表示 */}
          {combination && (
            <div className={`border rounded-lg p-6 text-center ${combinationType === 'error'
                ? 'bg-red-100 border-red-300'
                : 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300'
              }`}>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {combinationType === 'error' ? 'エラー:' : '生成された組み合わせ:'}
              </h3>
              <p className="text-2xl font-bold text-gray-800 bg-white px-4 py-3 rounded-lg shadow-inner">
                {combination}
              </p>
              {combinationType && combinationType !== 'error' && combinationType !== 'like-skill' && (
                <p className="text-sm text-gray-600 mt-2 font-medium">
                  パターン: {combinationType}
                </p>
              )}
            </div>
          )}
        </div>

        {/* 使い方説明 */}
        <div className="mt-8 bg-white bg-opacity-70 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">使い方</h3>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li>• 「好きなこと」と「できること」をそれぞれの入力欄に追加</li>
            <li>• 各カテゴリで何個でも単語を追加可能（重複は避けます）</li>
            <li>• 単語を削除したい場合は、単語にマウスを乗せて×ボタンをクリック</li>
            <li>• 「好きなこと × できること」ボタン: 各カテゴリから1つずつ選んで組み合わせ</li>
            <li>• 「ランダム組み合わせ」ボタン: 全ての単語からランダムに2つを選択</li>
            <li>• 🎉 すべての単語は自動保存され、ブラウザを閉じても残ります！</li>
          </ul>
        </div>
      </div>
    </div>
  );
}