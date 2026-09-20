#include "Window.h"

#include <SDL3/SDL.h>
#include <SDL3/SDL_main.h>
#include <string>

#include "tab/QueueStack.h"
#include "tab/Tree.h"


Window* Window::instance = nullptr;
Window *Window::getInstance() {
    return instance;
}

Window::Window() : window(nullptr), renderer(nullptr), currentTab(nullptr) {
    instance = this;
}
Window::~Window() {
    if (currentTab) {
        currentTab->onExit();
        delete currentTab;
    }
    if (renderer) {
        SDL_DestroyRenderer(renderer);
    }
    if (window) {
        SDL_DestroyWindow(window);
    }
    if (instance == this) {
        instance = nullptr;
    }
    SDL_Log("WASM Window 자원 해제 완료");
}

bool Window::init() {
    window = SDL_CreateWindow(title.c_str(), width, height, SDL_WINDOW_OPENGL);
    if (!window) {
        SDL_Log("WASM Window 생성 실패: %s", SDL_GetError());
        return false;
    }

    renderer = SDL_CreateRenderer(window, nullptr);
    if (!renderer) {
        SDL_Log("WASM Renderer 생성 실패: %s", SDL_GetError());
        return false;
    }
    queueStack = new QueueStack();
    tree = new Tree();
    currentTab = queueStack;

    if (currentTab) {
        currentTab->init(renderer);
        currentTab->onEnter();
    }
    return true;
}

void Window::update() const {
    if (currentTab) {
        currentTab->update();
    }
}

void Window::render() const {
    if (!renderer) return;

    SDL_SetRenderDrawColor(renderer, 0,0,0,255);
    SDL_RenderClear(renderer);

    if (currentTab) {
        currentTab->render();
    }

    SDL_RenderPresent(renderer);
}

void Window::handleEvent(const SDL_Event *e) const {
    if (currentTab && e) {
        currentTab->handleEvent(*e);
    }
}

void Window::setCurrentTab(int index) {
    if (currentTab) {
        currentTab->onExit();
    }

    switch (index) {
        case 0:
            if (!queueStack) queueStack = new QueueStack();
            currentTab = queueStack;
            break;
        case 1:
            // if (!listTab) listTab = new ListTab();
            // currentTab = listTab;
            SDL_Log("WASM C++: List 전환 수신 양호");
            break;
        case 2:
            if (!tree) tree = new Tree();
            currentTab = tree;
            SDL_Log("WASM C++: Tree 전환 수신 양호");
            break;
        case 3:
            // if (!hashtableTab) hashtableTab = new HashtableTab();
            // currentTab = hashtableTab;
            SDL_Log("WASM C++: HashTable 전환 수신 양호");
            break;
        case 4:
            // if (!priorityTab) priorityTab = new PriorityTab();
            // currentTab = priorityTab;
            SDL_Log("WASM C++: Priority 전환 수신 양호");
            break;
        default:
            currentTab = queueStack; // 예외 발생 시 기본값으로 복귀
            break;
    }

    if (currentTab && renderer) {
        currentTab->init(renderer);
        currentTab->onEnter();
    }

    SDL_Log("🟢 C++ 탭 전환 완료 (Index: %d)", index);
}

extern "C" {
    void changeTab(int tabIndex) {
        setCurrentTab(tabIndex);
        SDL_Log("C++ 내부 탭 변경 함수 실행 성공: %d", tabIndex);
    }
}

