package in.kwonsum.asset.api;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import in.kwonsum.asset.dto.Account;
import in.kwonsum.asset.dto.AllocSet;
import in.kwonsum.asset.dto.StockMap;
import in.kwonsum.asset.dto.Transaction;

@SuppressWarnings("unchecked")
public class UpbitAPI extends Api {
    
    private static String baseURL = "https://api.upbit.com";
    private String accessKey;
    private String secretKey;
    private Algorithm algorithm;
    private static DateTimeFormatter dateForm = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss+09:00");
    

    public UpbitAPI(Account acc) {
        this.accessKey = acc.publicKey;
        this.secretKey = acc.secretKey;
        this.algorithm = Algorithm.HMAC512(secretKey.getBytes(StandardCharsets.UTF_8));
        setBalance(acc);
    }

    //잔고 최신화
    @Override
    public void setBalance(Account acc){
        //잔고 조회 URL
        String url = baseURL + "/v1/accounts";
        //잔고 요청
        Map<String, String> response = requestGet(url, getHeaders(null), null);
        List<Map<String, Object>> resList = gson.fromJson(response.get("body"), List.class);
        //stockList 최신화
        acc.sm = new StockMap();
        for(Map<String, Object> token : resList){
            String name = (String) token.get("currency");
            if(name.equals("KRW")){
                acc.deposit = Double.parseDouble((String) token.get("avg_buy_price"));
            }else if(!name.equals("XCORE")){
                String code = "KRW-" + name;
                double qty = Double.parseDouble((String) token.get("balance"));
                double value = getCurrent(code);
                double cost = Double.parseDouble((String) token.get("avg_buy_price"));
                acc.sm.add(code, name, value, qty, cost);
                acc.totalValue += qty * value;
            }
        }
    }

    //일정 기간 동안 거래 내역 가져오기
    @Override
    public List<Transaction> getTransactions(Account acc, LocalDate s, LocalDate e){
        //URL
        String url = baseURL + "/v1/orders/closed";

        List<Transaction> tranList = new ArrayList<>();

        for(String code : acc.sm.getCodeList()){
            //미실행 기간을 7일식 나누어 진행
            LocalDateTime iter = LocalDateTime.now();
            LocalDateTime start = s.atStartOfDay();

            while(iter.isAfter(start)){
                //파라미터 설정
                Map<String, String> params = new HashMap<>();
                params.put("market", code);
                // params.put("state", "done,cancel");
                if(start.isAfter(iter.minusDays(7))){
                    params.put("start_time", start.format(dateForm));
                }
                params.put("end_time", iter.format(dateForm));

                //새로운 거래 기록 가져오기
                Map<String, String> response = requestGet(url, getHeaders(params), params);
                List<Map<String, String>> transactions = gson.fromJson(response.get("body"), List.class);

                //새로운 거래에서 첫 매수일 / 마지막 매도일 가져오기
                if(transactions != null){
                    for(Map<String, String> t : transactions){
                        Transaction temp = new Transaction();
                        temp.code = t.get("market");
                        temp.cost = Double.parseDouble(t.get("executed_funds"));
                        temp.qty = Double.parseDouble(t.get("executed_volume"));
                        temp.cost = (double) Math.round(temp.cost);
                        temp.askbid = (t.get("side").equals("ask")) ? "매도" : "매수";
                        temp.orderTime = OffsetDateTime.parse(t.get("created_at")).toLocalDateTime();
                        if(temp.qty > 0) tranList.add(temp);
                    }
                }
                iter = iter.minusDays(7);
            }
        }
        Collections.sort(tranList);
        return tranList;
    }

    //배당 기록 가져오기
    @Override
    public AllocSet getAllocations(Account acc, LocalDate start, LocalDate end) {
        return new AllocSet();
    }

    //업비트 API 인증 토큰 가져오기
    private String getToken(Map<String, String> params){
        String jwtToken = null;
            
        if(params == null){
            jwtToken = JWT.create()
            .withClaim("access_key", accessKey)
            .withClaim("nonce", UUID.randomUUID().toString())
            .sign(algorithm);
        }else{
            String queryString = params.entrySet().stream()
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining("&"));
            
            MessageDigest md = null;
            try{
                md = MessageDigest.getInstance("SHA-512");
                md.update(queryString.getBytes(StandardCharsets.UTF_8));
            } catch (Exception e){
                Discord.printLog(e);
            }   
            
            StringBuilder sb = new StringBuilder();
            for (byte b : md.digest()){
                sb.append(String.format("%02x", b));
            }

            String queryHash = sb.toString();

            jwtToken = JWT.create()
            .withClaim("access_key", accessKey)
            .withClaim("nonce", UUID.randomUUID().toString())
            .withClaim("query_hash", queryHash)
            .withClaim("query_hash_alg", "SHA512")
            .sign(algorithm);
        }
        return "Bearer " + jwtToken;
    }

    //요청 헤더 생성
    private Map<String, String> getHeaders(Map<String, String> params){
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Authorization", getToken(params));
        return headers;
    }

    @Override
    public double getCurrent(String code) {
        String url = baseURL + "/v1/ticker";

        Map<String, String> params = new HashMap<>();
        params.put("markets", code);

        Map<String, String> response = requestGet(url, getHeaders(params), params);
        List<Map<String, Object>> resList = gson.fromJson(response.get("body"), List.class);

        return (Double) resList.get(0).get("trade_price");
    }

    @Override
    public String getStockName(String code) {
        return code.substring(4);
    }

    @Override
    public double getPrevValue(String code, LocalDate date){
        String url = baseURL + "/v1/candles/days";
        Map<String, String> params = new HashMap<>();
        params.put("market", code);
        params.put("to", date.plusDays(1).atStartOfDay().format(dateForm));
        params.put("converting_price_unit", "KRW");
        params.put("count", "1");

        Map<String, String> response = requestGet(url, getHeaders(params), params);
        List<Map<String, Object>> resList = gson.fromJson(response.get("body"), List.class);

        return (Double) resList.get(0).get("trade_price");
    }

    @Override
    public double getChangeRate(String code, LocalDate date){
        double close1 = getPrevValue(code, date);
        double close2 = getPrevValue(code, date.minusDays(1));
        double change = close1 - close2;
        return Math.round(change / close2 * 10000) / 100.0;
    }
}
