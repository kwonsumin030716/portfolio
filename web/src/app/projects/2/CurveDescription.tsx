import { InlineMath, BlockMath } from 'react-katex';
import type {curveType} from './page';

export default function CurveDescription({curveType}: curveType) {

    const interpolation = ["0", "1/3", "2/3", "1"];

    if(curveType === 'interpolation') {
        return (
            <div className="mb-6">
                <h1 className="font-bold text-xl mb-4 mt-6">보간법&nbsp;(Interpolation)</h1>
                <div className="text-sm ml-2 space-y-4">
                    <p>제어점<InlineMath math="p_1,\:p_2"/>를 <InlineMath math="p_0,\:p_3"/>의 보간점으로 간주하고 균등하게 나눈다.<InlineMath math="\:\:(0,\:1/3,\:2/3,\:1)"/></p>
                    <p><InlineMath math="p=\begin{pmatrix}p_0\\p_1\\p_2\\p_3\end{pmatrix}
                    =\begin{pmatrix}p(0)\\p(1/3)\\p(2/3)\\p(1)\end{pmatrix}
                    =\begin{pmatrix}
                    c_0\\[1ex]
                    c_0+{\scriptscriptstyle\frac{1}{3}}c_1 + \left({\scriptscriptstyle\frac{1}{3}}\right)^2 c_2 + \left({\scriptscriptstyle\frac{1}{3}}\right)^3 c_3\\[1ex]
                    c_0 + {\scriptscriptstyle\frac{2}{3}}c_1 + \left({\scriptscriptstyle\frac{2}{3}}\right)^2 c_2 + \left({\scriptscriptstyle\frac{2}{3}}\right)^3 c_3\\[1ex]
                    c_0+c_1+c_2+c_3
                    \end{pmatrix}
                    =\begin{bmatrix}1&0&0&0\\1&1/3&1/9&1/27\\1&2/3&4/9&8/27\\1&1&1&1\end{bmatrix}
                    \begin{bmatrix}c_0\\c_1\\c_2\\c_3\end{bmatrix}
                    =Ac
                    "/></p>
                    <p><InlineMath math="M_I=A^{-1}=\begin{bmatrix}1&0&0&0\\-5.5&9&-4.5&1\\9&-22.5&18&-4.5\\-4.5&13.5&-13.5&4.5\end{bmatrix}"/></p>
                    <p><InlineMath math="b(u)=M_I^Tu
                    =\begin{bmatrix}
                    1&-5.5&9&-4.5\\
                    0&9&-22.5&13.5\\
                    0&-4.5&18&-13.5\\
                    0&1&-4.5&4.5
                    \end{bmatrix}
                    \begin{bmatrix}1\\u\\u^2\\u^3\end{bmatrix}
                    =\begin{pmatrix}
                    1-5.5u+9u^2-4.5u^3\\[0.5ex]
                    9u-22.5u^2+13.5u^3\\[0.5ex]
                    -4.5u+18u^2-13.5u^3\\[0.5ex]
                    u-4.5u^2+4.5u^3
                    \end{pmatrix}
                    =\begin{pmatrix}b_0(u)\\b_1(u)\\b_2(u)\\b_3(u)\end{pmatrix}"/></p>
                    <p><InlineMath math="
                    p(u)=b(u)^Tp=b_0(u)p_0+b_1(u)p_1+b_2(u)p_2+b_3(u)p_3
                    "/></p>
                    <p><strong>보간법의 한계:&nbsp;</strong>조인트 지점이 부드럽지 않을 수 있다. (미분값이 불연속적일 수 있다.)</p>
                </div>
            </div>
        )
    }else if(curveType === 'hermite'){
        return (
            <div>
                <div className="mb-6">
                    <h1 className="font-bold text-xl mb-4 mt-6">Hermit 곡선</h1>
                    <div className="text-sm ml-2 space-y-4">
                        <p>곡선의 양 끝점과 양 끝점에서의 미분값(접선)을 사용하여 곡선을 정의한다.</p>
                        <p><InlineMath math="p(u)=c_0+c_1u+c_2u^2+c_3u^3"/></p>
                        <p><InlineMath math="p'(u)=c_1+2c_2u+3c_3u^2"/></p>
                        <p><InlineMath math="p=\begin{pmatrix}p_0\\p_0'\\p_2\\p_2'\end{pmatrix}
                        =\begin{pmatrix}p_0\\p_1-p_0\\p_2\\p_3-p_2\end{pmatrix}
                        =\begin{pmatrix}p(0)\\p'(0)\\p(1)\\p'(1)\end{pmatrix}
                        =\begin{pmatrix}
                        c_0\\[0.5ex]
                        c_1\\[0.5ex]
                        c_0+c_1+c_2+c_3\\[0.5ex]
                        c_1+2c_2+3c_3
                        \end{pmatrix}
                        =\begin{bmatrix}1&0&0&0\\0&1&0&0\\1&1&1&1\\0&1&2&3\end{bmatrix}
                        \begin{bmatrix}c_0\\c_1\\c_2\\c_3\end{bmatrix}
                        =Ac
                        "/></p>
                        <p><InlineMath math="M_H=A^{-1}=\begin{bmatrix}
                        1&0&0&0\\
                        0&1&0&0\\
                        -3&-2&3&-1\\
                        2&1&-2&1
                        \end{bmatrix}"/></p>
                        <p><InlineMath math="b(u)=M_H^Tu
                        =\begin{bmatrix}
                        1&0&-3&2\\
                        0&1&-2&1\\
                        0&0&3&-2\\
                        0&0&-1&1
                        \end{bmatrix}
                        \begin{bmatrix}1\\u\\u^2\\u^3\end{bmatrix}
                        =\begin{pmatrix}
                        1-3u^2+2u^3\\[0.5ex]
                        u-2u^2+u^3\\[0.5ex]
                        3u^2-2u^3\\[0.5ex]
                        -u^2+u^3
                        \end{pmatrix}
                        =\begin{pmatrix}b_0(u)\\b_1(u)\\b_2(u)\\b_3(u)\end{pmatrix}"/></p>
                        <p><InlineMath math="
                        p(u)=b(u)^Tp=b_0(u)p_0+b_1(u)(p_1-p_0)+b_2(u)p_2+b_3(u)(p_3-p_2)
                        "/></p>
                        <p><strong>Hermit의 한계:&nbsp;</strong>최적의 곡선 미분값을 알지 못하거나, 데이터 점만 있는 경우 표현 불가</p>
                        <p>* 여기선 <InlineMath math="p1, p3"/>를 접선 벡터로 가정</p>
                    </div>
                </div>
            </div>
        )
    }else if(curveType === 'bezier'){
        return (
            <div>
                <div className="mb-6">
                    <h1 className="font-bold text-xl mb-4 mt-6">Bezier 곡선</h1>
                    <div className="text-sm ml-2 space-y-4">
                        <p>4개의 데이터 점 집합을 사용하여 곡선을 정의한다.</p>
                        <p>인접한 점들 사이의 차이를 이용하여 끝점에서의 미분값을 근사한다.</p>
                        <p><InlineMath math="p(u)=c_0+c_1u+c_2u^2+c_3u^3"/></p>
                        <p><InlineMath math="p'(u)=c_1+2c_2u+3c_3u^2"/></p>
                        <div>
                            <p className="mt-6 mb-2"><strong>미분 추정:</strong></p>
                            <p><InlineMath math="p'(0)=3(p_1-p_0)=c_1"/></p>
                            <p><InlineMath math="p'(1)=3(p_3-p_2)=c_1+2c_2+3c_3"/></p>
                        </div>
                        <div className="flex justify-start items-start gap-20 mt-4 bg-gray-50 p-4 rounded-lg">
                            <div className="space-y-2">
                                <p><strong>[ <InlineMath math="p_1"/> 유도 ]</strong></p>
                                <p><InlineMath math="3(p_1-c_0)=c_1"/></p>
                                <p><InlineMath math="p_1-c_0=\cfrac{1}{3}\:c_1"/></p>
                                <p><InlineMath math="p_1=c_0+\cfrac{1}{3}\:c_1"/></p>
                            </div>
                            <div className="space-y-2">
                                <p><strong>[ <InlineMath math="p_2"/> 유도 ]</strong></p>
                                <p><InlineMath math="3(c_0+c_1+c_2+c_3-p_2)=c_1+2c_2+3c_3"/></p>
                                <p><InlineMath math="c_0+c_1+c_2+c_3-p_2=\cfrac{1}{3}\:c_1+\cfrac{2}{3}\:c_2+c_3"/></p>
                                <p><InlineMath math="p_2=c_0+\cfrac{2}{3}\:c_1+\cfrac{1}{3}\:c_2"/></p>
                            </div>
                        </div>

                        <p><InlineMath math="p=\begin{pmatrix}p_0\\p_1\\p_2\\p_3\end{pmatrix}
                        =\begin{pmatrix}
                        c_0\\[0.8ex]
                        c_0+\cfrac{1}{3}\:c_1\\[0.8ex]
                        c_0+\cfrac{2}{3}\:c_1+\cfrac{1}{3}\:c_2\\[0.8ex]
                        c_0+c_1+c_2+c_3
                        \end{pmatrix}
                        =\begin{bmatrix}1&0&0&0\\1&1/3&0&0\\1&2/3&1/3&0\\1&1&1&1\end{bmatrix}
                        \begin{bmatrix}c_0\\c_1\\c_2\\c_3\end{bmatrix}
                        =Ac
                        "/></p>
                        <p><InlineMath math="M_B=A^{-1}=\begin{bmatrix}
                        1&0&0&0\\
                        -3&3&0&0\\
                        3&-6&3&0\\
                        -1&3&-3&1
                        \end{bmatrix}"/></p>
                        <p><InlineMath math="b(u)=M_B^Tu
                        =\begin{bmatrix}
                        1&-3&3&-1\\
                        0&3&-6&3\\
                        0&0&3&-3\\
                        0&0&0&1
                        \end{bmatrix}
                        \begin{bmatrix}1\\u\\u^2\\u^3\end{bmatrix}
                        =\begin{pmatrix}
                        1-3u+3u^2-1u^3\\[0.5ex]
                        3u+-6u^2+3u^3\\[0.5ex]
                        3u^2-3u^3\\[0.5ex]
                        u^3
                        \end{pmatrix}
                        =\begin{pmatrix}
                        (1-u)^3\\[0.5ex]
                        3u(1-u)^2\\[0.5ex]
                        3u^2(1-u)\\[0.5ex]
                        u^3
                        \end{pmatrix}
                        =\begin{pmatrix}b_0(u)\\b_1(u)\\b_2(u)\\b_3(u)\end{pmatrix}"/></p>
                        <p><InlineMath math="
                        p(u)=b(u)^Tp=b_0(u)p_0+b_1(u)p_1+b_2(u)p_2+b_3(u)p_3
                        "/></p>
                    </div>
                </div>
            </div>
        )
    }
}