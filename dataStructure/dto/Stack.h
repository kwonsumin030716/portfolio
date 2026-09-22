//
// Created by kwons on 26. 9. 22..
//

#ifndef PORTFOLIO_STACK_H
#define PORTFOLIO_STACK_H
#include <string>
#include <SDL3/SDL_render.h>
#include <SDL3_ttf/SDL_ttf.h>


class Stack {

private:
    SDL_Renderer* renderer = nullptr;
    TTF_Font* font = nullptr;
    std::string* storage = nullptr;
    std::string deleting = "";

    int size = 0;
    int capacity = 6;

    int w = 0;
    int h = 0;

    int x = 0;
    int y = 0;

    int pushX = 0;
    int pushY = 0;

    bool pushing = false;
    bool popping = false;

    double pushTime = 0.0;
    double popTime = 0.0;

public:
    Stack();
    ~Stack();

    bool init(SDL_Renderer* r);
    void render();

    void drawBox() const;
    void drawNode() const;
    void writeText(const std::string text, SDL_FRect nodePos) const;

    bool isFull() const;
    bool isEmpty() const;

    void push(const std::string &text);
    void pop();
};


#endif //PORTFOLIO_STACK_H
