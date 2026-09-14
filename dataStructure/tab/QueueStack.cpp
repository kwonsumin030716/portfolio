#include "QueueStack.h"

#include <iostream>
#include <ostream>
#include "../Types.h"

QueueStack::QueueStack() {}
QueueStack::~QueueStack() {}

bool QueueStack::init(SDL_Renderer *r) {
    return BaseTab::init(r);
}
void QueueStack::onEnter() {
    SDL_Log("QueueStack 탭 활성화");
}
void QueueStack::onExit() {
    SDL_Log("QueueStack 탭 비활성화");
}

void QueueStack::update() {
}

void QueueStack::render() {
    if (!renderer) return;

    setBackground();

    int currentW = 0;
    int currentH = 0;
    SDL_GetRenderOutputSize(renderer, &currentW, &currentH);
    SDL_FRect screen = {0.0f, 0.0f, static_cast<float>(currentW), static_cast<float>(currentH)};

    writeText(&screen, "queueStack implementing..", BLACK, 32, TextStyle::BOLD, TextAlign::CENTER);
}

void QueueStack::handleEvent(const SDL_Event& e) {

}


