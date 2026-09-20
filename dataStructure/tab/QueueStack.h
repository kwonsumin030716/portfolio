#ifndef QUEUE_STACK_H
#define QUEUE_STACK_H

#include "BaseTab.h"

class QueueStack : public BaseTab {
private:
    char** queue = nullptr;
    char** stack = nullptr;
    int capacity = 4;
    int size = 0;

    void resize();

public:
    QueueStack();
    ~QueueStack() override;


    bool init(SDL_Renderer *r) override;
    void onEnter() override;
    void onExit() override;
    void update() override;
    void render() override;

    void handleEvent(const SDL_Event& e) override;

    void push(char* text);
    char* pop();

};

#endif // QUEUE_STACK_H
