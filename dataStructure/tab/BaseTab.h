//
// Created by kwons on 26. 9. 9..
//

#ifndef BASETAB_H
#define BASETAB_H
#define SDL_MAIN_HANDLED

#include <string>
#include <SDL3/SDL.h>
#include <SDL3_ttf/SDL_ttf.h>

class BaseTab {
protected:
    SDL_Renderer *renderer = nullptr;
    TTF_Font* fontRegular = nullptr;
    const SDL_Color blue = {31, 65, 176, 255};
    const SDL_Color white = {255, 255, 255, 255};
    const SDL_Color black = {0, 0, 0, 255};

public:
    virtual ~BaseTab() = default;
    BaseTab() = delete;

    BaseTab(const BaseTab&) = delete;
    BaseTab& operator=(const BaseTab&) = delete;

    explicit BaseTab(SDL_Renderer* target_renderer);

    void setBackground() const;
    SDL_Texture* createTextTexture(const std::string& text, SDL_Color color, float* out_w, float* out_h, TTF_Font* font) const;

    virtual void clear(){}
    virtual void onEnter() {}
    virtual void handleEvent(const SDL_Event& event) {}
    virtual void update() {}
    virtual void render() {}
    virtual void onExit() {}
};

#endif // BASETAB_H
