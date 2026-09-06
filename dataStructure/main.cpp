#include "engine/app.h"

int main(int argc, char* argv[]) {
    App app; // 그래픽 앱 엔진 객체 생성
    
    // 1. 초기화 성공 시
    if (app.Initialize()) {
        app.Run(); // 2. 무한 루프 가동 (게임 켜짐)
    }
    
    // 3. 루프가 끝나면 완전히 종료
    app.Shutdown();
    
    return 0;
}
