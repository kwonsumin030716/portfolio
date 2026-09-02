import { InlineMath, BlockMath } from 'react-katex';

export default function Interpolation() {

    const interpolation = ["0", "1/3", "2/3", "1"];
    return (
        <div>
            <div className="mb-10">
                <h1 className="font-bold text-xl mb-4 mt-6">보간법&nbsp;(Interpolation)</h1>
                <div className="text-sm ml-2 space-y-2">
                    <p>4개의 점에 대해 매개변수 <InlineMath math="u"/>의 값을 0부터 1까지 균등하게 나눈다 (예: <InlineMath math="0,\:1/3,\:2/3,\:1"/>)</p>
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
                <h1 className="font-bold text-xl mb-4 mt-6">보간 기하 행렬 (Interpolating Geometry Matrix)</h1>
                <div className="text-sm ml-2 space-y-2">
                    <p>4개의 점 <InlineMath math="p_0,\:p_1,\:p_2,\:p_3"/>가 주어졌다고 가정</p>
                    <p><InlineMath math="
                    p=\begin{pmatrix}p_0\\p_1\\p_2\\p_3\end{pmatrix}
                    =\begin{pmatrix}c_0+c_1u+c_2u^2+c_3u^3\\c_0+c_1u+c_2u^2+c_3u^3\\c_0+c_1u+c_2u^2+c_3u^3\\c_0+c_1u+c_2u^2+c_3u^3\end{pmatrix}
                    =\begin{bmatrix}1&u&u^2&u^3\\1&u&u^2&u^3\\1&u&u^2&u^3\\1&u&u^2&u^3\end{bmatrix}
                    \begin{bmatrix}c_0\\c_1\\c_2\\c_3\end{bmatrix}
                    =Ac"/></p>
                </div>
            </div>
        </div>
    )
}