import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { login } from "../utils/auth";
import { toast } from "sonner";

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigateToSignup: () => void;
  onBackToLanding: () => void;
}

export default function LoginPage({ onLoginSuccess, onNavigateToSignup, onBackToLanding }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (login(email, password)) {
        toast.success("로그인 성공!");
        onLoginSuccess();
      } else {
        toast.error("이메일 또는 비밀번호가 올바르지 않습니다.");
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
            <CardTitle>로그인</CardTitle>
            <CardDescription>
              헬시콩(HealthyKong) 계정으로 로그인하세요
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {loading ? "로그인 중..." : "로그인"}
              </Button>
              <div className="text-sm text-center text-gray-600">
                계정이 없으신가요?{" "}
                <button
                  type="button"
                  onClick={onNavigateToSignup}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  회원가입
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
