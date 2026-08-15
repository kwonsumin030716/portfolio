package in.kwonsum.asset.api;

import java.time.LocalDate;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import in.kwonsum.asset.dto.Account;
import in.kwonsum.asset.dto.AllocSet;
import in.kwonsum.asset.dto.Save;
import in.kwonsum.asset.dto.StockMap;
import in.kwonsum.asset.dto.Token;
import in.kwonsum.asset.dto.Transaction;
import in.kwonsum.asset.tool.FileManager;

public class KRInvestAPI extends Api {

    private static String baseURL = "https://openapi.koreainvestment.com:9443";
    public String accessKey;
    public String secretKey;
    public Token token;    
    
    public KRInvestAPI(Account acc){
        super();
        this.accessKey = acc.publicKey;
        this.secretKey = acc.secretKey;
        this.token = getToken(acc.accNum);
        setBalance(acc);

    }

    @Override
    public String getStockName(String code){
        FHKST03010100 response = new FHKST03010100(this, code, LocalDate.now());
        return response.getName();
    }

    //특정 종목 현재가 가져오기
    @Override
    public double getCurrent(String code){
        FHKST03010100 response = new FHKST03010100(this, code, LocalDate.now());
        return response.getCurrentPrice();
    }

    //특정 종목 과거 종가 가져오기
    @Override
    public double getPrevValue(String code, LocalDate date){
        FHKST03010100 response = new FHKST03010100(this, code, date);
        return response.getClosePrice();
    }

    @Override
    public double getChangeRate(String code, LocalDate date){
        FHKST03010100 response = new FHKST03010100(this, code, date);
        return response.getChangeRate();
    }
    
    //잔고 최신화
    @Override
    public void setBalance(Account acc){
        TTTC8434R response = new TTTC8434R(this, acc);

        //예수금 최신화
        acc.deposit = response.deposit();
        acc.totalValue = response.totalValue();
        //주식 리스트 최신화
        acc.sm = new StockMap();
        for(Map<String, String> token: response.output1){
            String code = (String) token.get("pdno");
            String name = (String) token.get("prdt_name");
            double value = getCurrent(code);
            double qty = Double.parseDouble((String) token.get("hldg_qty"));
            double cost = Double.parseDouble((String) token.get("pchs_avg_pric"));
            acc.sm.add(code, name, value, qty, cost);
        }
    }

    //특정 계좌에서 일정 기간 동안의 거래 내역 가져오기
    @Override
    public List<Transaction> getTransactions(Account acc, LocalDate start, LocalDate end){
        CTSC9215R response = new CTSC9215R(this, acc, start, end);
        return response.getTranList();
    }


    //특정 계좌에서 일정 기간 동안의 배당 기록 가져오기 -- 월별로 끊어서 가져오기
    @Override
    public AllocSet getAllocations(Account acc, LocalDate start, LocalDate end) {
        CTRGA011R response = new CTRGA011R(this, acc, start, end);
        return response.getAllocSet();
    }

    //한국투자증권 API 인증 토큰 가져오기
    private Token getToken(String accNum){
        //계좌 구분
        String cls = accNum.substring(0,8);
        //기발급 토큰 가져오기
        Save s = FileManager.readJson(FileManager.TOKENPATH, cls);
        Token token = null;
        if(s != null) token = new Token(s.data);
        
        //토큰이 만료된 경우 재발급
        if(token == null || token.isExpired()){
            //URL
            String url = baseURL + "/oauth2/tokenP";
            //쿼리파라미터
            Map<String, String> params = new HashMap<>();
            params.put("grant_type", "client_credentials");
            params.put("appkey", accessKey);
            params.put("appsecret", secretKey);
            //응답 토큰으로 전환
            String response = requestPost(url, null, params);
            token = new Token(response);
            //토큰 저장
            FileManager.writeJson(FileManager.TOKENPATH, new Save(cls, response));
        }
        return token;
    }
}
