#include "app.h"
#include <iostream>
#include <cmath>

App::App() {
    window = nullptr;
    renderer = nullptr;
    isRunning = false;
}

bool App::Initialize() {
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        std::cout << "SDL 초기화 실패: " << SDL_GetError() << std::endl;
        return false;
    }

    window = SDL_CreateWindow("Tree Visualizer (SDL3)", 800, 600, 0);
    if (!window) {
        std::cout << "창 생성 실패: " << SDL_GetError() << std::endl;
        return false;
    }

    renderer = SDL_CreateRenderer(window, NULL);
    if (!renderer) {
        std::cout << "렌더러 생성 실패: " << SDL_GetError() << std::endl;
        return false;
    }

    // 임시 테스트: 엔진이 켜질 때 트리 자료구조에 샘플 데이터 몇 개를 먼저 넣어둡니다.
    tree.Insert(50);
    tree.Insert(30);
    tree.Insert(70);

    isRunning = true;
    return true;
}

void App::Run() {
    SDL_Event e;

    while (isRunning) {
        while (SDL_PollEvent(&e)) {
            if (e.type == SDL_EVENT_QUIT) {
                isRunning = false;
            }
        }

        // 배경색 어두운 회색으로 채우기
        SDL_SetRenderDrawColor(renderer, 30, 30, 30, 255);
        SDL_RenderClear(renderer);

        // 붓 색상을 하얀색으로 변경
        SDL_SetRenderDrawColor(renderer, 255, 255, 255, 255);

        // ❌ [기존 코드 지우기]: DrawCircle(400.0f, 300.0f, 30.0f); 

        // 💡 [새로운 코드 추가]: 트리를 순회하며 모든 노드와 연결 선 그리기 함수 호출
        DrawTree(tree.GetRoot());

        SDL_RenderPresent(renderer);
    }
}

void App::DrawCircle(float centerX, float centerY, float radius) {
    for (int i = 0; i < 360; i++) {
        float angle1 = i * M_PI / 180.0f;
        float angle2 = (i + 1) * M_PI / 180.0f;

        float x1 = centerX + radius * cosf(angle1);
        float y1 = centerY + radius * sinf(angle1);
        float x2 = centerX + radius * cosf(angle2);
        float y2 = centerY + radius * sinf(angle2);

        SDL_RenderLine(renderer, x1, y1, x2, y2);
    }
}

void App::Shutdown() {
    if (renderer) SDL_DestroyRenderer(renderer);
    if (window) SDL_DestroyWindow(window);
    SDL_Quit();
}

// engine/app.cpp 맨 아래에 추가
void App::DrawTree(Node* current) {
    if (current == nullptr) return;

    // 1. 자식 노드가 있다면 부모 노드와 선(간선)으로 먼저 연결합니다.
    SDL_SetRenderDrawColor(renderer, 150, 150, 150, 255); // 선은 살짝 흐린 회색으로
    if (current->left != nullptr) {
        SDL_RenderLine(renderer, current->x, current->y, current->left->x, current->left->y);
    }
    if (current->right != nullptr) {
        SDL_RenderLine(renderer, current->x, current->y, current->right->x, current->right->y);
    }

    // 2. 노드 원 그리기
    SDL_SetRenderDrawColor(renderer, 255, 255, 255, 255); // 원은 하얀색으로
    DrawCircle(current->x, current->y, 25.0f); // 반지름 25짜리 원 생성

    // 3. 재귀적으로 왼쪽, 오른쪽 자식 트리도 똑같이 그립니다.
    DrawTree(current->left);
    DrawTree(current->right);
}

