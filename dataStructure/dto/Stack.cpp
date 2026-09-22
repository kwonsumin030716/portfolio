//
// Created by kwons on 26. 9. 22..
//

#include "Stack.h"
#include "../func/WRAP.h"

Stack::Stack() {}
Stack::~Stack() {
    if (font) {
        TTF_CloseFont(font);
    }
}

bool Stack::init(SDL_Renderer* r) {
    renderer = r;
    storage = new std::string[capacity];
    font = TTF_OpenFont("resources/fonts/PretendardGOV-Regular.ttf", 16);

    return true;
}

void Stack::render() {
    SDL_GetRenderOutputSize(renderer, &w, &h);
    x = w * 0.6;
    y = h * 0.3;

    w *= 0.1;
    h *= 0.4;

    pushX = x;
    pushY = y - h / capacity * 3;

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

void Stack::drawBox() const {
    constexpr int lineWidth = 4;

    SDL_SetRenderDrawColor(renderer, 31, 65, 176, 255);
    const SDL_FRect fill = WRAP::rect(x - lineWidth, y - lineWidth, w + lineWidth * 2, h + lineWidth * 2);
    SDL_RenderFillRect(renderer, &fill);

    SDL_SetRenderDrawColor(renderer, 255, 255, 255, 255);
    const SDL_FRect unfill = WRAP::rect(x,y - lineWidth ,w,h + lineWidth * 2);
    SDL_RenderFillRect(renderer, &unfill);
}

void Stack::drawNode() const {

    SDL_SetRenderDrawColor(renderer, 31, 65, 176, 255);
    for (int i=0;i<size;i++) {
        //박스
        const int posY = y + h * (capacity-i-1) / capacity;
        SDL_FRect nodePos;

        if (pushing && i + 1 == size) {
            const int yTime = pushY + (posY - pushY) * pushTime;
            nodePos = WRAP::rect(x,yTime,w,h / capacity);
        }else {
            nodePos = WRAP::rect(x, posY, w, h / capacity);
        }

        SDL_RenderFillRect(renderer, &nodePos);
        writeText(storage[i], nodePos);
    }
    if (popping) {
        const int posY = y + h * (capacity-size+1) / capacity;
        const int yTime = posY + (posY - pushY) * popTime;
        const SDL_FRect nodePos = WRAP::rect(x,yTime,w,h / capacity);
        SDL_RenderFillRect(renderer, &nodePos);
        writeText(deleting, nodePos);
    }
}