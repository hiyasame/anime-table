import axios from 'axios';

const BANGUMI_API_BASE = 'https://api.bgm.tv';

// 创建 axios 实例
const api = axios.create({
  baseURL: BANGUMI_API_BASE,
  timeout: 10000,
});

// 获取用户信息
export const getUserInfo = async (username) => {
  try {
    const response = await api.get(`/user/${username}`);
    return response.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

// 获取用户的收藏（想看/在看/看过的番剧）
export const getUserCollections = async (username) => {
  try {
    const collections = [];

    // 获取想看、在看、看过的番剧
    const collectionTypes = [1, 3, 2]; // 1: 想看, 3: 在看, 2: 看过

    for (const type of collectionTypes) {
      try {
        const response = await api.get(`/v0/users/${username}/collections`, {
          params: {
            subject_type: 2, // 2 表示动画
            type: type,
            limit: 100, // 增加限制数量
          },
        });

        if (response.data && response.data.data) {
          collections.push(...response.data.data.map(item => ({
            ...item,
            collection_type: type
          })));
        }
      } catch (error) {
        console.warn(`获取收藏类型 ${type} 失败:`, error);
      }
    }

    return collections;
  } catch (error) {
    console.error('获取用户收藏失败:', error);
    throw error;
  }
};

// 判断是否为当前季度的番剧
const isCurrentSeason = (date) => {
  if (!date) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // 确定当前季度
  let currentSeason;
  if (currentMonth >= 1 && currentMonth <= 3) currentSeason = 1; // 冬季
  else if (currentMonth >= 4 && currentMonth <= 6) currentSeason = 2; // 春季
  else if (currentMonth >= 7 && currentMonth <= 9) currentSeason = 3; // 夏季
  else currentSeason = 4; // 秋季

  try {
    const animeDate = new Date(date);
    const animeYear = animeDate.getFullYear();
    const animeMonth = animeDate.getMonth() + 1;

    // 判断番剧的季度
    let animeSeason;
    if (animeMonth >= 1 && animeMonth <= 3) animeSeason = 1;
    else if (animeMonth >= 4 && animeMonth <= 6) animeSeason = 2;
    else if (animeMonth >= 7 && animeMonth <= 9) animeSeason = 3;
    else animeSeason = 4;

    // 添加调试信息
    const isMatch = animeYear === currentYear && animeSeason === currentSeason;
    console.log(`番剧日期: ${date}, 当前: ${currentYear}年第${currentSeason}季, 番剧: ${animeYear}年第${animeSeason}季, 匹配: ${isMatch}`);

    // 当前季度
    return isMatch;
  } catch (error) {
    console.error('日期解析错误:', date, error);
    return false;
  }
};

// 根据日期获取星期几
const getWeekdayFromDate = (date) => {
  if (!date) return null;

  try {
    const d = new Date(date);
    const weekday = d.getDay();
    return weekday === 0 ? 7 : weekday; // 将周日从0转换为7
  } catch (error) {
    return null;
  }
};

// 获取用户当前季度的番剧时间表
export const getUserCurrentSeasonAnime = async (username) => {
  try {
    console.log('开始获取用户收藏...');
    // 1. 获取用户所有收藏（想看/在看/看过）
    const collections = await getUserCollections(username);
    console.log(`获取到 ${collections.length} 个收藏项目`);

    if (collections.length === 0) {
      return [];
    }

    // 2. 直接从收藏数据中筛选当前季度的番剧
    const currentSeasonAnime = collections
      .filter(item => {
        // 检查是否为当前季度的番剧
        const date = item.subject?.date;
        const isCurrentSeasonAnime = date && isCurrentSeason(date);
        if (date) {
          console.log(`筛选番剧: ${item.subject?.name || item.subject?.name_cn}, 日期: ${date}, 是否当前季度: ${isCurrentSeasonAnime}`);
        }
        return isCurrentSeasonAnime;
      })
      .map(item => {
        const weekday = getWeekdayFromDate(item.subject.date);
        return {
          ...item.subject,
          collection_type: item.collection_type,
          weekday: weekday,
          air_date: item.subject.date
        };
      });

    console.log(`筛选出 ${currentSeasonAnime.length} 个当前季度番剧`);

    // 3. 按星期几分组
    const weeklySchedule = [];
    const weekdayMap = new Map();

    currentSeasonAnime.forEach(anime => {
      if (anime.weekday) {
        if (!weekdayMap.has(anime.weekday)) {
          weekdayMap.set(anime.weekday, []);
        }
        weekdayMap.get(anime.weekday).push(anime);
      }
    });

    // 4. 转换为时间表格式
    for (let weekday = 1; weekday <= 7; weekday++) {
      if (weekdayMap.has(weekday)) {
        const items = weekdayMap.get(weekday);
        // 按时间排序
        items.sort((a, b) => {
          const timeA = new Date(a.air_date).getTime();
          const timeB = new Date(b.air_date).getTime();
          return timeA - timeB;
        });

        weeklySchedule.push({
          weekday: {
            id: weekday,
            cn: getWeekdayName(weekday),
            en: getWeekdayNameEn(weekday)
          },
          items: items
        });
      }
    }

    return weeklySchedule;
  } catch (error) {
    console.error('获取用户本季番剧失败:', error);
    throw error;
  }
};

// 获取星期几的中文名称
const getWeekdayName = (weekday) => {
  const names = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  return names[weekday] || '';
};

// 获取星期几的英文名称
const getWeekdayNameEn = (weekday) => {
  const names = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return names[weekday] || '';
};
