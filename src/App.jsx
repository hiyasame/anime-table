import React, { useState, useEffect } from 'react';
import UserInfo from './components/UserInfo';
import WeeklySchedule from './components/WeeklySchedule';
import { getUserInfo, getUserCurrentSeasonAnime } from './services/bangumiApi';

function App() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  // 从 URL 参数获取用户名
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const usernameParam = urlParams.get('username') || urlParams.get('user');

    if (usernameParam) {
      setUsername(usernameParam);
    } else {
      // 如果没有用户名参数，显示输入框
      setError('请在 URL 中指定用户名参数，例如：?username=your_bangumi_username');
    }
  }, []);

  // 获取用户信息和番剧数据
  useEffect(() => {
    if (username) {
      fetchUserData(username);
    }
  }, [username]);

  const fetchUserData = async (targetUsername) => {
    setLoading(true);
    setUserLoading(true);
    setError(null);

    try {
      // 并行获取用户信息和番剧时间表
      const [userInfoPromise, schedulePromise] = await Promise.allSettled([
        getUserInfo(targetUsername),
        getUserCurrentSeasonAnime(targetUsername)
      ]);

      // 处理用户信息
      if (userInfoPromise.status === 'fulfilled') {
        setUser(userInfoPromise.value);
      } else {
        console.warn('获取用户信息失败:', userInfoPromise.reason);
      }
      setUserLoading(false);

      // 处理番剧时间表
      if (schedulePromise.status === 'fulfilled') {
        const userSchedule = schedulePromise.value;
        setSchedule(userSchedule);

        if (userSchedule.length === 0) {
          setError('该用户本季度没有想看/在看/看过的番剧');
        }
      } else {
        throw new Error('获取番剧时间表失败: ' + schedulePromise.reason.message);
      }

    } catch (err) {
      console.error('获取数据失败:', err);
      setError(err.message || '获取数据失败，请检查用户名是否正确');
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUsername = formData.get('username').trim();

    if (newUsername) {
      setUsername(newUsername);
      // 更新 URL 参数
      const url = new URL(window.location);
      url.searchParams.set('username', newUsername);
      window.history.replaceState({}, '', url);
    }
  };

  const totalAnimeCount = schedule.reduce((total, day) => total + day.items.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 头部 */}
        <div className="mb-8">
          {username ? (
            <>
              <UserInfo user={user} username={username} loading={userLoading} />

              {/* 统计信息 */}
              {!loading && !error && totalAnimeCount > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-bangumi-blue">{totalAnimeCount}</div>
                        <div className="text-sm text-gray-500">本季追番</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {schedule.filter(day => day.items.length > 0).length}
                        </div>
                        <div className="text-sm text-gray-500">有番剧的天数</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        数据更新时间: {new Date().toLocaleString('zh-CN')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">每周追番时间表</h1>
              <form onSubmit={handleUsernameSubmit} className="max-w-md mx-auto">
                <div className="flex">
                  <input
                    type="text"
                    name="username"
                    placeholder="请输入 Bangumi 用户名"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-bangumi-blue focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-bangumi-blue text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-bangumi-blue focus:ring-offset-2 transition-colors"
                  >
                    查看
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* 主内容 */}
        <WeeklySchedule
          schedule={schedule}
          loading={loading}
          error={error}
        />

        {/* 页脚 */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>
              数据来源: <a href="https://bgm.tv" target="_blank" rel="noopener noreferrer" className="text-bangumi-blue hover:underline">Bangumi 番组计划</a>
            </p>
            <p className="mt-1">
              本工具仅供个人使用，请遵守 Bangumi API 使用条款
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
