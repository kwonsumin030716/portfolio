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

SDL_Texture* BaseTab::createTextTexture(const std::string& text, SDL_Color color, float* out_w, float* out_h, TTF_Font* font) const {

    if (text.empty() || text.c_str() == nullptr) {
        return nullptr;
    }

    SDL_Surface* surface = TTF_RenderText_Blended(font, text.c_str(), text.length(), color);
    if (!surface) return nullptr;

    *out_w = static_cast<float>(surface->w);
    *out_h = static_cast<float>(surface->h);

    // 표면을 바탕으로 비디오 카드(GPU) 전용 텍스처로 전환
    SDL_Texture* texture = SDL_CreateTextureFromSurface(renderer, surface);
    SDL_DestroySurface(surface); // 역할이 끝난 CPU 데이터 제거

    return texture;
}

