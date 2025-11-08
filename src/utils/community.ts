// 커뮤니티 레벨 시스템 및 유틸리티

export interface DonationLevel {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  color: string;
  badgeEmoji: string;
  description: string;
}

export const DONATION_LEVELS: DonationLevel[] = [
  {
    id: 'sprout',
    name: '새싹콩',
    minAmount: 0,
    maxAmount: 4999,
    color: 'bg-green-100 text-green-700 border-green-300',
    badgeEmoji: '🌱',
    description: '이제 막 건강 관리와 나눔을 시작한 따뜻한 새싹콩입니다.'
  },
  {
    id: 'bud',
    name: '성장콩',
    minAmount: 5000,
    maxAmount: 9999,
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    badgeEmoji: '🌿',
    description: '꾸준히 실천하며 작은 나눔을 키워가는 성장콩이에요.'
  },
  {
    id: 'angel',
    name: '기부콩',
    minAmount: 10000,
    maxAmount: 29999,
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    badgeEmoji: '😇',
    description: '매일의 건강 기록이 누군가의 희망이 되는 기부콩입니다.'
  },
  {
    id: 'golden',
    name: '황금콩',
    minAmount: 30000,
    maxAmount: 99999,
    color: 'bg-amber-100 text-amber-700 border-amber-300',
    badgeEmoji: '👼',
    description: '건강과 나눔의 본보기가 되는 황금콩! 모두의 롤모델이에요.'
  },
  {
    id: 'platinum',
    name: '플래티넘콩',
    minAmount: 100000,
    maxAmount: Infinity,
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    badgeEmoji: '🏆',
    description: '거의 3년간 매일 건강을 기록한 전설적인 헬시콩 ✨ 진정한 챔피언입니다!'
  }
];

export function getUserLevel(totalDonation: number): DonationLevel {
  return DONATION_LEVELS.find(
    level => totalDonation >= level.minAmount && totalDonation <= level.maxAmount
  ) || DONATION_LEVELS[0];
}

export interface CommunityPost {
  id: string;
  author: string;
  authorEmail: string;
  levelId: string;
  title: string;
  content: string;
  likes: number;
  likedBy: string[];
  comments: CommunityComment[];
  createdAt: string;
}

export interface CommunityComment {
  id: string;
  author: string;
  authorEmail: string;
  levelId: string;
  content: string;
  createdAt: string;
}

const STORAGE_KEY = 'healthykong_community_posts';

