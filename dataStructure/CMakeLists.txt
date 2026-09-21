# 환경 선언
cmake_minimum_required(VERSION 3.20)
project(dataStructure CXX)
set(CMAKE_CXX_STANDARD 17)

add_compile_definitions(SDL_MAIN_HANDLED=1)

set(SOURCE_FILES
        main.cpp
        Window.cpp
        tab/BaseTab.cpp
        tab/QueueStack.cpp
        tab/Tree.cpp
        dto/Queue.cpp
)

if(EMSCRIPTEN)
    # 1. 컴파일 플래그
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3 -sUSE_SDL=3 -sUSE_SDL_TTF=3 -sDISABLE_EXCEPTION_CATCHING=0")

    # 2. 링크 플래그
    set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} \
        -O3 \
        -sUSE_SDL=3 \
        -sUSE_SDL_TTF=3 \
        -sSINGLE_FILE=1 \
        -sEXIT_RUNTIME=0 \
        -sDISABLE_EXCEPTION_CATCHING=0 \
        -sALLOW_MEMORY_GROWTH=1 \
        -sEXPORTED_FUNCTIONS=['_main','_changeTab','_queueStackPush','_queueStackPop'] \
        -sEXPORTED_RUNTIME_METHODS=['ccall','cwrap'] \
        -sEXPORT_ES6=1 \
        -sMODULARIZE=1 \
        --embed-file ${CMAKE_CURRENT_SOURCE_DIR}/resources@resources \
        -sASYNCIFY=1")

    add_executable(dataStructure ${SOURCE_FILES})

    set_target_properties(dataStructure PROPERTIES
            RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/../web/public/wasm"
            OUTPUT_NAME "dataStructure"
            SUFFIX ".js"
    )
else()
    add_executable(dataStructure ${SOURCE_FILES})

    find_package(SDL3 REQUIRED)
    target_link_libraries(dataStructure PRIVATE SDL3::SDL3)
endif()
