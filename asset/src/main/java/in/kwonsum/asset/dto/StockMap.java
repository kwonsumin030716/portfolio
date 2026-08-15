package in.kwonsum.asset.dto;

import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


public class StockMap extends HashMap<String, Stock>{

    public StockMap(){

    }

    public void add(String code, String name, double value, double qty, double cost){
        this.put(code, new Stock(code, name, value, qty, cost));
    }

    public List<String> getCodeList(){
        return new ArrayList<String>(this.keySet());
    }

    @Override
    public Stock get(Object o){
        return super.get((String) o);
    }

    public String toString(){
        String str = "\n[Stocks]";
        for(Map.Entry<String, Stock> e : this.entrySet()){
            str += "\n" + e.toString();
        }

        return str;
    }

    public Map<String, Double> toQtyMap(){
        Map<String, Double> res = new HashMap<>();
        for(String code : getCodeList()){
            res.put(code, get(code).qty);
        }
        return res;
    }
}