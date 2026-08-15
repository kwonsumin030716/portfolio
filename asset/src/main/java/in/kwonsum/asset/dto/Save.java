package in.kwonsum.asset.dto;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public class Save {

    public String cls;
    public LocalDateTime update;
    public String data;

    public Save(String cls, LocalDateTime update, String data){
        this(cls, data);
        this.update = update;
    }

    public Save(String cls, String update, String data){
        this(cls, LocalDateTime.parse(update), data);
    }

    public Save(String cls, String data){
        this.cls = cls;
        this.data = data;
    }

    public Save(Map<String, String> m){
        this(m.get("cls"), m.get("update"), m.get("data"));
    }

    public Save(){

    }

    public String toString(){
        String str =  cls + "\n";
        if(update != null) str += update.toString() + "\n";
        str += data + "\n";

        return str;
    }

    public Map<String, String> toMap(){
        Map<String, String> res = new HashMap<>();
        res.put("cls", cls);
        res.put("update", update.toString());
        res.put("data", data);

        return res;
    }

    public boolean equals(Save s){
        return this.cls.equals(s.cls);
    }
    
}
