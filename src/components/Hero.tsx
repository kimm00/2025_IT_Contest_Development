import { Button } from "./ui/button";
import { Heart, ArrowRight, Zap, Brain, Trophy, Gift } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Main Hero Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full w-fit">
              <Heart className="w-4 h-4" />
              <span>Heal yourself, help others</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl tracking-tight text-gray-900">
              <span className="block">HealthyKong</span>
              <span className="block text-emerald-600 mt-2">헬시콩</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-xl">
              <strong className="text-emerald-700">"Self-care becomes Social-care."</strong>
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              매일 <strong className="text-emerald-700">혈당, 혈압, 운동 등 건강 루틴을 기록</strong>하면, 
              그 기록이 <strong className="text-emerald-700">실제 기부금으로 환산</strong>되어 사회에 환원되는 IT 헬스케어 서비스입니다.
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>💡 </strong> 작심삼일로 끝나는 건강 관리를 <strong>게이미피케이션 & 소셜 임팩트</strong>로 해결하는 개인 맞춤형 플랫폼
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg"
                asChild
              >
                <Link to="/signup">
                  시작하기
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-6 text-lg border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                asChild
              >
                <Link to="/about">
                  더 알아보기
                </Link>
              </Button>
            </div>
            
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl text-emerald-600">72%</div>
                <div className="text-sm text-gray-600">이탈률 감소</div>
              </div>
              <div>
                <div className="text-3xl text-emerald-600">100P</div>
                <div className="text-sm text-gray-600">일일 최대 적립</div>
              </div>
              <div>
                <div className="text-3xl text-emerald-600">13개</div>
                <div className="text-sm text-gray-600">뱃지 컬렉션</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1758691462353-36b215702253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjB0ZWNobm9sb2d5JTIwd2VsbG5lc3N8ZW58MXx8fHwxNzYyMzIyNDg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Health Technology"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">오늘의 총 적립 포인트</div>
                  <div className="text-emerald-600">+2,400P 적립</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}