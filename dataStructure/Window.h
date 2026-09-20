//
// Created by kwons on 26. 9. 9..
//

#ifndef PORTFOLIO_WINDOW_H
#define PORTFOLIO_WINDOW_H
#include <SDL3/SDL_render.h>
#include <SDL3/SDL_video.h>

#include "tab/BaseTab.h"
#include "Types.h"
#include "tab/QueueStack.h"

class Window {
private:
    static Window* instance;

    SDL_Window* window = nullptr;
    SDL_Renderer* renderer = nullptr;
    BaseTab* currentTab = nullptr;

    std::string title;
    int width = 800;
    int height = 400;

public:
    BaseTab* queueStack = nullptr;
    BaseTab* tree = nullptr;

    static Window* getInstance();

    Window();
    ~Window();

    bool init();
    void update() const;
    void render() const;
    void handleEvent(const SDL_Event* e) const;
    void setCurrentTab(int index);
};

#endif //PORTFOLIO_WINDOW_H
