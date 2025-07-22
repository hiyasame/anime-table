import React from 'react';

const UserInfo = ({ user, username, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center space-x-3 mb-6">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-16"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 mb-6">
      {/* 用户头像 */}
      <div className="flex-shrink-0">
        <img
          src={user?.avatar?.large || user?.avatar?.medium || user?.avatar?.small || '/default-avatar.png'}
          alt={user?.nickname || username}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
          onError={(e) => {
            e.target.src = '/default-avatar.png';
          }}
        />
      </div>

      {/* 用户信息 */}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold text-gray-900 truncate">
          {user?.nickname || username} 的追番时间表
        </h1>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {user?.username && (
            <span>@{user.username}</span>
          )}
          {user?.sign && (
            <span className="truncate max-w-xs">{user.sign}</span>
          )}
        </div>
      </div>

      {/* Bangumi 链接 */}
      {user?.username && (
        <div className="flex-shrink-0">
          <a
            href={`https://bgm.tv/user/${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            访问 Bangumi
          </a>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
