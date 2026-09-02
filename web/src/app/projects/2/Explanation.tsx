import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { InlineMath, BlockMath } from 'react-katex';

export default function Explanation(){

    const interpolation = ["0", "1/3", "2/3", "1"];
    const xy = ["x","y"];

    return (
        <div className="mt-10">
            <div className="mb-10">
                <h1 className="font-bold text-xl mb-6">곡선의 표현 방식</h1>
                <div className="mb-6 ml-2">
                    <h2 className="font-bold text-lg mb-2">1. 암시적 표현 (Implicit Representation)</h2>
                    <div className="ml-2 text-sm space-y-2">
                        <p>대부분의 곡선은&nbsp;
                            <InlineMath math="f(x,y) = 0"/>
                            와 같은 형태로 표현 가능
                        </p>
                        <div className="mt-4">예시</div>
                        <p>직선: <InlineMath math="ax + bx + c = 0"/></p>
                        <p>원: <InlineMath math="x^2 + y^2 = r^2"/></p>
                    </div>
                </div>
                <div className="mb-6 ml-2">
                    <h2 className="font-bold text-lg mb-2">2. 매개변수 표현 (Parameteric Represenation)</h2>
                    <div className="ml-2 text-sm space-y-2">
                        <p>각 구성 요소
                            <InlineMath math="(x,y)"/>
                            의 값이 독립 변수
                            &nbsp;<InlineMath math="u"/>&nbsp;
                            (매개변수)에 따라 달라지는 표현 방식
                        </p>
                        <p className="mt-4">예시</p>
                        <p><InlineMath math="x = x(u)"/></p>
                        <p><InlineMath math="y = y(u)"/></p>
                        <p className={`mt-4`}>벡터로 표현</p>
                        <p><InlineMath math="p(u) = \begin{pmatrix}x(u)\\y(u)\end{pmatrix}"/></p>
                        <p className="mb-2 text-sm"><strong className="text-lg">- 미분 (Derivative) </strong><InlineMath math="\cfrac{dp(u)}{du}"/></p>
                        <p><strong>방향 (Direction):</strong> 곡선의 접선(tangent) 방향</p>
                        <p><strong>크기 (Magnitude):</strong> 매개변수 <InlineMath math="u"/>에 따른 곡선 변화의 속도(speed)</p>
                    </div>
                </div>
            </div>

            <div className="mb-10">
                <h1 className="font-bold text-xl mb-4 mt-6">표현 선택 기준</h1>
                <div className="space-y-4 mb-6 ml-2 text-sm">
                    <ul className="list-disc list-outside space-y-2 mb-8 ml-4">
                        <li>
                            <strong className="font-bold text-gray-900">
                                형태의 국부 제어 (Local control of shape):&nbsp;
                            </strong>
                            곡선의 한 부분을 변경해도 전체 곡선에 큰 영향을 미치지 않아야 한다.
                        </li>
                        <li>
                            <strong className="font-bold text-gray-900">
                                부드러움과 연속성 (Smoothness and Continuity):&nbsp;
                            </strong>
                            곡선이 매끄럽게 이어져야 한다.
                        </li>
                        <li>
                            <strong className="font-bold text-gray-900">
                                미분 평가 능력 (Ability to evaluate Derivative):&nbsp;
                            </strong>
                            곡선의 접선 등을 쉽게 계산할 수 있어야 한다.
                        </li>
                        <li>
                            <strong className="font-bold text-gray-900">
                                안정성 (Stability):&nbsp;
                            </strong>
                            작은 입력 변화가 큰 출력 변화로 이어지지 않아야 한다.
                        </li>
                        <li>
                            <strong className="font-bold text-gray-900">
                                렌더링 용이성 (Ease of Rendering):&nbsp;
                            </strong>
                            화면에 쉽게 그릴 수 있어야 한다.
                        </li>
                    </ul>
                    <p>매개변수 <InlineMath math="u"/>에 대한 다항식 형태의 매개변수 곡선이 위의 기준을 대부분 만족</p>
                    <p className="font-3xl mt-4 mb-4">
                        <InlineMath math={`x(u) = c_0 + c_1u + c_2u^2 + ... + c_nu^n = \\sum\\limits_{k=0}^{n}u^kc_k`}/>
                    </p>
                </div>
            </div>

            <div className="mb-10">
                <h1 className="font-bold text-xl mb-4 mt-6">매개변수 곡선의 행렬 방정식</h1>
                <div className="text-sm ml-2 space-y-2">
                    <p><InlineMath math={`x(u), y(u)`}/>에 대한 두 가지 방정식을 하나의 행렬 방정식으로 표현</p>
                    <p><InlineMath math={`p(u) 
                    = \\begin{pmatrix}x(u)\\\\[0.4em]y(u)\\end{pmatrix} 
                    = \\begin{pmatrix}\\sum\\limits_{k=0}^{n}u^kc_{xk}\\\\[1.2em]\\sum\\limits_{k=0}^{n}u^kc_{yk}\\end{pmatrix} 
                    = \\sum\\limits_{k=0}^{n}u^k\\begin{pmatrix}c_{xk}\\\\[0.4em]c_{yk}\\end{pmatrix} 
                    = \\sum\\limits_{k=0}^{n}u^kc_k`}/></p>
                    <p><InlineMath math={`c_k = \\begin{pmatrix}c_{xk}\\\\[0.4em]c_{yk}\\end{pmatrix}`}/>는 계수 벡터</p>
                </div>
            </div>

            <div className="mb-10">
                <h1 className="font-bold text-xl mb-4 mt-6">다항식의 차수</h1>
                <div className="text-sm ml-2 space-y-2">
                    <p></p>
                    <table className="max-w-lg border-collapse border border-gray-200 text-left text-sm bg-white shadow-sm rounded-lg overflow-hidden break-keep mb-6">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr className="divide-x divide-gray-200">
                            <th className="px-2 py-2 font-semibold text-gray-900 w-1/5"></th>
                            <th className="px-6 py-2 font-semibold text-green-700 w-2/5 bg-green-50/90">장점</th>
                            <th className="px-6 py-2 font-semibold text-red-700 w-2/5 bg-red-50/90">단점</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {/* 첫 번째 행 */}
                        <tr className="hover:bg-gray-50 transition-colors divide-x divide-gray-200">
                            <td className="px-2 py-2 font-medium text-gray-900 bg-gray-50/30 text-center">높은 차수</td>
                            <td className="px-6 py-2 text-gray-600 bg-green-50/10">급격한 변화와 많은 굴곡을 표현</td>
                            <td className="px-6 py-2 text-gray-600 bg-red-50/10">
                                <p className="mb-1 last:mb-0">더 많은 연산 요구</p>
                                <p className="mb-1 last:mb-0">매끄럽지 않은 곡선</p>
                            </td>
                        </tr>
                        {/* 두 번째 행 */}
                        <tr className="hover:bg-gray-50 transition-colors divide-x divide-gray-200">
                            <td className="px-2 py-2 font-medium text-gray-900 bg-gray-50/30 text-center">낮은 차수</td>
                            <td className="px-6 py-2 text-gray-600 bg-green-50/10">매끄러운 곡선</td>
                            <td className="px-6 py-2 text-gray-600 bg-red-50/10">정확한 데이터 표현 불가</td>
                        </tr>
                        </tbody>
                    </table>
                    <p className="mb-4"><strong>절충안: </strong>짧은 곡선 세그먼트에 낮은 차수의 다항식 사용</p>
                    <p className="mb-4"><strong className="mr-3">3차 다항식 곡선 표현:</strong><InlineMath math="p(u)=c_0+c_1u+c_2u^2+c_3u^3"/></p>
                    <p><InlineMath math="c_k=\begin{pmatrix}c_{xk}\\c_{yk}\end{pmatrix}"/></p>
                </div>
            </div>

            <div className="mb-10">
                <h1 className="font-bold text-xl mb-4 mt-6">다중 곡선 세그먼트</h1>
                <div className="text-sm ml-2 space-y-2">
                    <p>두 끝점 사이에 곡선 세그먼트를 정의&nbsp;<InlineMath math="(0 \leq u \leq 1)"/></p>
                    <ul className="list-disc list-outside space-y-2 mb-4 ml-4">
                        <li><InlineMath math="p(0)=p_0"/>&nbsp;(시작점)</li>
                        <li><InlineMath math="p(1)=p_1"/>&nbsp;(끝점)</li>
                    </ul>
                    <p>더 긴 곡선은 여러 개의 세그먼트로 구성되며 미분값의 연속성에 따라 부드러움이 결정</p>
                </div>
            </div>

            <div className="mb-10">
                <h1 className="font-bold text-xl mb-4 mt-6">보간법&nbsp;(Interpolation)</h1>
                <div className="text-sm ml-2 space-y-2">
                    <p>하나의 점이 2개의 방정식과 8개의 미지수를 제공하므로, 최소 4개의 점이 주어진다면 미지수를 풀 수 있다.</p>
                    <p>4개의 점에 대해 매개변수 <InlineMath math="u"/>의 값을 0부터 1까지 균등하게 나눈다 (예: <InlineMath math="0,&nbsp;1/3,&nbsp;2/3,&nbsp;1"/>)</p>
                    <ul className="list-disc list-outside space-y-2 ml-6">
                        {interpolation.map((t, index) => (
                            <li key={index}>
                                <InlineMath math={`p_${index}=p(${t})=\\begin{pmatrix}x(${t})\\\\y(${t})\\end{pmatrix}`}/>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mb-10">
                <h1 className="font-bold text-xl mb-4 mt-6">행렬 방정식 (Matrix Equation)</h1>
                <div className="text-sm ml-2 space-y-2">
                    <p>4개의 점에 대한 방정식을 행렬 형태로 정리</p>
                    <ul className="list-disc list-outside space-y-2 ml-6">
                        <li><InlineMath math="p_0=p(0)=c_0"/></li>
                        <li><InlineMath math="p_1 = p(1/3) = c_0 + {\scriptscriptstyle\frac{1}{3}}c_1 + \left({\scriptscriptstyle\frac{1}{3}}\right)^2 c_2 + \left({\scriptscriptstyle\frac{1}{3}}\right)^3 c_3"/></li>
                        <li><InlineMath math="p_2 = p(2/3) = c_0 + {\scriptscriptstyle\frac{2}{3}}c_1 + \left({\scriptscriptstyle\frac{2}{3}}\right)^2 c_2 + \left({\scriptscriptstyle\frac{2}{3}}\right)^3 c_3"/></li>
                        <li><InlineMath math="p_3=p(1)=c_0+c_1+c_2+c_3"/></li>
                    </ul>
                    <p><InlineMath math="p=Ac,\:p=\begin{bmatrix}p_0\\p_1\\p_2\\p_3\end{bmatrix},c=\begin{bmatrix}c_0\\c_1\\c_2\\c_3\end{bmatrix}"/></p>
                    <p><InlineMath math="A=\begin{bmatrix}1&0&0&0\\1&1/3&1/9&1/27\\1&2/3&4/9&8/27\\1&1&1&1\end{bmatrix}"/></p>
                    <p>미지수&nbsp;<InlineMath math="c"/>를 알기 위해&nbsp;<InlineMath math="c=A^{-1}p"/>&nbsp;계산</p>
                    <p><strong>보간 기하 행렬:&nbsp;</strong><InlineMath math="M=A^{-1}"/></p>
                    <p><InlineMath math="M=A^{-1}=\begin{bmatrix}1&0&0&0\\-5.5&9&-4.5&1\\9&-22.5&18&-4.5\\-4.5&13.5&-13.5&4.5\end{bmatrix}"/></p>
                </div>
            </div>
            <div className="mb-10">
                <h1 className="font-bold text-xl mb-4 mt-6">3차 표현</h1>
                <div className="text-sm ml-2 space-y-2">

                </div>
            </div>
            <div className="mb-10">
                <h1 className="font-bold text-xl mb-4 mt-6"></h1>
                <div className="text-sm ml-2 space-y-2"     >

                </div>
            </div>
        </div>
    )
}