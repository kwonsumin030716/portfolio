package in.kwonsum.asset.controller;

import in.kwonsum.asset.tool.AssetManager;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AssetController {

    @GetMapping("/api/run")
    public String runAsset(){
        try{
            System.out.println("[스프링부트 로그] Next.js 요청 확인");
            new AssetManager();
            return "AssetManager 객체 생성 완료";
        }catch(Exception e){
            System.out.println("[스프링부트 로그] 객체 생성 실패\n" + e.getMessage());
            return "AssetManager 객체 생성 실패: \n" + e.getMessage();
        }
    }
}
