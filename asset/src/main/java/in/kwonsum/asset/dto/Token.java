package in.kwonsum.asset.dto;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.google.gson.Gson;
import java.util.Map;

@SuppressWarnings("unchecked")
public class Token {
    private String token;
    private LocalDateTime expireTime;
    private String tokenType;

    private static Gson gson = new Gson();
    private static DateTimeFormatter dateForm = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public Token(String res){
        Map<String, Object> resMap = gson.fromJson(res, Map.class);
        this.token = (String) resMap.get("access_token");
        this.tokenType = (String) resMap.get("token_type");
        this.expireTime = LocalDateTime.parse((String) resMap.get("access_token_token_expired"), dateForm);
        
    }

    public String toString(){
        return tokenType + " " + token;
    }

    public boolean isExpired(){
        return LocalDateTime.now().isAfter(expireTime);
    }

    public String toJson(){
        Map<String, Object> map = Map.of(
            "access_token", token,
            "token_type", tokenType,
            "access_token_token_expired", expireTime.format(dateForm)
        );
        return gson.toJson(map);
    }
}