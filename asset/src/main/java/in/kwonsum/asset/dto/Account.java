package in.kwonsum.asset.dto;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;
import com.google.gson.reflect.TypeToken;

import in.kwonsum.asset.api.Api;
import in.kwonsum.asset.api.Discord;
import in.kwonsum.asset.api.KRInvestAPI;
import in.kwonsum.asset.api.UpbitAPI;
import in.kwonsum.asset.chart.Chart;
import in.kwonsum.asset.chart.Chart.ChartMode;
import in.kwonsum.asset.chart.CircleData;
import in.kwonsum.asset.chart.XYData;
import in.kwonsum.asset.tool.FileManager;


public class Account {

    public final double TARGET_RATE = Double.parseDouble(FileManager.readEnv(FileManager.KEYPATH, "TARGET_RATE"));

    public String accNum;
    public String nickName;
    public String publicKey;
    public String secretKey;
    public String channelId;
    
    public double deposit;
    public double totalValue = 0.0;

    public StockMap sm;
    public TQueue tq;
    public AllocSet al;
    public AssetMap am;
    public LocalDateTime update;

    public Api api;
    private static final Gson gson = new GsonBuilder()
        .registerTypeAdapter(LocalDate.class, (JsonSerializer<LocalDate>)(src, type, ctx) -> new JsonPrimitive(src.toString()))
        .registerTypeAdapter(LocalDateTime.class, (JsonSerializer<LocalDateTime>)(src, type, ctx) -> new JsonPrimitive(src.toString()))
        .registerTypeAdapter(LocalDate.class, (JsonDeserializer<LocalDate>)(json, type, ctx) -> LocalDate.parse(json.getAsString()))
        .registerTypeAdapter(LocalDateTime.class, (JsonDeserializer<LocalDateTime>)(json, type, ctx) -> LocalDateTime.parse(json.getAsString()))
        .create();

    public Account(Map<String, String> info){
        accNum = info.get("accNum");
        nickName = info.get("nickName");
        publicKey = info.get("publicKey");
        secretKey = info.get("secretKey");
        channelId = info.get("channelId");

        Discord.printLog(nickName + " 계좌 최신화");
        if(accNum.equals("UPBIT")) api = new UpbitAPI(this);
        else api = new KRInvestAPI(this);

        fromSave(FileManager.readJson(FileManager.DATAPATH, accNum));
        
        refresh();
    }

   
    //특정 종목 예수금 포함 목표 수익률 반환 - 평균 방식 목표 수익률
    public double getTargetRate(String code){
        return getTargetProfit(code) / sm.get(code).cost;
    }

    //특정 종목 목표가
    public double getTargetPrice(String code){
        return (sm.get(code).cost + getTargetProfit(code)) / sm.get(code).qty;
    }

    //특정 종목 기간 대비 목표 수익 반환
    public double getTargetProfit(String code){
        return sm.get(code).cost * getPeriodRate(code) + getDepositCost(code) - al.getStockAllocs(code, tq.getFirstBuyDate(code));
    }

    //특정 종목 예수금 비용
    public double getDepositCost(String code){
        return this.deposit * getWeight(code) * getPeriodRate(code);
    }

    //종목 보유기간 대비 목표 수익률
    public double getPeriodRate(String code){
        return (TARGET_RATE * (tq.getPeriod(code)));
    }

    //종목 비중 반환
    public double getWeight(String code){
        if(sm.get(code) == null) return 0.0;
        return sm.get(code).getTotalValue() / this.totalValue;
    }

    //계좌 전체 금액 대비 비중 반환
    public double getTotalWeight(String code){
        if(code.equals("KRW")) return this.deposit / (this.deposit + this.totalValue);
        if(sm.get(code) == null) return 0.0;
        return sm.get(code).getTotalValue() / (this.deposit + this.totalValue);
    }

