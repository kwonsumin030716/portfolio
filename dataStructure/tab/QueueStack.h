#ifndef QUEUE_STACK_H
#define QUEUE_STACK_H

#include "BaseTab.h"

class QueueStack : public BaseTab {
private:

public:
    QueueStack();
    ~QueueStack() override;


    bool init(SDL_Renderer *r) override;
    void onEnter() override;
    void onExit() override;
    void update() override;
    void render() override;

    void handleEvent(const SDL_Event& e) override;

};

#endif // QUEUE_STACK_H
