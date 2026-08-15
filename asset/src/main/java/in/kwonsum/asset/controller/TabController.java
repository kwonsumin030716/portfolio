package in.kwonsum.asset.controller;

import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.List;
import java.util.Map;

import in.kwonsum.asset.tool.FileManager;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "https://portfolio-sigma-smoky-74.vercel.app"})
public class TabController {

    @GetMapping("/tabs")
    public List<Map<String, String>> getProjectTabs(){
        System.out.println("Next.js 계좌 리스트 요청 접수");
        return FileManager.getAccountList();
    }
}
