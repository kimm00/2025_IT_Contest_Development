// src/utils/community.ts
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  runTransaction,
  query,
  where,
  orderBy,
} from "firebase/firestore";

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
  { id: "sprout", name: "새싹콩", minAmount: 0, maxAmount: 4999, color: "bg-green-100 text-green-700 border-green-300", badgeEmoji: "🌱", description: "이제 막 건강 관리와 나눔을 시작한 따뜻한 새싹콩입니다." },
  { id: "bud", name: "성장콩", minAmount: 5000, maxAmount: 9999, color: "bg-emerald-100 text-emerald-700 border-emerald-300", badgeEmoji: "🌿", description: "꾸준히 실천하며 작은 나눔을 키워가는 성장콩이에요." },
  { id: "angel", name: "기부콩", minAmount: 10000, maxAmount: 29999, color: "bg-blue-100 text-blue-700 border-blue-300", badgeEmoji: "😇", description: "매일의 건강 기록이 누군가의 희망이 되는 기부콩입니다." },
  { id: "golden", name: "황금콩", minAmount: 30000, maxAmount: 99999, color: "bg-amber-100 text-amber-700 border-amber-300", badgeEmoji: "👼", description: "건강과 나눔의 본보기가 되는 황금콩! 모두의 롤모델이에요." },
  { id: "platinum", name: "플래티넘콩", minAmount: 100000, maxAmount: Infinity, color: "bg-purple-100 text-purple-700 border-purple-300", badgeEmoji: "🏆", description: "거의 3년간 매일 건강을 기록한 전설적인 헬시콩 ✨ 진정한 챔피언입니다!" },
];

export function getUserLevel(totalDonation: number): DonationLevel {
  return (
    DONATION_LEVELS.find((lv) => totalDonation >= lv.minAmount && totalDonation <= lv.maxAmount) ||
    DONATION_LEVELS[0]
  );
}

export async function getUserPostsByUid(uid: string): Promise<CommunityPost[]> {
  const q = query(collection(db, "posts"), where("authorUid", "==", uid));
  const snap = await getDocs(q);

  const toIso = (v:any) => v?.toDate ? v.toDate().toISOString()
                    : v instanceof Date ? v.toISOString()
                    : typeof v === "string" ? v : new Date().toISOString();

  const posts = snap.docs.map(d => {
    const data = d.data() as any;
    return {
      id: d.id,
      author: data.author,
      authorEmail: data.authorEmail ?? "",
      authorUid: data.authorUid ?? "",            // ✅ 안전 처리
      levelId: data.levelId,
      title: data.title,
      content: data.content,
      likes: typeof data.likes === "number" ? data.likes : 0,
      likedBy: Array.isArray(data.likedBy) ? data.likedBy : [],
      createdAt: toIso(data.createdAt),
    } as CommunityPost;
  });

  posts.sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime());
  return posts;
}

export interface CommunityComment {
  id: string;
  author: string;
  authorEmail: string;
  authorUid: string;
  levelId: string;
  content: string;
  createdAt: string | null;
  updatedAt?: string | null;
}

export interface CommunityPost {
  id: string;
  author: string;
  authorEmail: string;
  authorUid: string;
  levelId: string;
  title: string;
  content: string;
  likes: number;
  likedBy: string[];
  createdAt: string; // ISO
}

function toIso(v: any): string {
  if (!v) return new Date().toISOString();
  if (typeof v === "string") return v;
  if (v instanceof Date) return v.toISOString();
  if (v && typeof v.toDate === "function") return v.toDate().toISOString();
  return new Date().toISOString();
}

// ✅ 글 생성
export async function saveCommunityPost(
  post: Omit<CommunityPost, "id" | "createdAt" | "likes" | "likedBy">
  & { authorUid: string }
): Promise<CommunityPost> {
  const docRef = await addDoc(collection(db, "posts"), {
    ...post,
    likes: 0,
    likedBy: [],
    createdAt: serverTimestamp(),
  });
  return {
    ...post,
    id: docRef.id,
    likes: 0,
    likedBy: [],
    createdAt: new Date().toISOString(),
  };
}

// ✅ 전체 글 조회
export async function getCommunityPosts(): Promise<CommunityPost[]> {
  const snap = await getDocs(collection(db, "posts"));
  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      author: data.author,
      authorEmail: data.authorEmail,
      authorUid: data.authorUid ?? "",
      levelId: data.levelId,
      title: data.title,
      content: data.content,
      likes: typeof data.likes === "number" ? data.likes : 0,
      likedBy: Array.isArray(data.likedBy) ? data.likedBy : [],
      createdAt: toIso(data.createdAt) || new Date().toISOString(),
    } as CommunityPost;
  });
}

export async function getUserPosts(authorEmail: string): Promise<CommunityPost[]> {
  // 우선 인덱스 없이 where만
  const q = query(
    collection(db, "posts"),
    where("authorEmail", "==", authorEmail.trim()),
    // orderBy("createdAt", "desc") // ← 인덱스 만들기 전이면 제거
  );

  const snap = await getDocs(q);
  const rows: CommunityPost[] = snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      author: data.author,
      authorEmail: data.authorEmail ?? "",
      authorUid: data.authorUid ?? "",
      levelId: data.levelId,
      title: data.title,
      content: data.content,
      likes: typeof data.likes === "number" ? data.likes : 0,
      likedBy: Array.isArray(data.likedBy) ? data.likedBy : [],
      createdAt: toIso(data.createdAt),
    };
  });

  // 클라이언트 정렬 (최신순)
  rows.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return rows;
}

// ✅ 좋아요 토글
export async function likePost(postId: string, userUid: string): Promise<void> {
  const postRef = doc(db, "posts", postId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(postRef);
    if (!snap.exists()) return;

    const data = snap.data() as any;
    const likedBy: string[] = Array.isArray(data.likedBy) ? data.likedBy : [];
    const already = likedBy.includes(userUid);
    const likes = typeof data.likes === "number" ? data.likes : 0;

    tx.update(postRef, {
      likes: already ? Math.max(0, likes - 1) : likes + 1,
      likedBy: already ? likedBy.filter((e) => e !== userUid) : [...likedBy, userUid],
    });
  });
}

// ✅ 댓글 추가
export async function addComment(
  postId: string,
  comment: Omit<CommunityComment, "id" | "createdAt">
): Promise<void> {
  await addDoc(collection(db, "posts", postId, "comments"), {
    ...comment,
    createdAt: serverTimestamp(),
    updatedAt: null,
  });
}

// ✅ 글 삭제(작성자 본인만)
export async function deletePost(postId: string, userUid: string): Promise<boolean> {
  const all = await getDocs(collection(db, "posts"));
  const target = all.docs.find(
    (d) => d.id === postId && (d.data() as any).authorUid === userUid
  );
  if (!target) return false;
  await deleteDoc(doc(db, "posts", postId));
  return true;
}
