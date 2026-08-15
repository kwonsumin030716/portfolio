package in.kwonsum.asset.tool;

import java.io.File;
import java.io.FileWriter;
import java.io.FileReader;
import java.nio.charset.StandardCharsets;
import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import in.kwonsum.asset.api.Discord;
import in.kwonsum.asset.dto.Save;

public class FileManager {

    public static final String KEYPATH = "key.env";
    public static final String ACCOUNTPATH = "account.env";
    public static final String DATAPATH = "data.json";
    public static final String TOKENPATH = "token.json";
    
    private static final Gson gson = new Gson();

    public FileManager(){

    }

    public static List<Map<String,String>> getAccountList(){
        List<Map<String,String>> res = new ArrayList<>();
        
        Map<String, String> env = readEnv(ACCOUNTPATH);
        Type typeToken = new TypeToken<Map<String, String>>(){}.getType();
        for(String key : env.keySet()){
            res.add(gson.fromJson(env.get(key), typeToken));
        }
        return res;
    }

    public static String readEnv(String path, String cls){
        Map<String, String> env = readEnv(path);
        return env.get(cls);
    }

    public static Map<String, String> readEnv(String path){
        File file = new File(path);
        Map<String, String> res = new HashMap<>();
        try{
            if(file.createNewFile()){
                Discord.printLog(path + " 파일 생성");
                return null;
            }else{
                Scanner input = new Scanner(file, StandardCharsets.UTF_8);
                while(input.hasNext()){

                    String[] s = input.nextLine().split("=", 2);

                    res.put(s[0], s[1]);
                }

                input.close();
                return res;
            }
        }catch(Exception e){
            Discord.printLog(e);
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    public static Save readJson(String path, String cls){
        File file = new File(path);
        try{
            List<Map<String, String>> json = gson.fromJson(new FileReader(file), List.class);

            if(json == null || json.isEmpty()) return null;

            for(Map<String, String> e : json){
                if(e.get("cls").equals(cls)) return new Save(e);
            }
            return null;
        }catch(Exception e){
            Discord.printLog(e);
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    public static void writeJson(String path, Save newSave){
        newSave.update = LocalDateTime.now();
        File file = new File(path);
        List<Map<String, String>> saves = new ArrayList<>();
        try{
            List<Map<String, String>> json = gson.fromJson(new FileReader(file), List.class);
            for(Map<String, String> e : json){
                Save temp = new Save(e);
                if(!temp.equals(newSave)) saves.add(temp.toMap());
            }
        }catch(Exception e){
            Discord.printLog(e);
        }
        saves.add(newSave.toMap());
        try(FileWriter fw = new FileWriter(path)){
            fw.write(gson.toJson(saves));
        }catch(Exception e){
            Discord.printLog(e);
        }
    }
}
