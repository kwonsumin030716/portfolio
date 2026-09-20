#include "QueueStack.h"
#include "../Window.h"
#include <iostream>
#include "../Types.h"

QueueStack::QueueStack() {}
QueueStack::~QueueStack() {}

bool QueueStack::init(SDL_Renderer *r) {
    return BaseTab::init(r);

    queue = new char*[capacity];
    stack = new char*[capacity];
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

void QueueStack::resize() {
    int oldCapacity = capacity;
    capacity *= 2;

    char** newQueue = new char*[capacity];
    char** newStack = new char*[capacity];

    for (int i = 0; i < oldCapacity; i++) {
        newQueue[i] = queue[i];
        newStack[i] = stack[i];
    }

    delete[] queue;
    delete[] stack;

    queue = newQueue;
    stack = newStack;
}

void QueueStack::push(char* text) {
    if (size == capacity) {
        resize();
    }
    queue[size] = text;
    stack[size] = text;
    size++;
}

char* QueueStack::pop() {
    if (size == 0) return "";

    for (int i=0; i<size-1; i++) {
        queue[i] = queue[i+1];
    }
    stack[--size] = "";


}

extern "C" {
    void  queueStackPush(char *text) {
        Window* window = Window::getInstance();
        QueueStack* queueStack = static_cast<QueueStack*>(window->queueStack);
        queueStack->push(text);
    }
}

