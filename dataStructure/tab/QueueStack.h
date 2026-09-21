#ifndef QUEUE_STACK_H
#define QUEUE_STACK_H

#include "BaseTab.h"
#include "../dto/Queue.h"

class QueueStack : public BaseTab {
private:
    Queue* queue = nullptr;
    char** stack = nullptr;
public:
    QueueStack();
    ~QueueStack() override;


    bool init(SDL_Renderer *r) override;
    void onEnter() override;
    void onExit() override;
    void update() override;
    void render() override;

    void handleEvent(const SDL_Event& e) override;

    void push(char* text) const;
    void pop() const;

};

#endif // QUEUE_STACK_H
