#ifndef NODE_H
#define NODE_H

class Node {
public:
    int data;           // 노드가 저장할 숫자 값
    Node* left;         // 왼쪽 자식 노드 포인터
    Node* right;        // 오른쪽 자식 노드 포인터

    // 시각화를 위한 화면 좌표 변수
    float x;            // 현재 화면 X 좌표
    float y;            // 현재 화면 Y 좌표
    float targetX;      // 애니메이션 이동 목표 X 좌표
    float targetY;      // 애니메이션 이동 목표 Y 좌표

    // 생성자 (자바의 생성자와 같습니다)
    Node(int value, float initX, float initY);
};

#endif
