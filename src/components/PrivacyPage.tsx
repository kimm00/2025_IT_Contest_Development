import {
  Shield,
  Lock,
  Eye,
  FileText,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface PrivacyPageProps {
  onNavigateBack: () => void;
}

export default function PrivacyPage({ onNavigateBack }: PrivacyPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            className="text-emerald-600 hover:text-emerald-700 mb-4 px-0 hover:bg-emerald-50"
            onClick={onNavigateBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-10 h-10 text-emerald-600" />
            <h1 className="text-gray-900">개인정보 처리방침</h1>
          </div>
          <p className="text-gray-600">
            최종 수정일: 2025년 1월 1일 | 시행일: 2025년 1월 1일
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-12">
        {/* Introduction */}
        <Card className="mb-8 bg-emerald-50 border-emerald-200">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-gray-900 mb-2">개인정보 보호를 최우선으로 합니다</h3>
                <p className="text-gray-700 leading-relaxed">
                  헬시콩(이하 "회사")은 이용자의 개인정보를 매우 중요하게 생각하며,
                  「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등
                  관련 법령을 준수하고 있습니다. 본 방침은 회사가 수집하는 개인정보의 항목,
                  수집 및 이용 목적, 보유 및 이용 기간, 파기 절차 등을 상세히 안내합니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 1 */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-700">1</span>
            </div>
            <h2 className="text-gray-900">수집하는 개인정보의 항목</h2>
          </div>

          <Card className="mb-4">
            <CardContent className="p-6">
              <h3 className="text-gray-900 mb-3">1.1 필수 수집 항목</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>회원가입 시:</strong> 이메일 주소, 비밀번호, 이름, 생년월일
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>서비스 이용 시:</strong> 혈당 수치, 혈압 수치, 복용 약물 정보, 체중, 운동 기록
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>자동 수집 정보:</strong> IP 주소, 쿠키, 접속 로그, 서비스 이용 기록
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-gray-900 mb-3">1.2 선택 수집 항목</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>전화번호 (본인 인증 시)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>프로필 사진</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>마케팅 정보 수신 동의 여부</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-700">2</span>
            </div>
            <h2 className="text-gray-900">개인정보의 수집 및 이용 목적</h2>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-900 mb-2">2.1 회원 관리</h3>
                  <p className="text-gray-600">
                    회원제 서비스 제공, 본인 확인, 개인 식별, 불량회원의 부정 이용 방지,
                    가입 의사 확인, 연령 확인, 불만처리 등 민원 처리, 고지사항 전달
                  </p>
                </div>

                <div>
                  <h3 className="text-gray-900 mb-2">2.2 서비스 제공</h3>
                  <p className="text-gray-600">
                    건강 데이터 기록 및 관리, 건강 리포트 생성, 기부금 적립 현황 제공,
                    맞춤형 건강 정보 제공, 서비스 개선을 위한 통계 분석
                  </p>
                </div>

                <div>
                  <h3 className="text-gray-900 mb-2">2.3 마케팅 및 광고</h3>
                  <p className="text-gray-600">
                    신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공
                    (사전 동의를 받은 경우에 한함)
                  </p>
                </div>

                <div>
                  <h3 className="text-gray-900 mb-2">2.4 연구 목적</h3>
                  <p className="text-gray-600">
                    익명화된 건강 데이터를 활용한 만성질환 관리 연구
                    (IRB 승인 및 별도 동의를 받은 경우에 한함)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-700">3</span>
            </div>
            <h2 className="text-gray-900">개인정보의 보유 및 이용 기간</h2>
          </div>

          <Card>
            <CardContent className="p-6">
              <p className="text-gray-700 mb-4">
                회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
                단, 다음의 경우에는 명시한 기간 동안 보존합니다.
              </p>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-gray-900 mb-2">회원 탈퇴 시</h3>
                  <p className="text-gray-600">
                    회원 탈퇴 즉시 파기 (단, 부정 이용 방지를 위해 이메일 주소는
                    해시 처리하여 3개월간 보관)
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-gray-900 mb-2">법령에 따른 보존</h3>
                  <ul className="space-y-1 text-gray-600 text-sm mt-2">
                    <li>• 계약 또는 청약철회 기록: 5년 (전자상거래법)</li>
                    <li>• 대금결제 및 재화의 공급 기록: 5년 (전자상거래법)</li>
                    <li>• 소비자 불만 또는 분쟁처리 기록: 3년 (전자상거래법)</li>
                    <li>• 웹사이트 방문 기록: 3개월 (통신비밀보호법)</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-gray-900 mb-2">건강 데이터</h3>
                  <p className="text-gray-600">
                    회원 탈퇴 시 즉시 파기하되, 연구 목적으로 별도 동의를 받은 경우
                    익명화 처리 후 연구 종료 시까지 보관
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-700">4</span>
            </div>
            <h2 className="text-gray-900">개인정보의 제3자 제공</h2>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
                    다만, 아래의 경우에는 예외로 합니다.
                  </p>
                </div>
              </div>

              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  <span>이용자가 사전에 동의한 경우</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">•</span>
                  <span>
                    법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의
                    요구가 있는 경우
                  </span>
                </li>
              </ul>

              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h3 className="text-gray-900 mb-2">파트너사 정보 공유 (아템제약)</h3>
                <p className="text-gray-600 mb-3">
                  기부금 매칭을 위해 아래 정보를 제공합니다:
                </p>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 제공 항목: 익명화된 사용자 ID, 기부금 적립 내역</li>
                  <li>• 제공 목적: 기부금 매칭 및 투명성 보고</li>
                  <li>• 보유 기간: 제공 목적 달성 시까지</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-700">5</span>
            </div>
            <h2 className="text-gray-900">개인정보의 파기 절차 및 방법</h2>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-900 mb-2">파기 절차</h3>
                  <p className="text-gray-600">
                    이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류함)
                    내부 방침 및 기타 관련 법령에 따라 일정 기간 저장된 후 파기됩니다.
                  </p>
                </div>

                <div>
                  <h3 className="text-gray-900 mb-2">파기 방법</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <Lock className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>전자적 파일:</strong> 복구 및 재생이 불가능한 기술적 방법을 사용하여 완전히 삭제
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>종이 문서:</strong> 분쇄기로 분쇄하거나 소각
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-700">6</span>
            </div>
            <h2 className="text-gray-900">이용자의 권리와 행사 방법</h2>
          </div>

          <Card>
            <CardContent className="p-6">
              <p className="text-gray-700 mb-4">
                이용자는 언제든지 다음과 같은 개인정보 보호 관련 권리를 행사할 수 있습니다:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-lg p-4">
                  <h3 className="text-gray-900 mb-2">열람 요구권</h3>
                  <p className="text-gray-600 text-sm">
                    본인의 개인정보를 열람할 수 있습니다
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-gray-900 mb-2">정정 요구권</h3>
                  <p className="text-gray-600 text-sm">
                    오류가 있는 경우 정정을 요구할 수 있습니다
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-gray-900 mb-2">삭제 요구권</h3>
                  <p className="text-gray-600 text-sm">
                    개인정보의 삭제를 요구할 수 있습니다
                  </p>
                </div>

                <div className="bg-amber-50 rounded-lg p-4">
                  <h3 className="text-gray-900 mb-2">처리정지 요구권</h3>
                  <p className="text-gray-600 text-sm">
                    개인정보 처리의 정지를 요구할 수 있습니다
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  권리 행사는 마이페이지에서 직접 하거나,
                  <a
                    href="mailto:privacy@healthykong.com"
                    className="text-emerald-600 hover:underline"
                  >
                    {" "}
                    privacy@healthykong.com
                  </a>
                  으로 서면, 이메일 등을 통해 하실 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-700">7</span>
            </div>
            <h2 className="text-gray-900">개인정보 보호책임자 및 담당자</h2>
          </div>

          <Card>
            <CardContent className="p-6">
              <p className="text-gray-700 mb-4">
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고,
                개인정보 처리와 관련한 이용자의 불만처리 및 피해구제를 위하여 아래와 같이
                개인정보 보호책임자를 지정하고 있습니다.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 rounded-lg p-6">
                  <h3 className="text-gray-900 mb-3">개인정보 보호책임자</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      <strong>성명:</strong> 김OO
                    </li>
                    <li>
                      <strong>직책:</strong> CPO (개인정보 보호책임자)
                    </li>
                    <li>
                      <strong>이메일:</strong> privacy@healthykong.com
                    </li>
                    <li>
                      <strong>전화:</strong> 02-1234-5678
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-gray-900 mb-3">개인정보 보호담당자</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      <strong>성명:</strong> 이OO
                    </li>
                    <li>
                      <strong>부서:</strong> 정보보호팀
                    </li>
                    <li>
                      <strong>이메일:</strong> privacy@healthykong.com
                    </li>
                    <li>
                      <strong>전화:</strong> 02-1234-5679
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-700">8</span>
            </div>
            <h2 className="text-gray-900">개인정보 처리방침의 변경</h2>
          </div>

          <Card>
            <CardContent className="p-6">
              <p className="text-gray-700">
                본 개인정보 처리방침은 법령, 정책 또는 보안기술의 변경에 따라 내용이 추가, 삭제 및
                수정될 수 있으며,
                변경 시에는 최소 7일 전에 홈페이지를 통해 공지하겠습니다.
                중요한 변경 사항이 있는 경우에는 30일 전에 공지하며,
                필요 시 이용자의 동의를 다시 받을 수 있습니다.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Contact */}
        <Card className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <Eye className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-white mb-3">개인정보 침해 신고 및 상담</h3>
            <p className="mb-6 opacity-90">
              개인정보 침해에 대한 신고나 상담이 필요하신 경우 아래 기관에 문의하실 수 있습니다.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="mb-1">개인정보침해신고센터</p>
                <p className="opacity-80">(국번없이) 118</p>
                <p className="opacity-80 text-xs">privacy.kisa.or.kr</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="mb-1">대검찰청 사이버수사과</p>
                <p className="opacity-80">(국번없이) 1301</p>
                <p className="opacity-80 text-xs">www.spo.go.kr</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="mb-1">경찰청 사이버안전국</p>
                <p className="opacity-80">(국번없이) 182</p>
                <p className="opacity-80 text-xs">cyberbureau.police.go.kr</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={onNavigateBack}
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}