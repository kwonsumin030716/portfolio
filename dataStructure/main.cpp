#include <SDL3/SDL.h>
#include <SDL3/SDL_main.h>

#include "Window.h"

int main(int argc, char* argv[]) {
    const auto window = new Window();


    if (window->init()) {
        window->run();
    }
    delete window;

    return 0;
}
