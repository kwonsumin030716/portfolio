package in.kwonsum.asset.api;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

//한국투자증권 국내주식기간별시세
public class FHKST03010100 extends BaseKR{

    private static String url = baseURL + "/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice";

    public Map<String, String> output1 = null;
    public List<Map<String, String>> output2 = null;

    @SuppressWarnings("unchecked")
    public FHKST03010100(KRInvestAPI api, String code, LocalDate date){
        super(api);
        Map<String, String> headers = getBasicHeader("FHKST03010100");
        Map<String, String> params = new LinkedHashMap<>();
        params.put("FID_COND_MRKT_DIV_CODE","J");
        params.put("FID_INPUT_ISCD", code);
        params.put("FID_INPUT_DATE_1", date.minusDays(15).toString().replace("-", ""));
        params.put("FID_INPUT_DATE_2", date.toString().replace("-", ""));
        params.put("FID_PERIOD_DIV_CODE","D");
        params.put("FID_ORG_ADJ_PRC","0");

        //응답 파싱
        Map<String, String> response = KRInvestAPI.requestGet(url, headers, params);
        headerParse(response.get("header"));
        Map<String, Object> resMap = gson.fromJson(response.get("body"), Map.class);
        output1 = (Map<String, String>) resMap.get("output1");
        output2 = (List<Map<String, String>>) resMap.get("output2");
    }

    public double getClosePrice(){
        return Double.parseDouble(output2.get(0).get("stck_clpr"));
    }

    public double getCurrentPrice(){
        return Double.parseDouble((String) output1.get("stck_prpr"));
    }

    public String getName(){
        return output1.get("hts_kor_isnm");
    }

    public double getChangeRate(){
        double change = Double.parseDouble(output2.get(0).get("prdy_vrss"));
        double close = getClosePrice() - change;
        if(close == 0) return 0.0;
        return Math.round(change / close * 10000) / 100.0;
    }
    
}
