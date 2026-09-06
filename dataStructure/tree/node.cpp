#include "node.h"

Node::Node(int value, float initX, float initY) {
    data = value;
    left = nullptr;   // 자바의 null과 같습니다.
    right = nullptr;

    // 처음 생성될 때 현재 위치와 목표 위치를 같게 설정합니다.
    x = initX;
    y = initY;
    targetX = initX;
    targetY = initY;
}
