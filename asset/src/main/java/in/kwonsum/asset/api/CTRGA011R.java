package in.kwonsum.asset.api;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import in.kwonsum.asset.dto.Account;
import in.kwonsum.asset.dto.AllocSet;
import in.kwonsum.asset.dto.AllocSet.Alloc;

//한국투자증권 기간별계좌권리현황조회 - 배당 내역 불러오기
public class CTRGA011R extends BaseKR{
    
    private static String url = baseURL + "/uapi/domestic-stock/v1/trading/period-rights";

    public List<Map<String, String>> output = new ArrayList<>();

    @SuppressWarnings("unchecked")
    public CTRGA011R(KRInvestAPI api, Account acc, LocalDate start, LocalDate end){
        super(api);
        Map<String, String> headers = getBasicHeader("CTRGA011R");
        Map<String, String> params = new LinkedHashMap<>();
        
        params.put("INQR_DVSN", "03");
        params.put("CUST_RNCNO25", "");
        params.put("HMID", "");
        params.put("CANO", acc.accNum.substring(0,8));
        params.put("ACNT_PRDT_CD",acc.accNum.substring(9,11));
        params.put("INQR_STRT_DT", start.toString().replace("-", ""));
        params.put("INQR_END_DT", end.toString().replace("-", ""));
        params.put("RGHT_TYPE_CD", "");
        params.put("PDNO", "");
        params.put("PRDT_TYPE_CD", "");
        params.put("CTX_AREA_FK100", "");
        params.put("CTX_AREA_NK100", "");

        while(!isEnd()){
            //요청
            Map<String, String> response = KRInvestAPI.requestGet(url, headers, params);
            headerParse(response.get("header"));
            //바디 파싱
            Map<String, Object> resMap = gson.fromJson(response.get("body"), Map.class);
            //다음 요청 준비
            headers.put("tr_cont", "N");
            params.put("CTX_AREA_FK100", (String) resMap.get("ctx_area_fk100"));
            params.put("CTX_AREA_NK100", (String) resMap.get("ctx_area_nk100"));
            //데이터 합산
            if(resMap.get("output") != null){
                output.addAll((List<Map<String, String>>) resMap.get("output"));
            }
            
        }
    }

    public AllocSet getAllocSet(){
        DateTimeFormatter format = DateTimeFormatter.ofPattern("yyyyMMdd");

        AllocSet res = new AllocSet();
        for(Map<String, String> map : output){
            String code = map.get("shtn_pdno");
            LocalDate date = LocalDate.parse(map.get("cash_dfrm_dt"), format);
            double value = Double.parseDouble(map.get("last_alct_amt"));
            res.add(new Alloc(code, date, value));
        }
        
        return res;
    }
}
