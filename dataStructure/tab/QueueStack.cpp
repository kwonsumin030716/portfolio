#include "QueueStack.h"
#include "../Window.h"
#include <iostream>
#include "../Types.h"

QueueStack::QueueStack() {
    queue = new Queue();
}
QueueStack::~QueueStack() {
    if (queue) delete queue;
}

bool QueueStack::init(SDL_Renderer *r) {
    BaseTab::init(r);

    queue->init(renderer);

    return true;
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

    int w = 0;
    int h = 0;
    SDL_GetRenderOutputSize(renderer, &w, &h);

    queue->render();


    //
    // SDL_FRect screen = {0.0f, 0.0f, static_cast<float>(w), static_cast<float>(h)};
    // writeText(&screen, "queueStack implementing..", BLACK, 32, TextStyle::BOLD, TextAlign::CENTER);
}

void QueueStack::handleEvent(const SDL_Event& e) {

}

void QueueStack::push(char* text) const {
    queue->push(text);
}

void QueueStack::pop() const{
    queue->pop();
}


extern "C" {
    void queueStackPush(char *text) {
        Window* window = Window::getInstance();
        QueueStack* queueStack = static_cast<QueueStack*>(window->queueStack);
        queueStack->push(text);
    }

    void queueStackPop() {
        Window* window = Window::getInstance();
        QueueStack* queueStack = static_cast<QueueStack*>(window->queueStack);
        queueStack->pop();
    }
}

