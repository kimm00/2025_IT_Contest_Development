import { FileText, AlertCircle, CheckCircle, XCircle, Scale, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-6">
          <Button variant="ghost" asChild className="text-emerald-600 hover:text-emerald-700 mb-4 px-0 hover:bg-emerald-50">
            <Link
              to="/"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Scale className="w-10 h-10 text-emerald-600" />
            <h1 className="text-gray-900">서비스 이용약관</h1>
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
                <h3 className="text-gray-900 mb-2">약관 동의 안내</h3>
                <p className="text-gray-700 leading-relaxed">
                  본 약관은 헬시콩(HealthyKong, 이하 "회사")이 제공하는 스마트 헬스케어 기부 챌린지 플랫폼 서비스(이하 "서비스")의 
                  이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다. 
                  서비스를 이용하시기 전에 본 약관을 자세히 읽어주시기 바랍니다.
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
            <h2 className="text-gray-900">총칙</h2>
          </div>
          
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-gray-900 mb-2">제1조 (목적)</h3>
                <p className="text-gray-600">
                  본 약관은 회사가 제공하는 서비스의 이용 조건 및 절차, 회사와 이용자 간의 권리, 
                  의무 및 책임사항 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
              </div>

              <div>
                <h3 className="text-gray-900 mb-2">제2조 (용어의 정의)</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><strong>① "서비스"</strong>란 만성질환 관리를 위한 건강 데이터 기록, 기부금 적립, 건강 리포트 제공 등 회사가 제공하는 모든 서비스를 말합니다.</li>
                  <li><strong>② "이용자"</strong>란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
                  <li><strong>③ "회원"</strong>이란 회사와 서비스 이용계약을 체결하고 아이디를 부여받은 이용자를 말합니다.</li>
                  <li><strong>④ "기부금"</strong>이란 회원의 건강 관리 활동에 따라 파트너사의 후원으로 적립되는 가상의 금액을 말합니다.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-gray-900 mb-2">제3조 (약관의 효력 및 변경)</h3>
                <p className="text-gray-600 mb-2">
                  ① 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.
                </p>
                <p className="text-gray-600">
                  ② 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 
                  약관을 변경할 경우 적용일자 및 변경사유를 명시하여 최소 7일 전에 공지합니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-700">2</span>
            </div>
            <h2 className="text-gray-900">서비스 이용계약</h2>
          </div>
          
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-gray-900 mb-2">제4조 (이용계약의 성립)</h3>
                <p className="text-gray-600 mb-2">
                  ① 이용계약은 이용자가 본 약관에 동의하고 회원가입 신청을 한 후 회사가 이를 승낙함으로써 성립합니다.
                </p>
                <p className="text-gray-600">
                  ② 회사는 다음 각 호에 해당하는 경우 승낙을 거부하거나 유보할 수 있습니다:
                </p>
                <ul className="space-y-1 text-gray-600 mt-2 ml-4">
                  <li>• 실명이 아니거나 타인의 명의를 이용한 경우</li>
                  <li>• 허위 정보를 기재하거나 회사가 제시하는 내용을 기재하지 않은 경우</li>
                  <li>• 14세 미만 아동이 법정대리인의 동의를 얻지 않은 경우</li>
                  <li>• 이용자의 귀책사유로 인하여 승인이 불가능하거나 기타 규정한 제반 사항을 위반한 경우</li>
                </ul>
              </div>

              <div>
                <h3 className="text-gray-900 mb-2">제5조 (회원정보의 변경)</h3>
                <p className="text-gray-600">
                  회원은 개인정보관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다. 
                  회원은 회원가입 시 기재한 사항이 변경되었을 경우 즉시 수정하여야 하며, 
                  수정하지 않아 발생한 문제의 책임은 회원에게 있습니다.
                </p>
              </div>

              <div>
                <h3 className="text-gray-900 mb-2">제6조 (회원탈퇴 및 자격 상실)</h3>
                <p className="text-gray-600 mb-2">
                  ① 회원은 언제든지 탈퇴를 요청할 수 있으며 회사는 즉시 회원탈퇴를 처리합니다.
                </p>
                <p className="text-gray-600">
                  ② 회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수 있습니다:
                </p>
                <ul className="space-y-1 text-gray-600 mt-2 ml-4">
                  <li>• 가입 신청 시 허위 내용을 등록한 경우</li>
                  <li>• 타인의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</li>
                  <li>• 서비스를 이용하여 법령 또는 본 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
                </ul>
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
            <h2 className="text-gray-900">서비스 이용</h2>
          </div>
          
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-gray-900 mb-2">제7조 (서비스의 제공)</h3>
                <p className="text-gray-600 mb-2">
                  회사는 다음과 같은 서비스를 제공합니다:
                </p>
                <ul className="space-y-1 text-gray-600 ml-4">
                  <li>• 건강 데이터 기록 및 관리 (혈당, 혈압, 약 복용, 운동 등)</li>
                  <li>• 기부금 적립 시스템</li>
                  <li>• 건강 리포트 및 통계 시각화</li>
                  <li>• 동기부여 시스템 (뱃지, 누적 기부금 표시 등)</li>
                  <li>• 기타 회사가 추가 개발하거나 제휴계약 등을 통해 제공하는 일체의 서비스</li>
                </ul>
              </div>

              <div>
                <h3 className="text-gray-900 mb-2">제8조 (서비스의 중단)</h3>
                <p className="text-gray-600 mb-2">
                  ① 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 
                  서비스의 제공을 일시적으로 중단할 수 있습니다.
                </p>
                <p className="text-gray-600">
                  ② 제1항에 의한 서비스 중단의 경우 회사는 사전에 통지합니다. 
                  다만, 회사가 통제할 수 없는 사유로 인한 서비스의 중단으로 인하여 사전 통지가 불가능한 경우에는 그러하지 아니합니다.
                </p>
              </div>

              <div>
                <h3 className="text-gray-900 mb-2">제9조 (기부금 시스템)</h3>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm">
                      <strong>중요:</strong> 기부금은 파트너사(아템제약)의 후원으로 적립되는 가상의 금액이며, 
                      회원이 직접 금전을 지불하거나 수령하지 않습니다.
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li><strong>① 적립 조건:</strong> 회원이 당일 처음으로 건강 데이터를 기록할 때 100원이 자동 적립됩니다.</li>
                  <li><strong>② 적립 한도:</strong> 1일 1회, 1개월 최대 3,000원까지 적립 가능합니다.</li>
                  <li><strong>③ 기부 실행:</strong> 누적 기부금이 10,000원 이상 적립되면 자동으로 지정된 환자 지원 프로그램에 기부됩니다.</li>
                  <li><strong>④ 투명성:</strong> 모든 기부금 적립 및 사용 내역은 마이페이지에서 확인할 수 있습니다.</li>
                </ul>
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
            <h2 className="text-gray-900">회원의 의무</h2>
          </div>
          
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-gray-900 mb-2">제10조 (회원의 의무)</h3>
                <p className="text-gray-600 mb-3">
                  회원은 다음 행위를 하여서는 안 됩니다:
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-gray-700">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>신청 또는 변경 시 허위 내용의 등록</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>타인의 정보 도용</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>회사에 게시된 정보의 무단 변경</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>부정한 방법으로 기부금을 적립하거나 시스템을 악용하는 행위</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-gray-900 mb-2">제11조 (정보의 정확성)</h3>
                <p className="text-gray-600">
                  회원이 입력하는 건강 데이터는 본인의 실제 측정 결과를 정확히 기록해야 합니다. 
                  허위 데이터 입력으로 인한 건강상의 문제 또는 서비스 이용 제한에 대한 책임은 회원에게 있습니다.
                </p>
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
            <h2 className="text-gray-900">책임 및 면책</h2>
          </div>
          
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-gray-900 mb-2">제12조 (회사의 의무)</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>회사는 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 
                    지속적이고 안정적으로 서비스를 제공하기 위해 최선을 다합니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>회사는 이용자가 안전하게 서비스를 이용할 수 있도록 개인정보 보호를 위한 
                    보안 시스템을 구축하며 개인정보 처리방침을 공시하고 준수합니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>회사는 서비스 이용과 관련하여 발생하는 이용자의 불만 또는 피해구제 요청을 
                    적절하게 처리하기 위한 절차를 마련합니다.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-gray-900 mb-3">제13조 (면책사항)</h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>① 의료 서비스 아님:</strong> 본 서비스는 의료 서비스가 아니며, 
                    제공되는 정보는 참고용일 뿐 의학적 진단, 치료, 처방의 대체 수단이 될 수 없습니다. 
                    의료적 결정은 반드시 전문의와 상담하시기 바랍니다.
                  </p>
                  <p>
                    <strong>② 천재지변 등:</strong> 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 
                    서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
                  </p>
                  <p>
                    <strong>③ 회원의 귀책사유:</strong> 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 
                    책임을 지지 않습니다.
                  </p>
                  <p>
                    <strong>④ 제3자 제공 정보:</strong> 회사는 회원이 서비스를 이용하여 기대하는 수익을 얻지 못하거나 
                    상실한 것에 대하여 책임을 지지 않으며, 서비스를 통하여 얻은 자료로 인한 손해에 대하여 책임을 지지 않습니다.
                  </p>
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
            <h2 className="text-gray-900">기타</h2>
          </div>
          
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-gray-900 mb-2">제14조 (저작권의 귀속 및 이용제한)</h3>
                <p className="text-gray-600 mb-2">
                  ① 회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.
                </p>
                <p className="text-gray-600">
                  ② 이용자는 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 
                  방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
                </p>
              </div>

              <div>
                <h3 className="text-gray-900 mb-2">제15조 (분쟁해결)</h3>
                <p className="text-gray-600 mb-2">
                  ① 회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 
                  피해보상처리기구를 설치·운영합니다.
                </p>
                <p className="text-gray-600">
                  ② 회사와 이용자 간에 발생한 분쟁은 전자거래기본법 제28조 및 동 시행령 제15조에 의하여 
                  설치된 전자거래분쟁조정위원회의 조정에 따를 수 있습니다.
                </p>
              </div>

              <div>
                <h3 className="text-gray-900 mb-2">제16조 (재판권 및 준거법)</h3>
                <p className="text-gray-600 mb-2">
                  ① 회사와 이용자 간에 발생한 전자거래 분쟁에 관한 소송은 민사소송법상의 관할법원에 제기합니다.
                </p>
                <p className="text-gray-600">
                  ② 회사와 이용자 간에 제기된 전자거래 소송에는 대한민국 법을 적용합니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact */}
        <Card className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-white mb-3">약관 관련 문의</h3>
            <p className="mb-6 opacity-90">
              본 약관에 대한 문의사항이 있으시면 아래로 연락 주시기 바랍니다.
            </p>
            <div className="bg-white/10 rounded-lg p-4 inline-block">
              <p className="mb-2">헬시콩 고객센터</p>
              <p className="text-sm opacity-90">이메일: support@healthykong.com</p>
              <p className="text-sm opacity-90">전화: 02-1234-5678 (평일 09:00-18:00)</p>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            <Link
              to="/"
            >
              홈으로 돌아가기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}