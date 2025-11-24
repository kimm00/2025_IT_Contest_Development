// src/pages/UserProfilePage.tsx
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, Calendar, TrendingUp, MessageCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

import { DONATION_LEVELS, type CommunityPost, type DonationLevel } from "../utils/community";
import { getUserByUid, type User } from "../utils/auth";
import { getUserPostsByUid } from "../utils/community";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// ---------- Util ----------
function toIso(v: any): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "string") return v;
  if (v instanceof Date) return v.toISOString();
  if (v && typeof v.toDate === "function") return v.toDate().toISOString(); // Firestore Timestamp
  return null;
}

function getLevelById(levelId?: string): DonationLevel {
  const found = DONATION_LEVELS.find((l) => l.id === levelId);
  return (found ?? DONATION_LEVELS[0]) as DonationLevel;
}

function formatTimeAgo(input: any): string {
  const s = toIso(input);
  if (!s) return "방금 전";
  const now = new Date();
  const past = new Date(s);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return past.toLocaleDateString("ko-KR");
}

type Props = { userUid: string; onBack: () => void };

type PostWithStats = CommunityPost & { commentsCount: number };

export default function UserProfilePage({ userUid, onBack }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<PostWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const totalComments = userPosts.reduce((sum, p) => sum + (p.commentsCount ?? 0), 0);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // 1) 유저 정보 + 게시글 목록
        const [u, posts] = await Promise.all([
          getUserByUid(userUid),
          getUserPostsByUid(userUid),
        ]);

        if (!alive) return;

        // 2) 각 게시글의 댓글 개수 조회
        const postsWithCounts: PostWithStats[] = await Promise.all(
          posts.map(async (p) => {
            const commentsSnap = await getDocs(
              collection(db, "posts", p.id, "comments")
            );
            return {
              ...p,
              commentsCount: commentsSnap.size,
            };
          })
        );

        setUser(u);
        setUserPosts(postsWithCounts);
      } catch (e: any) {
        console.error(e);
        if (alive) setError(e?.message ?? "로드 실패");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [userUid]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        로딩 중...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          {/* Back Button */}
          <Button onClick={onBack} variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            커뮤니티로 돌아가기
          </Button>
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">사용자를 찾을 수 없습니다.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 통계 계산
  const totalDonation = user.totalDonation || 0;
  const userLevel =
    DONATION_LEVELS.find(
      (l) => totalDonation >= l.minAmount && totalDonation <= l.maxAmount
    ) || DONATION_LEVELS[0];

  const totalPosts = userPosts.length;
  const totalLikes = userPosts.reduce((s, p) => s + (p.likes || 0), 0);
  const join = user.createdAt ? new Date(user.createdAt) : new Date();
  const daysActive = Math.max(
    1,
    Math.floor((Date.now() - join.getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Back Button */}
        <Button onClick={onBack} variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            커뮤니티로 돌아가기
          </Button>
        {/* Profile Header */}
        <Card className="mb-8 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-7xl">
                  {userLevel.badgeEmoji}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-center gap-3 mb-3">
                  <h1 className="text-white text-3xl">{user.name}</h1>
                  <Badge className={`${userLevel.color} border-2 text-base px-4 py-1`}>
                    {userLevel.badgeEmoji} {userLevel.name}
                  </Badge>
                </div>

                <p className="text-emerald-100 mb-4 max-w-2xl">
                  {userLevel.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm text-emerald-100">누적 기부금</span>
                    </div>
                    <div className="text-2xl text-center">
                      ₩{totalDonation.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm text-emerald-100">작성 글</span>
                    </div>
                    <div className="text-2xl text-center">{totalPosts}개</div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm text-emerald-100">받은 좋아요</span>
                    </div>
                    <div className="text-2xl text-center">{totalLikes}개</div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm text-emerald-100">활동 일수</span>
                    </div>
                    <div className="text-2xl text-center">{daysActive}일</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Level Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-gray-900 mb-4">🏆 레벨 진행 상황</h3>
            <div className="flex items-center gap-2 mb-4">
              {DONATION_LEVELS.map((level, index) => {
                const isCurrentLevel = level.id === userLevel.id;
                const isPassed = totalDonation >= level.minAmount;

                return (
                  <div key={level.id} className="flex-1">
                    <div className="flex items-center">
                      {index > 0 && (
                        <div
                          className={`flex-1 h-1 ${
                            isPassed ? "bg-emerald-500" : "bg-gray-200"
                          }`}
                        />
                      )}
                      <div
                        className={`flex flex-col items-center ${
                          index > 0 ? "ml-2" : ""
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
                            isCurrentLevel
                              ? "bg-emerald-500 ring-4 ring-emerald-200 scale-110"
                              : isPassed
                              ? "bg-emerald-100"
                              : "bg-gray-100"
                          }`}
                        >
                          {level.badgeEmoji}
                        </div>
                        <span
                          className={`text-xs mt-2 ${
                            isCurrentLevel ? "text-emerald-700" : "text-gray-500"
                          }`}
                        >
                          {level.name}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {userLevel.maxAmount !== Infinity && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>다음 레벨까지</span>
                  <span className="text-emerald-600">
                    ₩{(userLevel.maxAmount + 1 - totalDonation).toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        ((totalDonation - userLevel.minAmount) /
                          (userLevel.maxAmount - userLevel.minAmount)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Posts Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">✍️ {user.name}님의 게시글</h3>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                총 {totalPosts}개
              </Badge>
            </div>

            {totalPosts === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">아직 작성한 게시글이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post, index) => {
                  const postLevel = getLevelById(post.levelId);

                  return (
                    <div key={post.id}>
                      {index > 0 && <Separator className="my-4" />}

                      <div className="hover:bg-gray-50 p-4 rounded-lg transition-colors">
                        {/* Post Header */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-2xl">{postLevel.badgeEmoji}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge className={`${postLevel.color} border text-xs`}>
                                {postLevel.name}
                              </Badge>
                              <span className="text-gray-500 text-sm">
                                {formatTimeAgo(post.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Post Content */}
                        <h4 className="text-gray-900 mb-2">{post.title}</h4>
                        <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-3">
                          {post.content}
                        </p>

                        {/* Post Stats */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Heart
                              className={`w-4 h-4 ${
                                post.likes > 0 ? "text-red-500" : ""
                              }`}
                            />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.commentsCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Community Impact */}
        <Card className="mt-8 bg-gradient-to-br from-emerald-50 to-blue-50">
          <CardContent className="p-6">
            <h3 className="text-gray-900 mb-4 text-center">💚 커뮤니티 기여도</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl text-emerald-600 mb-1">{totalPosts}</div>
                <div className="text-sm text-gray-600">작성한 글</div>
              </div>
              <div>
                <div className="text-3xl text-emerald-600 mb-1">{totalComments}</div>
                <div className="text-sm text-gray-600">받은 댓글</div>
              </div>
              <div>
                <div className="text-3xl text-emerald-600 mb-1">{totalLikes}</div>
                <div className="text-sm text-gray-600">받은 좋아요</div>
              </div>
            </div>
            <Separator className="my-4" />
            <p className="text-center text-sm text-gray-600">
              {user.name}님은{" "}
              <strong className="text-emerald-700">
                {totalDonation.toLocaleString()}원
              </strong>
              의 기부금으로
              <br />
              다른 환우들에게 희망을 전하고 있습니다 ✨
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
