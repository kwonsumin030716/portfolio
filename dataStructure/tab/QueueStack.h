#ifndef QUEUE_STACK_H
#define QUEUE_STACK_H

#include "BaseTab.h"

class QueueStack : public BaseTab {
private:
    std::string inputBuffer = "";
    bool isInputBoxFocused = false;
    int inputX = 50;
    int inputY = 50;
    int inputWidth = 200;
    int inputHeight = 50;
    int buttonWidth = 100;


public:
    explicit QueueStack(SDL_Renderer* target_renderer) : BaseTab(target_renderer) {}
    ~QueueStack() override = default;

    void drawInputBox();
    void drawPushButton();


    bool init(SDL_Renderer *r);
    void onEnter() override;
    void handleEvent(const SDL_Event& e);
    void handleInput(const SDL_Event &e);

    void update() override;
    void render() override;
    void onExit() override;
};

#endif // QUEUE_STACK_H
