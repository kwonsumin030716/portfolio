#define SDL_MAIN_HANDLED 1
#include <SDL3/SDL.h>
#include <SDL3/SDL_main.h>
#include "Window.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

Window* g_window = nullptr;
bool isInitialized = false;

void WASMLoop() {
    if (g_window) {
        SDL_Event event;
        while (SDL_PollEvent(&event)) {
            g_window->handleEvent(&event);
            if (event.type == SDL_EVENT_QUIT) {
                #ifdef __EMSCRIPTEN__
                emscripten_cancel_main_loop();
                #endif
                return;
            }
        }
        g_window->update();
        g_window->render();
    }
}

int main(int argc, char* argv[]) {
    SDL_SetMainReady();
    if (isInitialized && g_window != nullptr) {
        SDL_Log("WASM SDL3 인스턴스 존재");

        #ifdef __EMSCRIPTEN__
                emscripten_exit_with_live_runtime();
        #endif
                return 0;
    }

    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("SDL 초기화 실패: %s", SDL_GetError());
        return -1;
    }

    g_window = new Window();
    if (!g_window->init()) {
        SDL_Log("윈도우 창 및 렌더러 생성 실패");
        delete g_window;
        g_window = nullptr;
        return -1;
    }

    SDL_Log("WASM SDL3 프로그램 초기화 완료");
    isInitialized = true;

    #ifdef __EMSCRIPTEN__
        emscripten_set_main_loop(WASMLoop, 0, 0);
        emscripten_exit_with_live_runtime();
    #endif

    return 0;
}
