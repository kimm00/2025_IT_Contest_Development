import { Users, Construction, Sparkles } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useAuth } from "../context/AuthContext";

export default function CommunityPage() {
  const { user } = useAuth();

  const getUserLevelDisplay = () => {
    const donation = user?.totalDonation || 0;
    if (donation >= 100000) return { emoji: '🏆', name: '플래티넘콩' };
    if (donation >= 30000) return { emoji: '👼', name: '황금콩' };
    if (donation >= 10000) return { emoji: '😇', name: '기부콩' };
    if (donation >= 5000) return { emoji: '🌿', name: '성장콩' };
    return { emoji: '🌱', name: '새싹콩' };
  };

  const level = getUserLevelDisplay();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-10 h-10 text-emerald-600" />
            <div>
              <h1 className="text-3xl text-gray-900">커뮤니티</h1>
              <p className="text-lg text-gray-600">
                같은 목표를 가진 회원들과 소통하세요
              </p>
            </div>
          </div>

          {/* User Level Badge */}
          {user && (
            <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{level.emoji}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl text-white">{user.name}님</h3>
                      <Badge className="bg-white text-emerald-700">
                        {level.name}
                      </Badge>
                    </div>
                    <p className="text-emerald-100 text-sm">
                      누적 기부금: {user.totalDonation.toLocaleString()}원
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Coming Soon Section */}
        <Card className="border-2 border-emerald-200 shadow-lg">
          <CardContent className="p-12 text-center">
            <Construction className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
            
            <h2 className="text-3xl text-gray-900 mb-4">
              <Sparkles className="w-8 h-8 text-yellow-500 inline-block mr-2" />
              곧 오픈합니다!
              <Sparkles className="w-8 h-8 text-yellow-500 inline-block ml-2" />
            </h2>
            
            <p className="text-lg text-gray-700 mb-4 max-w-lg mx-auto">
              현재 헬시콩 팀이 더 멋진 커뮤니티 기능을 만들기 위해 열심히 준비 중입니다.
            </p>
            <p className="text-gray-600">
              '기부콩', '황금콩' 등 레벨이 같은 회원분들과<br />
              소중한 꿀팁과 응원의 메시지를 나눌 수 있도록 곧 찾아올게요!
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}