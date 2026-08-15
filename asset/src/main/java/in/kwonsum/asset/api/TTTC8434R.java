package in.kwonsum.asset.api;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import in.kwonsum.asset.dto.Account;

//한국투자증권 주식잔고조회
public class TTTC8434R extends BaseKR{

    private static String url = baseURL + "/uapi/domestic-stock/v1/trading/inquire-balance";

    public List<Map<String, String>> output1 = new ArrayList<>();
    public List<Map<String, String>> output2 = new ArrayList<>();

    @SuppressWarnings("unchecked")
    public TTTC8434R(KRInvestAPI api, Account acc){
        super(api);
        //헤더
        Map<String, String> headers = getBasicHeader("TTTC8434R");

        //쿼리파라미터
        Map<String, String> params = new LinkedHashMap<>();
        params.put("CANO", acc.accNum.substring(0,8));
        params.put("ACNT_PRDT_CD",acc.accNum.substring(9,11));
        params.put("AFHR_FLPR_YN","N");
        params.put("INQR_DVSN","01");
        params.put("UNPR_DVSN","01");
        params.put("FUND_STTL_ICLD_YN","Y");
        params.put("FNCG_AMT_AUTO_RDPT_YN","N");
        params.put("PRCS_DVSN","00");
        while(!isEnd()){
            //요청
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
            output2.addAll((List<Map<String, String>>) resMap.get("output2"));
        }
    }

    public void merge(TTTC8434R other){
        
    }

    public double deposit(){
        double sum = 0.0;
        for(Map<String, String> map : output2){
            sum += Double.parseDouble(map.get("dnca_tot_amt"));
        }
        return sum;
    }

    public double totalValue(){
        return Double.parseDouble((String) output2.get(0).get("tot_evlu_amt"));
    }


    
}
