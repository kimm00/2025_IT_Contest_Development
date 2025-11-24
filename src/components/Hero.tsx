import { Button } from "./ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
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
            
            <p className="text-lg text-gray-700">
              개인의 건강 관리 루틴을 사회적 선행으로 연결하는
              <br />
              <strong className="text-emerald-700"> 스마트 헬스케어 기부 챌린지 플랫폼</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
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
                <div className="text-3xl text-emerald-600">1,247</div>
                <div className="text-sm text-gray-600">활성 사용자</div>
              </div>
              <div>
                <div className="text-3xl text-emerald-600">₩2.4M</div>
                <div className="text-sm text-gray-600">누적 기부금</div>
              </div>
              <div>
                <div className="text-3xl text-emerald-600">89%</div>
                <div className="text-sm text-gray-600">목표 달성률</div>
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
                  <div className="text-sm text-gray-600">오늘의 챌린지</div>
                  <div className="text-emerald-600">3/5 완료</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}