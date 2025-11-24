// src/components/CommunityPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  ThumbsUp,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

import {
  DONATION_LEVELS,
  getUserLevel,
  getCommunityPosts,
  saveCommunityPost,
  likePost,
  addComment,
  deletePost,
  type CommunityPost,
  type DonationLevel,
} from "../utils/community";

type CommunityComment = {
  id: string;
  author: string;
  authorEmail: string;
  authorUid: string;
  levelId: string;
  content: string;
  createdAt: any; // Firestore Timestamp | string | Date
  updatedAt?: any; // Firestore Timestamp | string | Date | null
};

type PostWithCounts = CommunityPost & {
  commentsCount?: number;
  comments?: CommunityComment[];
};

export default function CommunityPage({
  onViewUserProfile,
}: {
  onViewUserProfile?: (uid: string) => void;
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [posts, setPosts] = useState<PostWithCounts[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [commentInputs, setCommentInputs] = useState<{
    [postId: string]: string;
  }>({});

  // 댓글 수정 상태 관리
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // 로그인 사용자 레벨 정보
  const totalDonation = user ? user.totalDonation : 0;
  const userLevel = getUserLevel(totalDonation);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Firestore Timestamp/Date/string → ISO 문자열로 정규화
  const toIso = (v: any): string | null => {
    if (v === null || v === undefined) return null;
    if (v && typeof v.toDate === "function") return v.toDate().toISOString();
    if (typeof v === "string") return v;
    if (v instanceof Date) return v.toISOString();
    return null;
  };

  // 게시글 + 댓글 함께 로드
  const fetchPosts = async () => {
    try {
      const data = await getCommunityPosts();

      const withCounts = await Promise.all(
        data.map(async (p) => {
          // 댓글 서브컬렉션 로드
          const commentsSnap = await getDocs(
            collection(db, "posts", p.id, "comments")
          );
          const comments: CommunityComment[] = commentsSnap.docs.map((d) => {
            const c = d.data() as any;
            return {
              id: d.id,
              author: c.author,
              authorEmail: c.authorEmail,
              authorUid: c.authorUid ?? "",
              levelId: c.levelId,
              content: c.content,
              createdAt: toIso(c.createdAt),
              updatedAt: toIso(c.updatedAt),
            };
          });

          return {
            ...p,
            authorUid: (p as any).authorUid ?? "",
            createdAt: toIso((p as any).createdAt),
            likedBy: Array.isArray(p.likedBy) ? p.likedBy : [],
            likes: typeof p.likes === "number" ? p.likes : 0,
            commentsCount: commentsSnap.size,
            comments,
          } as PostWithCounts;
        })
      );

      // 최신순 정렬
      withCounts.sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
      );

      setPosts(withCounts);
    } catch (e) {
      console.error(e);
      toast.error("게시글을 불러오지 못했습니다.");
    }
  };

  // 레벨 필터링
  const filteredPosts =
    selectedLevel === "all"
      ? posts
      : posts.filter((post) => post.levelId === selectedLevel);

  // 글 작성
  const handleCreatePost = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다");
      return;
    }
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.error("제목과 내용을 입력해주세요");
      return;
    }

    await saveCommunityPost({
      author: user.name,
      authorEmail: user.email,
      authorUid: user.uid, // ✅ uid 저장
      levelId: userLevel.id,
      title: newPostTitle,
      content: newPostContent,
    });

    setNewPostTitle("");
    setNewPostContent("");
    setShowNewPostForm(false);
    await fetchPosts();
    toast.success("게시글이 작성되었습니다!");
  };

  // 좋아요
  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error("로그인이 필요합니다");
      return;
    }
    await likePost(postId, user.uid);
    await fetchPosts();
  };

  // 댓글 추가
  const handleAddComment = async (postId: string) => {
    if (!user) {
      toast.error("로그인이 필요합니다");
      return;
    }
    const commentContent = commentInputs[postId]?.trim();
    if (!commentContent) {
      toast.error("댓글 내용을 입력해주세요");
      return;
    }
    await addComment(postId, {
      author: user.name,
      authorEmail: user.email,
      authorUid: user.uid,
      levelId: userLevel.id,
      content: commentContent,
    });
    setCommentInputs({ ...commentInputs, [postId]: "" });
    await fetchPosts();
    toast.success("댓글이 추가되었습니다!");
  };

  // 게시글 삭제
  const handleDeletePost = async (postId: string) => {
    if (!user) return;
    if (await deletePost(postId, user.uid)) {
      await fetchPosts();
      toast.success("게시글이 삭제되었습니다");
    } else {
      toast.error("삭제 권한이 없습니다");
    }
  };

  // 상대 시간 표시
  const formatTimeAgo = (dateLike: any) => {
    const dateString = toIso(dateLike);
    if (!dateString) return "";
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return past.toLocaleDateString("ko-KR");
  };

  // 레벨 찾기
  const getLevelById = (levelId: string): DonationLevel => {
    return DONATION_LEVELS.find((l) => l.id === levelId) || DONATION_LEVELS[0];
  };

  // 프로필로 이동 (App 콜백 있으면 사용, 없으면 URL 네비게이션)
  const goProfile = (uid?: string) => {
    if (!uid) {
      toast.error("프로필 이동 불가: 사용자 정보가 없습니다.");
      return;
    }
    if (onViewUserProfile) {
      onViewUserProfile(uid);
    } else {
      navigate(`/user/${uid}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-10 h-10 text-emerald-600" />
            <div>
              <h1 className="text-gray-900">커뮤니티</h1>
              <p className="text-gray-600">같은 목표를 가진 회원들과 소통하세요</p>
            </div>
          </div>

          {/* User Level Badge */}
          {user && (
            <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{userLevel.badgeEmoji}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white">{user.name}님</h3>
                        <Badge className={`${userLevel.color} border`}>
                          {userLevel.name}
                        </Badge>
                      </div>
                      <p className="text-emerald-100 text-sm">
                        {userLevel.description}
                      </p>
                      <p className="text-emerald-200 text-sm mt-1">
                        누적 포인트: {totalDonation.toLocaleString()}P
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowNewPostForm(!showNewPostForm)}
                    className="bg-white text-emerald-700 hover:bg-emerald-50"
                  >
                    {showNewPostForm ? "취소" : "글쓰기"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* New Post Form */}
        {showNewPostForm && user && (
          <Card className="mb-6 border-2 border-emerald-200">
            <CardContent className="p-6">
              <h3 className="text-gray-900 mb-4">새 게시글 작성</h3>
              <div className="space-y-4">
                <Input
                  placeholder="제목을 입력하세요"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="text-base"
                />
                <Textarea
                  placeholder="내용을 입력하세요"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowNewPostForm(false);
                      setNewPostTitle("");
                      setNewPostContent("");
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    게시하기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Level Filter Tabs */}
        <Tabs value={selectedLevel} onValueChange={setSelectedLevel} className="mb-6">
          <TabsList className="grid grid-cols-6 w-full bg-white border">
            <TabsTrigger value="all" className="data-[state=active]:bg-emerald-100">
              전체
            </TabsTrigger>
            {DONATION_LEVELS.map((level) => (
              <TabsTrigger
                key={level.id}
                value={level.id}
                className="data-[state=active]:bg-emerald-100"
              >
                <span className="mr-1">{level.badgeEmoji}</span>
                {level.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedLevel} className="mt-6">
            {/* 선택 레벨 가이드 카드 */}
            {selectedLevel !== "all" && (
              <Card className="mb-6 bg-gradient-to-r from-emerald-50 to-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">
                      {DONATION_LEVELS.find((l) => l.id === selectedLevel)?.badgeEmoji}
                    </div>
                    <div>
                      <h3 className="text-gray-900 mb-1">
                        {DONATION_LEVELS.find((l) => l.id === selectedLevel)?.name} 레벨
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {
                          DONATION_LEVELS.find((l) => l.id === selectedLevel)
                            ?.description
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">아직 게시글이 없습니다.</p>
                    <p className="text-gray-400 text-sm mt-2">
                      첫 번째 게시글을 작성해보세요!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredPosts.map((post) => {
                  const postLevel = getLevelById(post.levelId);
                  const isAuthor = user?.email === post.authorEmail;
                  const hasLiked = user
                    ? (post.likedBy ?? []).includes(user.uid)
                    : false;

                  return (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{postLevel.badgeEmoji}</div>
                            <div>
                              <div className="flex items-center gap-2">
                                {/* 작성자 클릭 시 프로필 */}
                                <button
                                  type="button"
                                  onClick={() => goProfile(post.authorUid as any)}
                                  className="text-gray-900 underline-offset-2 hover:underline hover:text-emerald-700"
                                  title={`${post.author} 프로필 보기`}
                                >
                                  {post.author}
                                </button>
                                <Badge className={`${postLevel.color} border text-xs`}>
                                  {postLevel.name}
                                </Badge>
                              </div>
                              <span className="text-gray-500 text-sm">
                                {formatTimeAgo(post.createdAt)}
                              </span>
                            </div>
                          </div>

                          {isAuthor && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        {/* Post Content */}
                        <h3 className="font-extrabold inline-block bg-emerald-50 text-emerald-900 text-lg px-3 py-1 rounded-md mb-3">
                          {post.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                          {post.content}
                        </p>

                        {/* Post Actions */}
                        <div className="flex items-center gap-4 mb-4">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                              hasLiked
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            <ThumbsUp
                              className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`}
                            />
                            <span className="text-sm">{post.likes ?? 0}</span>
                          </button>

                          <div className="flex items-center gap-2 text-gray-600">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{post.commentsCount ?? 0}</span>
                          </div>
                        </div>

                        {/* Comments */}
                        {post.comments && post.comments.length > 0 && (
                          <>
                            <Separator className="mb-4" />
                            <div className="space-y-3 mb-4">
                              {post.comments.map((comment) => {
                                const commentLevel = getLevelById(comment.levelId);
                                const isCommentAuthor =
                                  user?.email === comment.authorEmail;
                                const isEditing = editingCommentId === comment.id;

                                // 댓글 수정 완료
                                const commitEdit = async () => {
                                  try {
                                    const commentRef = doc(
                                      db,
                                      "posts",
                                      post.id,
                                      "comments",
                                      comment.id
                                    );
                                    await updateDoc(commentRef, {
                                      content: editContent,
                                      updatedAt: serverTimestamp(),
                                    });
                                    toast.success("댓글이 수정되었습니다!");
                                    setEditingCommentId(null);
                                    await fetchPosts();
                                  } catch (e) {
                                    console.error(e);
                                    toast.error("댓글 수정 중 오류가 발생했습니다.");
                                  }
                                };

                                // 댓글 삭제
                                const removeComment = async () => {
                                  if (
                                    !confirm("정말 이 댓글을 삭제하시겠습니까?")
                                  )
                                    return;
                                  try {
                                    const commentRef = doc(
                                      db,
                                      "posts",
                                      post.id,
                                      "comments",
                                      comment.id
                                    );
                                    await deleteDoc(commentRef);
                                    toast.success("댓글이 삭제되었습니다!");
                                    await fetchPosts();
                                  } catch (e) {
                                    console.error(e);
                                    toast.error("댓글 삭제 중 오류가 발생했습니다.");
                                  }
                                };

                                return (
                                  <div
                                    key={comment.id}
                                    className="bg-gray-50 rounded-lg p-4"
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-xl">
                                        {commentLevel.badgeEmoji}
                                      </span>
                                      {/* 댓글 작성자 클릭 */}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          goProfile(comment.authorUid as any)
                                        }
                                        className="text-gray-900 text-sm underline-offset-2 hover:underline hover:text-emerald-700"
                                      >
                                        {comment.author}
                                      </button>
                                      <Badge
                                        className={`${commentLevel.color} border text-xs`}
                                      >
                                        {commentLevel.name}
                                      </Badge>

                                      <span className="text-gray-500 text-xs ml-auto">
                                        {formatTimeAgo(comment.createdAt)}
                                        {comment.updatedAt !== null &&
                                          comment.updatedAt !== undefined && (
                                            <span className="ml-1 text-gray-400 italic">
                                              (수정됨)
                                            </span>
                                          )}
                                      </span>

                                      {isCommentAuthor && (
                                        <div className="flex gap-1 ml-2">
                                          {!isEditing ? (
                                            <>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-emerald-600 hover:text-emerald-700"
                                                onClick={() => {
                                                  setEditingCommentId(comment.id);
                                                  setEditContent(comment.content);
                                                }}
                                              >
                                                수정
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={removeComment}
                                              >
                                                삭제
                                              </Button>
                                            </>
                                          ) : (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="text-gray-500 hover:text-gray-600"
                                              onClick={() => setEditingCommentId(null)}
                                            >
                                              취소
                                            </Button>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    {isEditing ? (
                                      <div className="space-y-2">
                                        <Textarea
                                          value={editContent}
                                          onChange={(e) =>
                                            setEditContent(e.target.value)
                                          }
                                          rows={2}
                                          className="resize-none"
                                        />
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            className="bg-emerald-600 hover:bg-emerald-700"
                                            onClick={commitEdit}
                                          >
                                            완료
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-gray-700 text-sm whitespace-pre-wrap">
                                        {comment.content}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}

                        {/* Comment Input */}
                        {user && (
                          <div className="flex gap-2">
                            <Input
                              placeholder="댓글을 입력하세요..."
                              value={commentInputs[post.id] || ""}
                              onChange={(e) =>
                                setCommentInputs({
                                  ...commentInputs,
                                  [post.id]: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddComment(post.id);
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => handleAddComment(post.id)}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Level Guide */}
        <Card className="mt-8 bg-gradient-to-br from-emerald-50 to-blue-50">
          <CardContent className="p-8">
            <h3 className="text-gray-900 mb-2 text-center">
              🏆 헬시콩 커뮤니티 레벨 가이드
            </h3>
            <p className="text-gray-600 text-sm text-center mb-2">
              포인트 누적액에 따라 레벨이 올라가요!
            </p>
            <p className="text-xs text-gray-500 text-center mb-6">
              💡 하루 최대 100P × 1,000일 = 플래티넘콩 달성 (약 3년)
            </p>

            <div className="grid md:grid-cols-5 gap-4 mb-8">
              {DONATION_LEVELS.map((level) => (
                <div key={level.id} className="text-center">
                  <div className="text-4xl mb-2">{level.badgeEmoji}</div>
                  <Badge className={`${level.color} border mb-2`}>
                    {level.name}
                  </Badge>
                  <p className="text-xs text-gray-600 mb-1">
                    {level.minAmount.toLocaleString()}P ~
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    {level.maxAmount === Infinity
                      ? "∞"
                      : level.maxAmount.toLocaleString() + "P"}
                  </p>
                  <p className="text-xs text-gray-500 px-2 leading-snug">
                    {level.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Level Benefits */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-gray-900 text-center mb-2">
                🎁 레벨별 파트너사 후원 혜택
              </h4>
              <p className="text-center text-xs text-gray-500 mb-4">
                * 파트너 제약사의 후원으로 제공되는 리워드입니다
              </p>
              <div className="grid md:grid-cols-5 gap-3 text-xs">
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <div className="text-center mb-2">🌱 새싹콩</div>
                  <p className="text-gray-500 text-xs mb-2">0 ~ 4,999P</p>
                  <ul className="space-y-1 text-gray-600 leading-relaxed">
                    <li>
                      • 첫 건강기록 달성 시
                      <br />
                      '웰컴 체크인' 뱃지
                    </li>
                    <li className="mt-2 pt-2 border-t border-gray-200">
                      <span className="text-emerald-600">🎟️ 혜택:</span>
                      <br />
                      제약사 제품 3% 할인
                      <br />
                      또는 샘플 추첨권 1매
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-3 border border-emerald-200">
                  <div className="text-center mb-2">🌿 성장콩</div>
                  <p className="text-gray-500 text-xs mb-2">5,000 ~ 9,999P</p>
                  <ul className="space-y-1 text-gray-600 leading-relaxed">
                    <li>
                      • 2주 연속 기록 완료 시
                      <br />
                      '꾸준콩' 뱃지
                    </li>
                    <li className="mt-2 pt-2 border-t border-gray-200">
                      <span className="text-emerald-600">🎟️ 혜택:</span>
                      <br />
                      제약사 제품 5% 할인
                      <br />
                      또는 샘플팩 응모권
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="text-center mb-2">😇 기부콩</div>
                  <p className="text-gray-500 text-xs mb-2">10,000 ~ 29,999P</p>
                  <ul className="space-y-1 text-gray-600 leading-relaxed">
                    <li>
                      • 누적 10,000P 돌파 시
                      <br />
                      '기부콩' 인증카드
                    </li>
                    <li className="mt-2 pt-2 border-t border-gray-200">
                      <span className="text-blue-600">🎁 혜택:</span>
                      <br />
                      제약사 제품 7% 할인
                      <br />
                      + 샘플팩 추첨권
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-3 border border-amber-200">
                  <div className="text-center mb-2">👼 황금콩</div>
                  <p className="text-gray-500 text-xs mb-2">30,000 ~ 99,999P</p>
                  <ul className="space-y-1 text-gray-600 leading-relaxed">
                    <li>
                      • 누적 기부 + 커뮤니티
                      <br />
                      활동으로 '영감리더' 뱃지
                    </li>
                    <li className="mt-2 pt-2 border-t border-gray-200">
                      <span className="text-amber-600">✨ 혜택:</span>
                      <br />
                      제약사 제품 10% 할인
                      <br />
                      또는 건강 상담 할인권
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="text-center mb-2">🏆 플래티넘콩</div>
                  <p className="text-gray-500 text-xs mb-2">100,000P 이상</p>
                  <ul className="space-y-1 text-gray-600 leading-relaxed">
                    <li>
                      • 거의 3년간 매일 기록한
                      <br />
                      전설적인 '플래티넘콩' 뱃지
                    </li>
                    <li className="mt-2 pt-2 border-t border-gray-200">
                      <span className="text-purple-600">👑 혜택:</span>
                      <br />
                      제약사 제품 12~15% 할인
                      <br />
                      또는 신제품 체험팩
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center mt-8 bg-white rounded-lg p-4 border border-emerald-200">
              <p className="text-emerald-700">
                🌱 매일 건강을 기록하고 나눔을 실천하며,
                <br />
                헬시콩 커뮤니티에서 함께 성장해보세요!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}