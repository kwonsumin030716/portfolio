package in.kwonsum.asset.controller;

import in.kwonsum.asset.tool.AssetManager;
import in.kwonsum.asset.tool.FileManager;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AssetController {

    private static final String AUTH_TOKEN = FileManager.readEnv(FileManager.KEYPATH, "API_RUN");

    @GetMapping("/api/run")
    public String runAsset(@RequestHeader(value = "Authorization") String authHeader){

        if(authHeader == null || !authHeader.equals("Bearer " + AUTH_TOKEN)){
            return "인증 실패: 권한이 없습니다.";
        }

        try{
            new AssetManager();
            return "AssetManager 실행 완료";
        }catch(Exception e){
            return "AssetManager 에러 발생: \n" + e.getMessage();
        }
    }
}
