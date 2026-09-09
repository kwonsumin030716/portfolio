//
// Created by kwons on 26. 9. 9..
//

#include "BaseTab.h"

#include <iostream>
#include <ostream>

BaseTab::BaseTab(SDL_Renderer* target_renderer)
    : renderer(target_renderer)
{

    if (!TTF_Init()) {
        std::cerr << "TTF 초기화 실패: " << SDL_GetError() << "\n";
    }

    fontRegular = TTF_OpenFont("../resources/fonts/Geist-Regular.ttf", 24);

    if (!fontRegular) {
        std::cerr << "failed to load font: " << SDL_GetError() << "\n";
    }

}

void BaseTab::setBackground() const {
    int current_w = 0;
    int current_h = 0;
    SDL_GetRenderOutputSize(renderer, &current_w, &current_h);

    float w = static_cast<float>(current_w);
    float h = static_cast<float>(current_h);

    SDL_SetRenderDrawColor(renderer, 255, 255, 255, 255);
    SDL_FRect screen_rect = { 0.0f, 0.0f, w, h };
    SDL_RenderFillRect(renderer, &screen_rect);
}

void BaseTab::writeText(const std::string& text, SDL_Color color, TTF_Font* font, int x, int y) const {
    std::string textToRender = text.empty() ? " " : text;

    if (text.empty() || text.c_str() == nullptr) {
        return;
    }

    SDL_Surface* surface = TTF_RenderText_Blended(font, text.c_str(), text.length(), color);
    if (!surface) return;

    float width = static_cast<float>(surface->w);
    float height = static_cast<float>(surface->h);

    // 표면을 바탕으로 비디오 카드(GPU) 전용 텍스처로 전환
    SDL_Texture* texture = SDL_CreateTextureFromSurface(renderer, surface);
    SDL_DestroySurface(surface); // 역할이 끝난 CPU 데이터 제거

    SDL_FRect textSize = {
        (float)x,
        (float)y,
        width,
        height
    };
    SDL_RenderTexture(renderer, texture, NULL, &textSize);
    SDL_DestroyTexture(texture);
}