export function getCommunityPosts(): CommunityPost[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCommunityPost(post: Omit<CommunityPost, 'id' | 'createdAt'>): CommunityPost {
  const posts = getCommunityPosts();
  const newPost: CommunityPost = {
    ...post,
    id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };
  posts.unshift(newPost);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  return newPost;
}

export function likePost(postId: string, userEmail: string): void {
  const posts = getCommunityPosts();
  const post = posts.find(p => p.id === postId);
  if (post) {
    if (post.likedBy.includes(userEmail)) {
      post.likedBy = post.likedBy.filter(email => email !== userEmail);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userEmail);
      post.likes += 1;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }
}

export function addComment(
  postId: string,
  comment: Omit<CommunityComment, 'id' | 'createdAt'>
): CommunityComment | null {
  const posts = getCommunityPosts();
  const post = posts.find(p => p.id === postId);
  if (post) {
    const newComment: CommunityComment = {
      ...comment,
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    post.comments.push(newComment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return newComment;
  }
  return null;
}

export function deletePost(postId: string, userEmail: string): boolean {
  const posts = getCommunityPosts();
  const postIndex = posts.findIndex(p => p.id === postId && p.authorEmail === userEmail);
  if (postIndex !== -1) {
    posts.splice(postIndex, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return true;
  }
  return false;
}

// 데모 데이터 생성
export function initDemoCommunityPosts() {
  const existingPosts = getCommunityPosts();
  if (existingPosts.length > 0) return;

  const demoPosts: Omit<CommunityPost, 'id' | 'createdAt'>[] = [
    {
      author: '건강지킴이',
      authorEmail: 'demo1@example.com',
      levelId: 'angel',
      title: '드디어 기부콩 달성했어요! 🎉',
      content: '3개월 동안 매일 혈당 체크하면서 드디어 10,000원 달성했습니다. 작은 실천이 모여 누군가에게 도움이 된다는 게 정말 뿌듯하네요! 새싹콩에서 성장콩을 거쳐 여기까지 왔네요 💚',
      likes: 15,
      likedBy: ['demo2@example.com', 'demo3@example.com'],
      comments: [
        {
          id: 'c1',
          author: '당뇨극복',
          authorEmail: 'demo2@example.com',
          levelId: 'bud',
          content: '축하드려요! 저도 성장콩에서 곧 기부콩으로 따라갈게요 💪',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      author: '당뇨극복',
      authorEmail: 'demo2@example.com',
      levelId: 'bud',
      title: '성장콩의 혈당 관리 루틴 공유 🌿',
      content: '아침 공복 혈당 측정 → 아침 식사 후 2시간 측정 → 저녁 식사 전 측정. 이렇게 하니까 패턴이 보이네요. 성장콩 단계에서는 이 루틴이 정말 중요한 것 같아요. 여러분은 어떻게 관리하세요?',
      likes: 8,
      likedBy: ['demo1@example.com'],
      comments: [
        {
          id: 'c2',
          author: '건강지킴이',
          authorEmail: 'demo1@example.com',
          levelId: 'angel',
          content: '저도 비슷하게 하고 있어요! 특히 식후 2시간이 중요한 것 같아요. 기부콩이 되면 더 많은 팁 공유할게요! ❤️',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'c3',
          author: '새싹이',
          authorEmail: 'demo3@example.com',
          levelId: 'sprout',
          content: '새싹콩인 저에게 정말 좋은 정보네요! 감사합니다! 😊',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      author: '황금빛건강',
      authorEmail: 'demo4@example.com',
      levelId: 'golden',
      title: '황금콩의 6개월 건강 데이터 분석 👼',
      content: '헬시콩 시작한 지 6개월 됐습니다. 평균 혈당이 150에서 120으로 떨어졌고, 꾸준한 운동 기록이 도움이 많이 됐어요. 무엇보다 기부금이 50,000원이 넘어서 황금콩이 되었다는 게 뿌듯합니다! 플래티넘콩을 향해 달려갑니다! 🏃‍♂️',
      likes: 23,
      likedBy: ['demo1@example.com', 'demo2@example.com', 'demo3@example.com'],
      comments: []
    },
    {
      author: '새싹이',
      authorEmail: 'demo3@example.com',
      levelId: 'sprout',
      title: '새싹콩으로 처음 시작했어요! 🌱',
      content: '당뇨 진단받고 건강 관리를 시작했습니다. 헬시콩으로 꾸준히 기록하면서 건강도 챙기고 기부도 할 수 있다니 좋은 것 같아요. 새싹콩부터 차근차근 성장해서 플래티넘콩까지 가보려고요! 선배 콩님들 조언 부탁드립니다!',
      likes: 12,
      likedBy: ['demo1@example.com', 'demo2@example.com'],
      comments: [
        {
          id: 'c4',
          author: '건강지킴이',
          authorEmail: 'demo1@example.com',
          levelId: 'angel',
          content: '환영합니다! 매일 꾸준히 기록하는 게 가장 중요해요. 새싹콩에서 시작하면 금방 성장콩이 됩니다! 💚',
          createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      author: '플래티넘전설',
      authorEmail: 'demo5@example.com',
      levelId: 'platinum',
      title: '1년 기념 - 플래티넘콩 달성! 커뮤니티 홍보대사 🏆✨',
      content: '작년 이맘때 새싹콩으로 헬시콩을 시작했고, 오늘 드디어 누적 기부금 10만원을 달성해 플래티넘콩이 되었습니다! 매일매일의 작은 실천이 이렇게 큰 선물로 돌아올 줄 몰랐네요. 새싹콩→성장콩→기부콩→황금콩→플래티넘콩까지의 여정이 정말 보람찼습니다. 함께 건강을 지키며 사회에 기여할 수 있어 행복합니다!',
      likes: 45,
      likedBy: ['demo1@example.com', 'demo2@example.com', 'demo3@example.com', 'demo4@example.com'],
      comments: [
        {
          id: 'c5',
          author: '황금빛건강',
          authorEmail: 'demo4@example.com',
          levelId: 'golden',
          content: '황금콩인 제가 봐도 정말 대단하십니다! 저도 플래티넘콩을 목표로 삼겠습니다 🏆',
          createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
        },
        {
          id: 'c6',
          author: '당뇨극복',
          authorEmail: 'demo2@example.com',
          levelId: 'bud',
          content: '진정한 헬시콩 커뮤니티의 전설이세요! 성장콩인 저에게 큰 동기부여가 됩니다. 축하드립니다 👏',
          createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
        }
      ]
    }
  ];

  demoPosts.forEach(post => saveCommunityPost(post));
}
