import React from 'react';
import AnimeCard from './AnimeCard';

const WeeklySchedule = ({ schedule, loading, error }) => {
  const weekdays = [
    { key: 1, name: '周一', en: 'Monday' },
    { key: 2, name: '周二', en: 'Tuesday' },
    { key: 3, name: '周三', en: 'Wednesday' },
    { key: 4, name: '周四', en: 'Thursday' },
    { key: 5, name: '周五', en: 'Friday' },
    { key: 6, name: '周六', en: 'Saturday' },
    { key: 7, name: '周日', en: 'Sunday' },
  ];

  const getAnimeForDay = (weekdayKey) => {
    const dayData = schedule.find(day => day.weekday.id === weekdayKey);
    return dayData ? dayData.items : [];
  };

  const getCurrentDay = () => {
    const today = new Date().getDay();
    return today === 0 ? 7 : today; // 将周日从0转换为7
  };

  const currentDay = getCurrentDay();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bangumi-blue"></div>
          <span className="text-gray-600">加载中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-2">加载失败</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weekly-grid">
      {weekdays.map((weekday) => {
        const dayAnime = getAnimeForDay(weekday.key);
        const isToday = weekday.key === currentDay;

        return (
          <div key={weekday.key} className="day-column">
            {/* 日期标题 */}
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${isToday ? 'text-bangumi-blue' : 'text-gray-900'}`}>
                {weekday.name}
              </h2>
              {isToday && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-bangumi-blue text-white">
                  今天
                </span>
              )}
            </div>

            {/* 番剧列表 */}
            <div className="space-y-3">
              {dayAnime.length > 0 ? (
                dayAnime.map((anime) => (
                  <AnimeCard
                    key={anime.id}
                    anime={anime}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">暂无番剧</p>
                </div>
              )}
            </div>

            {/* 番剧数量统计 */}
            {dayAnime.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  共 {dayAnime.length} 部番剧
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WeeklySchedule;
