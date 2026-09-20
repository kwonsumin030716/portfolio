//
// Created by kwons on 26. 9. 16..
//

#ifndef PORTFOLIO_TREE_H
#define PORTFOLIO_TREE_H
#include "BaseTab.h"


class Tree : public BaseTab {

private:

public:
    Tree();
    ~Tree() override;

    bool init(SDL_Renderer *r) override;
    void onEnter() override;
    void onExit() override;
    void update() override;
    void render() override;

    void handleEvent(const SDL_Event &e) override;


};


#endif //PORTFOLIO_TREE_H
