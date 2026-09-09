cmake_minimum_required(VERSION 3.20)
project(WasmDataStructure CXX)

set(CMAKE_CXX_STANDARD 17)

list(APPEND CMAKE_PREFIX_PATH "C:/msys64/mingw64")

find_package(SDL3 REQUIRED)
find_package(SDL3_ttf REQUIRED)

set(SOURCES
    main.cpp
    window.cpp
    tab/BaseTab.cpp
    tab/QueueStack.cpp
)

add_executable(dataStructure_main ${SOURCES})

target_include_directories(dataStructure_main PRIVATE ${SDL3_INCLUDE_DIRS} ${SDL3_ttf_INCLUDE_DIRS})
target_link_libraries(dataStructure_main PRIVATE SDL3::SDL3 SDL3_ttf::SDL3_ttf)
