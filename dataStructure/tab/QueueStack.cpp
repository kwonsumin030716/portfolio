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
    //박스
    SDL_FRect inputBoxSize = { inputX, inputY, inputWidth, inputHeight };
    SDL_SetRenderDrawBlendMode(renderer, SDL_BLENDMODE_BLEND);
    SDL_SetRenderDrawColor(renderer, blue.r, blue.g, blue.b, 50);
    SDL_RenderFillRect(renderer, &inputBoxSize);

    SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
    SDL_RenderRect(renderer, &inputBoxSize);

    //텍스트
    writeText(inputBuffer, black, fontRegular, inputX+10, inputY+10);

    drawPushButton();
}

void QueueStack::drawPushButton() {
    SDL_FRect buttonSize = {inputX + inputWidth + 10, inputY, buttonWidth, inputHeight};
    SDL_SetRenderDrawColor(renderer, blue.r, blue.g, blue.b, 255);
    SDL_RenderFillRect(renderer, &buttonSize);
    writeText("PUSH", white, fontRegular, inputX+inputWidth+25, inputY+10);


}

void QueueStack::handleEvent(const SDL_Event& e) {
    handleInput(e);
}

void QueueStack::handleInput(const SDL_Event& e) {
    if (e.type == SDL_EVENT_MOUSE_BUTTON_DOWN) {
        float mouseX = e.button.x;
        float mouseY = e.button.y;
        SDL_Window* currentWindow = SDL_GetWindowFromID(e.button.windowID);

        if (mouseX >= inputX && mouseX <= (inputX+inputWidth) && mouseY >= inputY && mouseY <= (inputY+inputHeight)) {
            isInputBoxFocused = true;
            SDL_StartTextInput(currentWindow);
            std::cout << "인" << std::endl;
        } else {
            isInputBoxFocused = false;
            SDL_StopTextInput(currentWindow);
            std::cout << "아웃" << std::endl;
        }
    }else if (isInputBoxFocused) {
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
