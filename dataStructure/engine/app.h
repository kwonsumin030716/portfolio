#ifndef APP_H
#define APP_H

#include <SDL3/SDL.h>
#include "../tree/bst.h" // 🌲 트리 자료구조를 가져와 멤버로 둡니다.

class App {
private:
    SDL_Window* window;
    SDL_Renderer* renderer;
    bool isRunning;

    BST tree; // 🌲 이 비디오 엔진이 제어할 트리 객체

    // 원을 그리는 내부 그래픽 함수
    void DrawCircle(float centerX, float centerY, float radius);
    // engine/app.h 파일의 private: 영역 내부
    void DrawTree(Node* current);


public:
    App(); // 생성자
    bool Initialize(); // 창 띄우고 초기화
    void Run();        // 매 프레임 돌아가는 무한 루프
    void Shutdown();   // 메모리 해제 및 종료
};

#endif
