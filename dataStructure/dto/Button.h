//
// Created by kwons on 26. 9. 10..
//

#ifndef PORTFOLIO_BUTTON_H
#define PORTFOLIO_BUTTON_H
#include <string>
#include "../Types.h"

class Button {
private:
    int x = 0;
    int y = 0;
    int w = 0;
    int h = 0;

public:

    std::string text;
    TextAlign textAlign;

    Button(int x, int y, int w, int h, std::string text, TextAlign textAlign);

    bool isClicked(int clickX, int clickY);
};

#endif //PORTFOLIO_BUTTON_H
