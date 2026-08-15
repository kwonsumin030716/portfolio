package in.kwonsum.asset.api;

import java.util.LinkedHashMap;
import java.util.Map;

import com.google.gson.Gson;


public class BaseKR{

    public static Gson gson = new Gson();
    public static String baseURL = "https://openapi.koreainvestment.com:9443";
    public Map<String, String> header = null;
    public Map<String, Object> body = null;
    KRInvestAPI api;

    public String tr_cont = null;
    public String fk100 = null;
    public String nk100 = null;

    public BaseKR(KRInvestAPI api){
        this.api = api;
    }

    @SuppressWarnings("unchecked")
    protected void headerParse(String hString){
        header = gson.fromJson(hString, Map.class);
    }

    protected Map<String, String> getBasicHeader(String trid){
        Map<String, String> headers = new LinkedHashMap<>();
        headers.put("content-type", "application/json, charset=utf-8");
        headers.put("authorization", api.token.toString());
        headers.put("appkey",api.accessKey);
        headers.put("appsecret",api.secretKey);
        headers.put("tr_id", trid);
        headers.put("custtype", "P");
        return headers;
    }

    public boolean isEnd(){
        if(header == null) return false;
        tr_cont = header.get("tr_cont");
        return !("F".equals(tr_cont) || "M".equals(tr_cont));
    }
}