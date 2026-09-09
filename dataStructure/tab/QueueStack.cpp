#include "QueueStack.h"

#include <iostream>
#include <ostream>

bool QueueStack::init(SDL_Renderer *r) {
    renderer = r;
    return true;
}

void QueueStack::onEnter() {
    SDL_Log("QueueStack 전환 완료");
    SDL_StartTextInput(SDL_GetRenderWindow(renderer));
    render();
}

void QueueStack::update() {
}

void QueueStack::render() {

    setBackground();
    drawInputBox();


}

void QueueStack::drawInputBox() {
    SDL_FRect inputBoxSize = { 50.0f, 50.0f, 200.0f, 50.0f };
    SDL_SetRenderDrawBlendMode(renderer, SDL_BLENDMODE_BLEND);
    SDL_SetRenderDrawColor(renderer, blue.r, blue.g, blue.b, 50);
    SDL_RenderFillRect(renderer, &inputBoxSize);

    SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
    SDL_RenderRect(renderer, &inputBoxSize);
}

void QueueStack::handleEvent(const SDL_Event& e) {
    if (e.type == SDL_EVENT_TEXT_INPUT) {
        inputBuffer += e.text.text;
    }else if (e.type == SDL_EVENT_KEY_DOWN) {
        if (e.key.key == SDLK_BACKSPACE && !inputBuffer.empty()) {
            inputBuffer.pop_back();
        }else if (e.key.key == SDLK_RETURN && !inputBuffer.empty()) {
            std::string finalData = inputBuffer;
            std::cout << "입력: " << finalData << std::endl;
            inputBuffer = "";
        }
    }else if (e.type == SDL_EVENT_MOUSE_BUTTON_DOWN) {
        float mouseX = e.button.x;
        float mouseY = e.button.y;

        // 회색 박스 영역 (x: 50, y: 50, 가로: 200, 세로: 50)
        if (mouseX >= 50.0f && mouseX <= 250.0f && mouseY >= 50.0f && mouseY <= 100.0f) {
            isInputBoxFocused = true;  // 박스 내부를 누르면 타이핑 허용!
        } else {
            isInputBoxFocused = false; // 바깥 다른 곳을 누르면 타이핑 차단!
        }
    }

    // 2. 글자 입력 구역 제어 (스위치가 켜져있을 때만 누적)
    else if (e.type == SDL_EVENT_TEXT_INPUT) {
        if (isInputBoxFocused) { // 💡 박스가 선택된 상태일 때만 글자를 버퍼에 더합니다.
            inputBuffer += e.text.text;
        }
    }
}

void QueueStack::onExit() {
    SDL_Log("QueueStack 종료");

    if (fontRegular) {
        TTF_CloseFont(fontRegular);
        fontRegular = nullptr;
    }
    TTF_Quit();
}
