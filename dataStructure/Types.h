#ifndef PORTFOLIO_TYPES_H
#define PORTFOLIO_TYPES_H


enum class TextAlign {
    LEFT,
    CENTER,
    RIGHT,
};

enum class TextStyle {
    REGULAR,
    BOLD,
};

enum class TabType {
    queueStack,
    tree,
};

constexpr SDL_Color BLUE = {.r = 31, .g = 65, .b = 176, .a = 255};
constexpr SDL_Color WHITE = {.r = 255, .g = 255, .b = 255, .a = 255};
constexpr SDL_Color BLACK = {.r = 0, .g = 0, .b = 0, .a = 255};

#endif //PORTFOLIO_TYPES_H