    //총 자산 기록 최신화
    public boolean refresh(){
        al.addAll(api.getAllocations(this, update.toLocalDate(), LocalDate.now()));

        LocalDate start = update.toLocalDate();
        LocalDate pivot = LocalDate.now();

        Discord.printLog(start + " ~ " + pivot + " 자산 변동 내역 불러오기");
        Map<String, Double> qtyMap = sm.toQtyMap();
        List<Transaction> newTransactions = api.getTransactions(this, start, pivot);
    
        double krw = this.deposit;
        for(LocalDate i = pivot; i.isAfter(start); i = i.minusDays(1)){
            krw -= al.getPeriodAllocs(i, i);
            for(Transaction t : newTransactions){
                if(i.isEqual(t.orderTime.toLocalDate())){
                    double ask = (t.askbid.equals("매수")) ? -1.0 : 1.0;
                    qtyMap.merge(t.code, ask * t.qty, Double::sum);
                    krw -= ask * t.cost;
                    if(qtyMap.get(t.code) < 0.00001) qtyMap.remove(t.code);
                }
            }
            double sum = krw;
            for(String code : qtyMap.keySet()){
                sum += api.getPrevValue(code, i.minusDays(1)) * qtyMap.get(code); 
            }
            sum = (double) Math.round(sum);
            am.merge(i.minusDays(1), sum, Double::sum);
        }

        for(Transaction t : newTransactions){
            tq.add(t);
        }
        
        FileManager.writeJson(FileManager.DATAPATH, toSave());
        Discord.printLog("반영 완료");
        return true;
    }
    
    //String으로 반환
    public String toString(){
        String res = "\n\n[Account]" 
        + "\naccNum: " + accNum
        + "\ndeposit: " + String.format("%,.0f", deposit)
        + "\n"
        + sm.toString();

        return res;
    }

    public CircleData toCircleWeight(){
        CircleData sr = new CircleData();
        for(String code : sm.getCodeList()){
            Stock s = sm.get(code);
            sr.add(s.name, s.getTotalValue());
        }
        sr.add("KRW", deposit);
        return sr.sort();
    }

    public XYData<String> toMonthAllocation(){
        XYData<String> data = new XYData<>(ChartMode.LINE, Chart.GREEN);
        LocalDate start = LocalDate.now();
        start = start.minusDays(start.getDayOfMonth()-1);
        for(int i=0;i<12;i++){
            LocalDate end = start.minusDays(1);
            start = start.minusMonths(1);
            double value = al.getPeriodAllocs(start, end);
            String label = start.format(DateTimeFormatter.ofPattern("yy년 MM월"));
            data.put(label, value);
        }
        return data;
    }

    public XYData<String> toMonthAsset(){
        XYData<String> data = new XYData<>(ChartMode.LINE, Chart.GREEN);

        String pivot = null;
        double sum = 0.0;
        int count = 0;
        for(Map.Entry<LocalDate, Double> e : am.entrySet()){
            String label = e.getKey().format(DateTimeFormatter.ofPattern("yy년 MM월"));
            if(label.equals(pivot)){
                sum += e.getValue();
                count++;
            }else{
                if(pivot != null) data.put(pivot, 1.0 * Math.round(sum / count));
                pivot = label;
            }
        }
        return data;
    }

    public Save toSave(){
        Save s = new Save();
        s.cls = this.accNum;
        
        Map<String, Object> m = new HashMap<>();
        m.put("tQueue", tq);
        m.put("allocSet", al);
        m.put("assetMap", am);

        s.data = gson.toJson(m);
        return s;
    }

    public void fromSave(Save s){
        if(s == null || s.data == null){
            this.tq = new TQueue();
            this.al = new AllocSet();
            this.am = new AssetMap();
            this.update = LocalDateTime.of(2025, 1,1,0,0,0);
            return;
        }
        this.update = s.update;
        String json = s.data;
        try{
            Type targetType = new TypeToken<Map<String, JsonElement>>(){}.getType();
            Map<String, JsonElement> rawMap = gson.fromJson(json, targetType);

            if(rawMap != null){
                if(rawMap.containsKey("tQueue")){
                    this.tq = gson.fromJson(rawMap.get("tQueue"), TQueue.class);
                }
                if(rawMap.containsKey("allocSet")){
                    this.al = gson.fromJson(rawMap.get("allocSet"), AllocSet.class);
                }
                if(rawMap.containsKey("assetMap")){
                    this.am = gson.fromJson(rawMap.get("assetMap"), AssetMap.class);
                }
            }
        }catch(Exception e){
            Discord.printLog(e);
        }
    }
}
