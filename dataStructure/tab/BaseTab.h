#ifndef BASETAB_H
#define BASETAB_H

#include <string>
#include <SDL3/SDL.h>
#include "../Types.h"

class BaseTab {
protected:
    SDL_Renderer *renderer;

    void setBackground() const;
    void writeText(SDL_FRect* rect, const std::string& text, SDL_Color color, int size, TextStyle s, TextAlign a) const;


public:
    BaseTab();
    virtual ~BaseTab();

    virtual bool init(SDL_Renderer* r);
    virtual void onEnter() {}
    virtual void onExit() {}
    virtual void update() {}
    virtual void render() = 0;
    virtual void handleEvent(const SDL_Event& e) {}
};

#endif // BASETAB_H
