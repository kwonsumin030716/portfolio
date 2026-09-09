//
// Created by kwons on 26. 9. 9..
//

#ifndef PORTFOLIO_WINDOW_H
#define PORTFOLIO_WINDOW_H
#include <SDL3/SDL_render.h>
#include <SDL3/SDL_video.h>

#include "tab/BaseTab.h"

class Window {
private:
    SDL_Window* window = nullptr;
    SDL_Renderer* renderer = nullptr;
    bool isRunning = false;

    BaseTab* currentTab = nullptr;
    int width = 800;
    int height = 600;
    const char* title = "Data Structure";

    BaseTab* queueStack = nullptr;

public:
    Window() = default;
    virtual ~Window();

    Window(const Window&) = delete;
    Window& operator=(const Window&) = delete;

    bool init();
    void run();
    void shutdown();

    void changeTab(const char* tabName);
};

#endif //PORTFOLIO_WINDOW_H
