import { useState, useEffect } from "react";
import { Heart, MessageCircle, ThumbsUp, Send, Trash2, Users } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

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
  levelId: string;
  content: string;
  createdAt: any; // Firestore Timestamp | string | Date
};

type PostWithCounts = CommunityPost & {
  commentsCount?: number;
  comments?: CommunityComment[];
};

export default function CommunityPage() {
  const { user } = useAuth();

  const [posts, setPosts] = useState<PostWithCounts[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  // 댓글 수정 상태 관리
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // 사용자의 총 기부금
  const totalDonation = user ? user.totalDonation : 0;
  const userLevel = getUserLevel(totalDonation);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Firestore Timestamp/Date/string → ISO 문자열로 정규화
  const toIso = (v: any): string => {
    if (v && typeof v.toDate === "function") return v.toDate().toISOString();
    if (typeof v === "string") return v;
    if (v instanceof Date) return v.toISOString();
    return new Date(0).toISOString();
  };

  // 게시글 + 댓글 함께 로드
  const fetchPosts = async () => {
    try {
      const data = await getCommunityPosts();

      const withCounts = await Promise.all(
        data.map(async (p) => {
          // 댓글 서브컬렉션 로드
          const commentsSnap = await getDocs(collection(db, "posts", p.id, "comments"));
          const comments: CommunityComment[] = commentsSnap.docs.map((d) => {
            const c = d.data() as any;
            return {
              id: d.id,
              author: c.author,
              authorEmail: c.authorEmail,
              levelId: c.levelId,
              content: c.content,
              createdAt: toIso(c.createdAt),
              updatedAt: c.updatedAt ? toIso(c.updatedAt) : null,
            };
          });

          return {
            ...p,
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
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setPosts(withCounts);
    } catch (e) {
      console.error(e);
      toast.error("게시글을 불러오지 못했습니다.");
    }
  };

  const filteredPosts =
    selectedLevel === "all" ? posts : posts.filter((post) => post.levelId === selectedLevel);

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

  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error("로그인이 필요합니다");
      return;
    }
    await likePost(postId, user.email);
    await fetchPosts();
  };

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
      levelId: userLevel.id,
      content: commentContent,
    });
    setCommentInputs({ ...commentInputs, [postId]: "" });
    await fetchPosts();
    toast.success("댓글이 추가되었습니다!");
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) return;
    if (await deletePost(postId, user.email)) {
      await fetchPosts();
      toast.success("게시글이 삭제되었습니다");
    } else {
      toast.error("삭제 권한이 없습니다");
    }
  };

  const formatTimeAgo = (dateLike: any) => {
    const dateString = toIso(dateLike);
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

  const getLevelById = (levelId: string): DonationLevel => {
    return DONATION_LEVELS.find((l) => l.id === levelId) || DONATION_LEVELS[0];
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
                        <Badge className={`${userLevel.color} border`}>{userLevel.name}</Badge>
                      </div>
                      <p className="text-emerald-100 text-sm">{userLevel.description}</p>
                      <p className="text-emerald-200 text-sm mt-1">
                        누적 기부금: {totalDonation.toLocaleString()}원
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
                  <Button onClick={handleCreatePost} className="bg-emerald-600 hover:bg-emerald-700">
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
            {/* Level Info Card */}
            {selectedLevel !== "all" && (
              <Card className="mb-6 bg-gradient-to-r from-emerald-50 to-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{getLevelById(selectedLevel).badgeEmoji}</div>
                    <div>
                      <h3 className="text-gray-900 mb-1">{getLevelById(selectedLevel).name} 레벨</h3>
                      <p className="text-gray-600 text-sm">{getLevelById(selectedLevel).description}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        기부금 범위: {getLevelById(selectedLevel).minAmount.toLocaleString()}원 ~{" "}
                        {getLevelById(selectedLevel).maxAmount === Infinity
                          ? "∞"
                          : getLevelById(selectedLevel).maxAmount.toLocaleString() + "원"}
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
                    <p className="text-gray-400 text-sm mt-2">첫 번째 게시글을 작성해보세요!</p>
                  </CardContent>
                </Card>
              ) : (
                filteredPosts.map((post) => {
                  const postLevel = getLevelById(post.levelId);
                  const isAuthor = user?.email === post.authorEmail;
                  const hasLiked = user ? (post.likedBy ?? []).includes(user.email) : false;

                  return (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{postLevel.badgeEmoji}</div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-900">{post.author}</span>
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
                        <h3 className="font-extrabold inline-block bg-emerald-50 text-emerald-900 font-extrabold text-lg px-3 py-1 rounded-md mb-3">
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
                            <ThumbsUp className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`} />
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
                              const isCommentAuthor = user?.email === comment.authorEmail;
                              const isEditing = editingCommentId === comment.id;

                              const handleEditComment = async () => {
                                try {
                                  const commentRef = doc(db, "posts", post.id, "comments", comment.id);
                                  await updateDoc(commentRef, { content: editContent, updatedAt: serverTimestamp(),});
                                  toast.success("댓글이 수정되었습니다!");
                                  setEditingCommentId(null);
                                  await fetchPosts();
                                } catch (e) {
                                  console.error(e);
                                  toast.error("댓글 수정 중 오류가 발생했습니다.");
                                }
                              };

                              const handleDeleteComment = async () => {
                                if (!confirm("정말 이 댓글을 삭제하시겠습니까?")) return;
                                try {
                                  const commentRef = doc(db, "posts", post.id, "comments", comment.id);
                                  await deleteDoc(commentRef);
                                  toast.success("댓글이 삭제되었습니다!");
                                  await fetchPosts();
                                } catch (e) {
                                  console.error(e);
                                  toast.error("댓글 삭제 중 오류가 발생했습니다.");
                                }
                              };

                              return (
                                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">{commentLevel.badgeEmoji}</span>
                                    <span className="text-gray-900 text-sm">{comment.author}</span>
                                    <Badge className={`${commentLevel.color} border text-xs`}>
                                      {commentLevel.name}
                                    </Badge>
                                    <span className="text-gray-500 text-xs ml-auto">
                                      {formatTimeAgo(comment.createdAt)}
                                      {comment.updatedAt && (
                                        <span className="ml-1 text-gray-400 italic">(수정됨)</span>
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
                                              onClick={handleDeleteComment}
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
                                        onChange={(e) => setEditContent(e.target.value)}
                                        rows={2}
                                        className="resize-none"
                                      />
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          className="bg-emerald-600 hover:bg-emerald-700"
                                          onClick={handleEditComment}
                                        >
                                          완료
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                                  )}

                                  {/* Reaction Buttons */}
                                  <div className="flex items-center gap-4 mt-2">
                                    {[
                                      { key: "like", icon: "👍", color: "text-emerald-600" },
                                      { key: "funny", icon: "😂", color: "text-yellow-500" },
                                      { key: "sad", icon: "😢", color: "text-blue-500" },
                                      { key: "angry", icon: "😡", color: "text-red-500" },
                                    ].map(({ key, icon, color }) => {
                                      const reacted =
                                        comment.reactions?.[key]?.includes(user?.email);
                                      const count = comment.reactions?.[key]?.length || 0;

                                      const handleReaction = async () => {
                                        if (!user) {
                                          toast.error("로그인이 필요합니다");
                                          return;
                                        }
                                        try {
                                          const commentRef = doc(db, "posts", post.id, "comments", comment.id);
                                          const currentReactions = comment.reactions || {};
                                          const userEmail = user.email;

                                          const updatedReactions = {
                                            ...currentReactions,
                                            [key]: reacted
                                              ? currentReactions[key].filter((email: string) => email !== userEmail)
                                              : [...(currentReactions[key] || []), userEmail],
                                          };

                                          await updateDoc(commentRef, { reactions: updatedReactions });
                                          await fetchPosts();
                                        } catch (e) {
                                          console.error(e);
                                          toast.error("반응 처리 중 오류가 발생했습니다.");
                                        }
                                      };

                                      return (
                                        <button
                                          key={key}
                                          onClick={handleReaction}
                                          className={`flex items-center gap-1 text-sm transition-all ${
                                            reacted ? `${color} font-semibold` : "text-gray-500 hover:text-gray-700"
                                          }`}
                                        >
                                          <span>{icon}</span>
                                          <span>{count > 0 ? count : ""}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
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
                                setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
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
            <h3 className="text-gray-900 mb-2 text-center">🏆 헬시콩 커뮤니티 레벨 가이드</h3>
            <p className="text-gray-600 text-sm text-center mb-2">
              기부금 누적액에 따라 레벨이 올라가요!
            </p>
            <p className="text-xs text-gray-500 text-center mb-6">
              💡 하루 최대 100원 × 1,000일 = 플래티넘콩 달성 (약 3년)
            </p>

            <div className="grid md:grid-cols-5 gap-4 mb-8">
              {DONATION_LEVELS.map((level) => (
                <div key={level.id} className="text-center">
                  <div className="text-4xl mb-2">{level.badgeEmoji}</div>
                  <Badge className={`${level.color} border mb-2`}>{level.name}</Badge>
                  <p className="text-xs text-gray-600 mb-1">
                    {level.minAmount.toLocaleString()}원 ~
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    {level.maxAmount === Infinity ? "∞" : level.maxAmount.toLocaleString() + "원"}
                  </p>
                  <p className="text-xs text-gray-500 px-2 leading-snug">{level.description}</p>
                </div>
              ))}
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