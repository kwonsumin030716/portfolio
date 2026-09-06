#include "bst.h"
#include <iostream>

BST::BST() {
    root = nullptr;
}

void BST::Insert(int value) {
    // 최초의 루트 노드는 화면 위쪽 중앙(X: 400, Y: 100) 근처에 생성되도록 기본 좌표를 넘깁니다.
    root = InsertInternal(root, value, 400.0f, 100.0f);
}

// 자료구조 수업 때 배운 크기 비교 기반 재귀 삽입 로직
Node* BST::InsertInternal(Node* current, int value, float x, float y) {
    if (current == nullptr) {
        return new Node(value, x, y); // C++ 객체 동적 할당
    }

    if (value < current->data) {
        // 왼쪽 자식은 부모보다 약간 왼쪽 아래(X는 -80, Y는 +80)에 배치
        current->left = InsertInternal(current->left, value, x - 80.0f, y + 80.0f);
    }
    else if (value > current->data) {
        // 오른쪽 자식은 부모보다 약간 오른쪽 아래(X는 +80, Y는 +80)에 배치
        current->right = InsertInternal(current->right, value, x + 80.0f, y + 80.0f);
    }

    return current;
}

void BST::Inorder() {
    InorderInternal(root);
    std::cout << std::endl;
}

void BST::InorderInternal(Node* current) {
    if (current != nullptr) {
        InorderInternal(current->left);
        std::cout << current->data << " ";
        InorderInternal(current->right);
    }
}

Node* BST::GetRoot() {
    return root;
}
