//
// Created by kwons on 26. 9. 21..
//

#include "Queue.h"

#include <iostream>

#include "../func/WRAP.h"

#include <SDL3/SDL.h>

Queue::Queue() {}
Queue::~Queue() {
    if (font) {
        TTF_CloseFont(font);
    }
}

bool Queue::init(SDL_Renderer* r) {
    renderer = r;
    storage = new std::string[capacity];
    font = TTF_OpenFont("resources/fonts/PretendardGOV-Regular.ttf", 16);

    return true;
}

void Queue::render() {
    SDL_GetRenderOutputSize(renderer, &w, &h);
    x = w*0.3;
    y = h*0.3;

    w *= 0.1;
    h *= 0.4;

    pushX = x;
    pushY = y - h / capacity * 3;

    popX = x;
    popY = y + h + h / capacity * 2;

    drawBox();
    drawNode();

    if (pushing) {
        pushTime += 0.02;
        if (pushTime > 1) {
            pushTime = 0;
            pushing = false;
        }
    }
    if (popping) {
        popTime += 0.02;
        if (popTime > 1) {
            popTime = 0;
            popping = false;
        }
    }

}

void Queue::drawBox() const {
    constexpr int lineWidth = 4;

    SDL_SetRenderDrawColor(renderer, 31, 65, 176, 255);
    const SDL_FRect fill = WRAP::rect(x - lineWidth, y - lineWidth, w + lineWidth * 2, h + lineWidth * 2);
    SDL_RenderFillRect(renderer, &fill);

    SDL_SetRenderDrawColor(renderer, 255, 255, 255, 255);
    const SDL_FRect unfill = WRAP::rect(x,y - lineWidth ,w,h + lineWidth * 2);
    SDL_RenderFillRect(renderer, &unfill);
}

void Queue::drawNode() const {

    SDL_SetRenderDrawColor(renderer, 31, 65, 176, 255);
    for (int i=0;i<size;i++) {
        //박스
        const int posY = y + h * (capacity-i-1) / capacity;
        SDL_FRect nodePos;
        if (popping) {
            const int prevPosY = posY - h / capacity;
            const int yTime = prevPosY + (posY - prevPosY) * popTime;
            nodePos = WRAP::rect(x,yTime,w,h / capacity);
        }else {
            if (pushing && i + 1 == size) {
                const int yTime = pushY + (posY - pushY) * pushTime;
                nodePos = WRAP::rect(x,yTime,w,h / capacity);
            }else {
                nodePos = WRAP::rect(x, posY, w, h / capacity);
            }
        }
        SDL_RenderFillRect(renderer, &nodePos);
        writeText(storage[i], nodePos);
    }

    if (popping) {
        const int posY = y + h * (capacity-1) / capacity;
        const int yTime = posY + (popY - posY) * popTime;
        const SDL_FRect nodePos = WRAP::rect(x,yTime,w,h / capacity);
        SDL_RenderFillRect(renderer, &nodePos);
        writeText(deleting, nodePos);
    }

}

void Queue::writeText(const std::string text, SDL_FRect nodePos) const {
    SDL_Surface* surface = TTF_RenderText_Blended(font, text.c_str(), 0,SDL_Color{255,255, 255,255});
    if (!surface) return;
    float textW = static_cast<float>(surface->w);
    float textH = static_cast<float>(surface->h);

    SDL_Texture* texture = SDL_CreateTextureFromSurface(renderer, surface);
    SDL_DestroySurface(surface);
    if (!texture) return;

    float centerX = nodePos.x + (nodePos.w - textW) / 2.0f;
    float centerY = nodePos.y + (nodePos.h - textH) / 2.0f;

    const SDL_FRect textRect = WRAP::rect(centerX,centerY,textW,textH);
    SDL_RenderTexture(renderer, texture, nullptr, &textRect);
    SDL_DestroyTexture(texture);
}

bool Queue::isFull() const {
    return capacity == size;
}

bool Queue::isEmpty() const {
    return size == 0;
}

void Queue::push(const std::string& text) {
    if (!isFull()) {
        storage[size++] = text;
        pushing = true;
        std::cout << text << std::endl;
    }
}

void Queue::pop() {
    if (!isEmpty()) {
        deleting = storage[0];
        for (int i = 0; i < size; i++) {
            storage[i] = storage[i+1];
        }
        size--;
        popping = true;
        std::cout << "Popping" << std::endl;
    }
}


