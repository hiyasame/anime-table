import React from 'react';

const AnimeCard = ({ anime }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 1: return 'bg-blue-100 text-blue-800'; // 想看
      case 2: return 'bg-purple-100 text-purple-800'; // 看过
      case 3: return 'bg-green-100 text-green-800'; // 在看
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1: return '想看';
      case 2: return '看过';
      case 3: return '在看';
      default: return '未知';
    }
  };


  return (
    <div className="anime-card group cursor-pointer">
      <div className="flex items-start space-x-4">
        {/* 番剧封面 */}
        <div className="flex-shrink-0">
          <img
            src={anime.images?.small || anime.images?.medium || anime.images?.large || '/placeholder-anime.jpg'}
            alt={anime.name || anime.name_cn}
            className="w-14 h-20 object-cover rounded-md shadow-sm"
            onError={(e) => {
              e.target.src = '/placeholder-anime.jpg';
            }}
          />
        </div>

        {/* 番剧信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-bangumi-blue transition-colors">
                {anime.name_cn || anime.name}
              </h3>
              {anime.name_cn && anime.name && anime.name_cn !== anime.name && (
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {anime.name}
                </p>
              )}
            </div>

            {/* 状态标签 */}
            {anime.collection_type && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(anime.collection_type)}`}>
                {getStatusText(anime.collection_type)}
              </span>
            )}
          </div>


          {/* 评分 */}
          {anime.rating && anime.rating.score > 0 && (
            <div className="flex items-center mt-1">
              <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs text-gray-600">{anime.rating.score.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
