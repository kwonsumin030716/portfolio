#ifndef QUEUE_STACK_H
#define QUEUE_STACK_H

#include "BaseTab.h"

class QueueStack : public BaseTab {
private:
    std::string inputBuffer = "";
    bool isInputBoxFocused = false;


public:
    explicit QueueStack(SDL_Renderer* target_renderer) : BaseTab(target_renderer) {}
    ~QueueStack() override = default;

    void drawInputBox();


    bool init(SDL_Renderer *r);
    void onEnter() override;
    void handleEvent(const SDL_Event& e);
    void update() override;
    void render() override;
    void onExit() override;
};

#endif // QUEUE_STACK_H
