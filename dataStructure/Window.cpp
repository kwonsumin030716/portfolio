//
// Created by kwons on 26. 9. 9..
//

#include "Window.h"

#include <string>
#include <SDL3/SDL.h>
#include <SDL3/SDL_main.h>
#include <iostream>

#include "tab/QueueStack.h"

Window::~Window() {
    shutdown();
}

bool Window::init() {
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("SDL 비디오 초기화 실패: %s", SDL_GetError());
        return false;
    }

    window = SDL_CreateWindow(title, width, height,SDL_WINDOW_RESIZABLE);
    if (!window) {
        SDL_Log("창 생성 실패: %s", SDL_GetError());
        return false;
    }
    renderer = SDL_CreateRenderer(window, nullptr);
    if (!renderer) {
        SDL_Log("렌더러 생성 실패: %s", SDL_GetError());
        return false;
    }



    isRunning = true;
    queueStack = new QueueStack(renderer);
    changeTab("queueStack");
    return true;
}

void Window::run() {
    SDL_Event e;

    while (isRunning) {
        while (SDL_PollEvent(&e)) {
            if (e.type == SDL_EVENT_QUIT) {
                isRunning = false;
            }
            currentTab->handleEvent(e);
        }

        currentTab->update();

        SDL_SetRenderDrawColor(renderer, 31, 65, 176, 255);
        SDL_RenderClear(renderer);

        currentTab->render();

        SDL_RenderPresent(renderer);
        SDL_Delay(16);
    }

    currentTab->onExit();
}

void Window::shutdown() {
    if (renderer) {
        SDL_DestroyRenderer(renderer);
        renderer = nullptr;
    }
    if (window) {
        SDL_DestroyWindow(window);
        window = nullptr;
    }
    if (isRunning) {
        SDL_Quit();
        isRunning = false;
    }
}

void Window::changeTab(const char *tabName) {


    std::string tab(tabName);
    if (tabName ==  "queueStack") {
        currentTab = queueStack;
        queueStack->onEnter();
    }
}

