//
// Created by kwons on 26. 9. 16..
//

#include "Tree.h"

Tree::Tree(){}
Tree::~Tree(){}

bool Tree::init(SDL_Renderer* r) {
    return BaseTab::init(r);
}

void Tree::onEnter() {
    SDL_Log("Tree::onEnter");
}
void Tree::onExit() {
    SDL_Log("Tree::onExit");
}
void Tree::update() {

}
void Tree::render() {
    if (!renderer) return;

    setBackground();
    int currentW = 0;
    int currentH = 0;
    SDL_GetRenderOutputSize(renderer, &currentW, &currentH);
    SDL_FRect screen = {0.0f, 0.0f, static_cast<float>(currentW), static_cast<float>(currentH)};

    writeText(&screen, "Tree implemening..", BLACK, 32, TextStyle::BOLD, TextAlign::CENTER);

}
void Tree::handleEvent(const SDL_Event &e) {

}