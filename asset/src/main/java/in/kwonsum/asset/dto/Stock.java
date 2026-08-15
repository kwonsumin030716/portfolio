package in.kwonsum.asset.dto;
import java.util.Map;
import java.util.LinkedHashMap;


public class Stock {
    public String code;     //종목코드
    public String name;     //종목명
    public double value;    //현재가
    public double qty;      //수량
    public double cost;     //매입단가

    

    public Stock() {
        code = null;
        name = null;
        value = 0;
        qty = 0;
    }

    public Stock(Stock origin){
        this(origin.code, origin.name, origin.value, origin.qty, origin.cost);
    }

    public Stock(String code, String name, double value, double qty, double cost) {
        this.code = code;
        this.name = name;
        this.value = value;
        this.qty = qty;
        this.cost = cost;
    }

    public double getEarnRate(){
        return this.value / this.cost - 1;
    }

    public double getTotalValue(){
        return this.value * this.qty;
    }

    public boolean equals(Stock s){
        return this.code.equals(s.code);
    }


    public String toString(){
        String res = "\n"
        + "\ncode: " + code 
        + "\nname: " + name 
        + "\nvalue: " + String.format("%,.6f", value)
        + "\nqty: " + String.format("%.1f", qty)
        + "\ncost: " + String.format("%.6f", cost);
        return res;
    }

    public Map<String, String> toMap(){
        Map<String, String> stockMap = new LinkedHashMap<>();
        stockMap.put("code", code);
        stockMap.put("name", name);
        stockMap.put("value", String.format("%.0f", value));
        stockMap.put("qty", String.format("%.0f", qty));
        return stockMap;
    }
}
