//
// Created by kwons on 26. 9. 9..
//

#include "BaseTab.h"
#include <SDL3/SDL.h>
#include <SDL3_ttf/SDL_ttf.h>

#include <iostream>
#include <ostream>

BaseTab::BaseTab() : renderer{nullptr} {}
BaseTab::~BaseTab() {}

bool BaseTab::init(SDL_Renderer* r) {
    renderer = r;

    if (!TTF_WasInit() && !TTF_Init()) {
        SDL_Log("SDL_TTF 라이브러리 초기화 실패: %s", SDL_GetError());
        return false;
    }

    return true;
}

void BaseTab::setBackground() const {
    if (!renderer) return;

    //w, h 불러오기
    int current_w = 0;
    int current_h = 0;
    SDL_GetRenderOutputSize(renderer, &current_w, &current_h);

    SDL_FRect screen_rect = { 0.0f, 0.0f, static_cast<float>(current_w), static_cast<float>(current_h) };
    SDL_SetRenderDrawColor(renderer, 255, 255, 255, 255);
    SDL_RenderFillRect(renderer, &screen_rect);
}

void BaseTab::writeText(SDL_FRect* rect, const std::string& text, SDL_Color color, int size, TextStyle s, TextAlign a) const {
    if (text.empty() || text.c_str() == nullptr) {
        return;
    }

    if (!TTF_WasInit() && !TTF_Init()) {
        SDL_Log("SDL_TTF Font 초기화 실패: %s", SDL_GetError());
        return;
    }

    TTF_Font* font;
    if (s == TextStyle::BOLD) {
        font = TTF_OpenFont("resources/fonts/Geist-Bold.ttf", static_cast<float>(size));
    }else {
        font = TTF_OpenFont("resources/fonts/Geist-Regular.ttf", static_cast<float>(size));
    }

    if (!font) {
        SDL_Log("SDL_TTF 폰트 로드 실패: %s", SDL_GetError());
        return;
    }


    SDL_Surface* surface = TTF_RenderText_Blended(font, text.c_str(), text.length(), color);
    if (!surface) {
        TTF_CloseFont(font);
        return;
    }

    float width = static_cast<float>(surface->w);
    float height = static_cast<float>(surface->h);

    SDL_Texture* texture = SDL_CreateTextureFromSurface(renderer, surface);
    SDL_DestroySurface(surface);

    float finalX = rect->x;
    float finalY = rect->y + (rect->h - height) / 2.0f;

    if (a == TextAlign::CENTER) {
        finalX = rect->x + (rect->w - width) / 2.0f;
    } else if (a == TextAlign::RIGHT) {
        finalX = rect->x + rect->w - width;
    }

    const SDL_FRect textSize = {
        .x = finalX,
        .y = finalY,
        .w = width,
        .h = height
    };
    SDL_RenderTexture(renderer, texture, nullptr, &textSize);
    SDL_DestroyTexture(texture);
    TTF_CloseFont(font);
}

