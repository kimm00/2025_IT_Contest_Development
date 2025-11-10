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
  increment,
} from "firebase/firestore";

// -------------------- 레벨 시스템 --------------------

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
    id: "sprout",
    name: "새싹콩",
    minAmount: 0,
    maxAmount: 4999,
    color: "bg-green-100 text-green-700 border-green-300",
    badgeEmoji: "🌱",
    description: "이제 막 건강 관리와 나눔을 시작한 따뜻한 새싹콩입니다.",
  },
  {
    id: "bud",
    name: "성장콩",
    minAmount: 5000,
    maxAmount: 9999,
    color: "bg-emerald-100 text-emerald-700 border-emerald-300",
    badgeEmoji: "🌿",
    description: "꾸준히 실천하며 작은 나눔을 키워가는 성장콩이에요.",
  },
  {
    id: "angel",
    name: "기부콩",
    minAmount: 10000,
    maxAmount: 29999,
    color: "bg-blue-100 text-blue-700 border-blue-300",
    badgeEmoji: "😇",
    description: "매일의 건강 기록이 누군가의 희망이 되는 기부콩입니다.",
  },
  {
    id: "golden",
    name: "황금콩",
    minAmount: 30000,
    maxAmount: 99999,
    color: "bg-amber-100 text-amber-700 border-amber-300",
    badgeEmoji: "👼",
    description: "건강과 나눔의 본보기가 되는 황금콩! 모두의 롤모델이에요.",
  },
  {
    id: "platinum",
    name: "플래티넘콩",
    minAmount: 100000,
    maxAmount: Infinity,
    color: "bg-purple-100 text-purple-700 border-purple-300",
    badgeEmoji: "🏆",
    description:
      "거의 3년간 매일 건강을 기록한 전설적인 헬시콩 ✨ 진정한 챔피언입니다!",
  },
];

export function getUserLevel(totalDonation: number): DonationLevel {
  return (
    DONATION_LEVELS.find(
      (level) =>
        totalDonation >= level.minAmount && totalDonation <= level.maxAmount
    ) || DONATION_LEVELS[0]
  );
}

// -------------------- 데이터 인터페이스 --------------------

export interface CommunityComment {
  id: string;
  author: string;
  authorEmail: string;
  levelId: string;
  content: string;
  createdAt: string;
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
  createdAt: string;
}

// -------------------- Firestore CRUD --------------------

// ✅ 글 생성
export async function saveCommunityPost(
  post: Omit<CommunityPost, "id" | "createdAt" | "likes" | "likedBy">
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

// ✅ 글 목록 조회
export async function getCommunityPosts(): Promise<CommunityPost[]> {
  const snap = await getDocs(collection(db, "posts"));
  return snap.docs.map(
    (d) =>
      ({
        id: d.id,
        ...d.data(),
      } as CommunityPost)
  );
}

// ✅ 좋아요 토글
export async function likePost(
  postId: string,
  userEmail: string
): Promise<void> {
  const postRef = doc(db, "posts", postId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(postRef);
    if (!snap.exists()) return;
    const data = snap.data() as CommunityPost;
    const alreadyLiked = data.likedBy.includes(userEmail);
    const updatedLikes = alreadyLiked ? Math.max(0, data.likes - 1) : data.likes + 1;
    const updatedLikedBy = alreadyLiked
      ? data.likedBy.filter((e: string) => e !== userEmail)
      : [...data.likedBy, userEmail];
    tx.update(postRef, {
      likes: updatedLikes,
      likedBy: updatedLikedBy,
    });
  });
}

// ✅ 댓글 추가 (하위 컬렉션)
export async function addComment(
  postId: string,
  comment: Omit<CommunityComment, "id" | "createdAt">
): Promise<void> {
  const commentsRef = collection(db, "posts", postId, "comments");
  await addDoc(commentsRef, {
    ...comment,
    createdAt: serverTimestamp(),
    // ✅ 댓글 생성 시 reactions 기본 구조 추가
    reactions: {
      like: [],
      funny: [],
      sad: [],
      angry: [],
    },
  });
}

// ✅ 글 삭제
export async function deletePost(
  postId: string,
  userEmail: string
): Promise<boolean> {
  const snap = await getDocs(collection(db, "posts"));
  const target = snap.docs.find(
    (d) => d.id === postId && (d.data() as any).authorEmail === userEmail
  );
  if (!target) return false;
  await deleteDoc(doc(db, "posts", postId));
  return true;
}
