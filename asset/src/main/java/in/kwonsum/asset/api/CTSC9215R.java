package in.kwonsum.asset.api;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import in.kwonsum.asset.dto.Account;
import in.kwonsum.asset.dto.Transaction;

//한국투자증권 주식일별주문체결조회 - 거래내역 불러오기
public class CTSC9215R extends BaseKR{

    private static String url = baseURL + "/uapi/domestic-stock/v1/trading/inquire-daily-ccld";

    public List<Map<String, String>> output1 = new ArrayList<>();
    public Map<String, String> output2 = new HashMap<>();

    @SuppressWarnings("unchecked")
    public CTSC9215R(KRInvestAPI api, Account acc, LocalDate start, LocalDate end){
        super(api);
        //헤더
        Map<String, String> headers = getBasicHeader("TTTC0081R");
        //쿼리파라미터
        Map<String, String> params = new LinkedHashMap<>();
        params.put("CANO", acc.accNum.substring(0,8));
        params.put("ACNT_PRDT_CD",acc.accNum.substring(9,11));
        params.put("SLL_BUY_DVSN_CD", "00");
        params.put("ORD_GNO_BRNO", "00000");
        params.put("CCLD_DVSN", "01");
        params.put("INQR_DVSN", "01");
        params.put("INQR_DVSN_1", "0");
        params.put("INQR_DVSN_3", "00");
        params.put("EXCG_ID_DVSN_CD", "ALL");
        params.put("CTX_AREA_FK100", "0");
        params.put("CTX_AREA_NK100", "0");

        for(LocalDate i = end; !i.isBefore(start); i = i.minusMonths(3)){
            LocalDate istart = i.minusMonths(3).plusDays(1);
            if(start.isAfter(istart)) istart = start;
            params.put("INQR_STRT_DT", istart.toString().replace("-", ""));
            params.put("INQR_END_DT", i.toString().replace("-", ""));

            while(!isEnd()){
                Map<String, String> response = KRInvestAPI.requestGet(url, headers, params);
                //헤더 새로고침
                headerParse(response.get("header"));
                //바디 파싱
                Map<String, Object> resMap = gson.fromJson(response.get("body"), Map.class);
                //다음 요청 준비
                headers.put("tr_cont", "N");
                params.put("CTX_AREA_FK100", (String) resMap.get("ctx_area_fk100"));
                params.put("CTX_AREA_NK100", (String) resMap.get("ctx_area_nk100"));

                //데이터 합산
                output1.addAll((List<Map<String, String>>) resMap.get("output1"));
                output2 = (Map<String, String>) resMap.get("output2");
            }

            header = null;
            headers = getBasicHeader("CTSC9215R");
            params.put("CTX_AREA_FK100", "0");
            params.put("CTX_AREA_NK100", "0");
        }
    }

    public List<Transaction> getTranList(){
        DateTimeFormatter format = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        List<Transaction> res = new ArrayList<>();

        for(Map<String, String> map : output1){
            String code = map.get("pdno");
            double cost = Double.parseDouble(map.get("tot_ccld_amt"));
            double qty = Double.parseDouble(map.get("tot_ccld_qty"));
            String askbid = map.get("sll_buy_dvsn_cd_name").contains("매수") ? "매수" : "매도";
            String orderTimeStr = map.get("ord_dt") + map.get("ord_tmd");
            LocalDateTime orderTime = LocalDateTime.parse(orderTimeStr, format);

            res.add(new Transaction(code, cost, qty, askbid, orderTime));
        }
        Collections.sort(res);
        return res;
    }
    
}
