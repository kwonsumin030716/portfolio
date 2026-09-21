//
// Created by kwons on 26. 9. 21..
//



#ifndef PORTFOLIO_WRAP_H
#define PORTFOLIO_WRAP_H
#include <SDL3/SDL_rect.h>

namespace WRAP {
    inline SDL_FRect rect(const int x, const int y, const int w, const int h) {
        return SDL_FRect {
            .x = static_cast<float>(x),
            .y = static_cast<float>(y),
            .w = static_cast<float>(w),
            .h = static_cast<float>(h)
        };
    }
}



#endif //PORTFOLIO_WRAP_H
