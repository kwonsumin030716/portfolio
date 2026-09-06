#include <SDL3/SDL.h>
#include <iostream>

int main(int argc, char* argv[]) {
    // SDL3 초기화 (비디오 시스템)
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        std::cout << "SDL 초기화 실패: " << SDL_GetError() << std::endl;
        return -1;
    }

    // SDL3 방식의 창 생성
    SDL_Window* window = SDL_CreateWindow("Tree Visualizer (SDL3)", 800, 600, 0);

    if (!window) {
        std::cout << "창 생성 실패: " << SDL_GetError() << std::endl;
        SDL_Quit();
        return -1;
    }

    bool quit = false;
    SDL_Event e;

    // 프로그램 유지 무한 루프
    while (!quit) {
        while (SDL_PollEvent(&e)) {
            // X 버튼을 누르면 종료
            if (e.type == SDL_EVENT_QUIT) {
                quit = true;
            }
        }
    }

    // 메모리 해제 및 종료
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}
