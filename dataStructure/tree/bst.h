#ifndef BST_H
#define BST_H

#include "node.h"

class BST {
private:
    Node* root; // 트리의 루트 노드 포인터

    // 내부적으로 사용할 재귀(Recursive) 함수들
    Node* InsertInternal(Node* current, int value, float x, float y);
    void InorderInternal(Node* current);

public:
    BST(); // 생성자
    void Insert(int value); // 외부에서 값을 삽입할 때 부르는 함수
    void Inorder();        // 콘솔창 테스트용 중위 순회 함수
    Node* GetRoot();       // 그래픽 엔진이 루트 노드를 가져갈 수 있게 해주는 함수
};

#endif
