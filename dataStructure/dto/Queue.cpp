//
// Created by kwons on 26. 9. 21..
//

#include "Queue.h"

#include <iostream>

#include "../func/WRAP.h"

#include <SDL3/SDL.h>

Queue::Queue() {}
Queue::~Queue() {}

bool Queue::init(SDL_Renderer* r) {
    renderer = r;
    storage = new char[capacity];


    return true;
}

void Queue::render() {
    SDL_GetRenderOutputSize(renderer, &w, &h);
    x = w*0.3;
    y = h*0.3;

    pushX = w * 0.3;
    pushY = h * 0.2;

    popX = w * 0.3;
    popY = h * 0.8;

    w *= 0.1;
    h *= 0.4;


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

void Queue::drawBox() {

    const int lineWidth = 2;

    SDL_SetRenderDrawColor(renderer, 31, 65, 176, 255);
    const SDL_FRect fill = WRAP::rect(x - lineWidth, y - lineWidth, w + lineWidth * 2, h + lineWidth * 2);
    SDL_RenderFillRect(renderer, &fill);

    SDL_SetRenderDrawColor(renderer, 255, 255, 255, 255);
    const SDL_FRect unfill = WRAP::rect(x,y - lineWidth ,w,h + lineWidth * 2);
    SDL_RenderFillRect(renderer, &unfill);
}

void Queue::drawNode() {

    SDL_SetRenderDrawColor(renderer, 31, 65, 176, 255);
    for (int i=0;i<size;i++) {
        int posY = y + h * (capacity-i-1) / capacity;
        SDL_FRect nodePos;
        if (popping) {
            //영향 없는 애들 한 칸씩 내리기
            int prevPosY = posY - h / capacity;
            int yTime = prevPosY + (posY - prevPosY) * popTime;
            nodePos = WRAP::rect(x,yTime,w,h / capacity);
        }else {
            if (pushing && i + 1 == size) {
                int yTime = pushY + (posY - pushY) * pushTime;
                nodePos = WRAP::rect(x,yTime,w,h / capacity);
            }else {
                nodePos = WRAP::rect(x, posY, w, h / capacity);
            }
        }
        SDL_RenderFillRect(renderer, &nodePos);

        //deleting 움직임 구현
        int posY = y + h * (capacity-1) / capacity;
        int yTime = posY + (popY - posY) * popTime;
        SDL_FRect nodePos = WRAP::rect(x,yTime,w,h / capacity);
        SDL_RenderFillRect(renderer, &nodePos);


    }
}

bool Queue::isFull() {
    return capacity == size;
}

bool Queue::isEmpty() {
    return size == 0;
}

void Queue::push(char* text) {
    if (!isFull()) {
        storage[size++] = *text;
        pushing = true;
        std::cout << text << std::endl;
    }
}

void Queue::pop() {
    if (!isEmpty()) {
        *deleting = storage[0];
        for (int i = 0; i < size; i++) {
            storage[i] = storage[i+1];
        }
        size--;
        popping = true;
        std::cout << "Popping" << std::endl;
    }
}


