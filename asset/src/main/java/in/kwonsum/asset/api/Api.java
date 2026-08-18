package in.kwonsum.asset.api;


import java.net.SocketException;
import java.net.SocketTimeoutException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.concurrent.TimeUnit;

import com.google.gson.Gson;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.MediaType;
import okhttp3.HttpUrl;

import in.kwonsum.asset.dto.Transaction;
import in.kwonsum.asset.dto.Account;
import in.kwonsum.asset.dto.AllocSet;


public abstract class Api {
    protected static OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .build();
    protected static Gson gson = new Gson();
    private static LocalDateTime lastRequestTime = LocalDateTime.now();

    public Api() {

    }

    protected static String requestPost(String fullUrl, Map<String, String> headers, Map<String, String> params){
        String body = gson.toJson(params);
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody requestBody = RequestBody.create(body, mediaType);

        Request.Builder request = new Request.Builder()
            .url(fullUrl)
            .post(requestBody);
        if(headers != null) headers.forEach(request::addHeader);
    
        Map<String, String> response = execute(request.build());
        return response.get("body");
    }

    public static Map<String, String> requestGet(String fullUrl, Map<String, String> headers, Map<String, String> params){

        HttpUrl.Builder urlBuilder = HttpUrl.parse(fullUrl).newBuilder();
        if(params != null){
            params.forEach(urlBuilder::addQueryParameter);
        }
        HttpUrl finalUrl = urlBuilder.build();
        Request.Builder requestBuilder = new Request.Builder().url(finalUrl);

        if(headers != null) headers.forEach(requestBuilder::addHeader);

        return execute(requestBuilder.build());
    }

    protected static Map<String, String> execute(Request request){
        Map<String, String> res = new HashMap<>();

        int code = 0;
        while(code != 200 && code != 201 && code != 204) {

            if (lastRequestTime.plusSeconds(1).isAfter(LocalDateTime.now())) {
                try {
                    Thread.sleep(100);
                } catch (Exception e) {
                    Discord.printLog(e);
                }
            }

            try (Response response = client.newCall(request).execute()) {
                // System.out.println(response);
                System.out.println("\nRequesting: " + request.url());
                // System.out.print("|");
                lastRequestTime = LocalDateTime.now();
                code = response.code();
                Map<String, String> headerMap = new HashMap<>();
                for (String name : response.headers().names()) {
                    headerMap.put(name, response.header(name));
                }
                res.put("header", gson.toJson(headerMap));
                res.put("body", response.body().string());
                System.out.println(res.get("header"));
                System.out.println(res.get("body"));
            }catch(SocketTimeoutException e){
                System.out.println("[API] 타임 아웃 에러 발생 ");

            }catch(Exception e){
//                Discord.printLog(e);
                e.printStackTrace();
            }
        }
        return res;
    }

    public abstract String getStockName(String code);
    public abstract double getCurrent(String code);
    public abstract void setBalance(Account acc);
    public abstract List<Transaction> getTransactions(Account acc, LocalDate start, LocalDate end);
    public abstract AllocSet getAllocations(Account acc, LocalDate start, LocalDate end);
    public abstract double getPrevValue(String code, LocalDate date);
    public abstract double getChangeRate(String code, LocalDate date);
}
