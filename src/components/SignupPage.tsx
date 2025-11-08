import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { signup } from "../utils/auth";
import { toast } from "sonner;
import { awardBadge } from "../utils/badges";

interface SignupPageProps {
  onSignupSuccess: () => void;
  onNavigateToLogin: () => void;
  onBackToLanding: () => void;
}

export default function SignupPage({ onSignupSuccess, onNavigateToLogin, onBackToLanding }: SignupPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      toast.error("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (signup(email, password, name)) {
        // Goal Setter 뱃지 부여
        awardBadge(email, 'goal_setter');
        toast.success("회원가입이 완료되었습니다! 🎯 첫 뱃지를 획득했어요!");
        onSignupSuccess();
      } else {
        toast.error("이미 사용 중인 이메일입니다.");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <button 
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Heart className="w-8 h-8 text-emerald-600" />
            <span className="text-2xl text-gray-900">HealthyKong</span>
          </button>
          <p className="text-gray-600">건강을 지키는 습관이, 또 다른 생명을 지킵니다</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>회원가입</CardTitle>
            <CardDescription>
              헬시콩(HealthyKong)과 함께 건강한 습관을 시작하세요
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="최소 6자 이상"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="비밀번호 재입력"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={loading}
              >
                {loading ? "가입 중..." : "회원가입"}
              </Button>
              <div className="text-sm text-center text-gray-600">
                이미 계정이 있으신가요?{" "}
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  로그인
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
