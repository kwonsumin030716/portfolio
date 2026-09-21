

#ifndef PORTFOLIO_QUEUE_H
#define PORTFOLIO_QUEUE_H
#include <SDL3/SDL_render.h>


class Queue {

private:
    SDL_Renderer* renderer = nullptr;
    char* storage = nullptr;
    char* deleting = nullptr;

    int size = 0;
    int capacity = 6;

    int w = 0;
    int h = 0;

    int x = 0;
    int y = 0;

    int pushX = 0;
    int pushY = 0;
    int popX = 0;
    int popY = 0;

    bool pushing = false;
    bool popping = false;


    double pushTime = 0.0;
    double popTime = 0.0;




public:

    Queue();
    ~Queue();

    bool init(SDL_Renderer* r);
    void render();

    void drawBox();
    void drawNode();

    bool isFull();
    bool isEmpty();

    void push(char* text);
    void pop();
};


#endif //PORTFOLIO_QUEUE_H
