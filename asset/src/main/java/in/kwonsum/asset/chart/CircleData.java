package in.kwonsum.asset.chart;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class CircleData extends LinkedHashMap<String, Double> implements Chart.Data{

    public double totalValue = 0.0;

    public CircleData(){
        super();
    }

    public void add(String name, double value){
        totalValue += value;
        super.merge(name, value, Double::sum); 
    }

    public String getName(int i){
        ArrayList<String> names = new ArrayList<>(keySet());
        return names.get(i);
    }

    public double getPrice(int i){
        return get(getName(i));
    }

    public String getLabel(int i){
        return getName(i) + " " + String.format("%,9.0f", getPrice(i)) + "원 " + String.format("%2.1f", getRate(i) * 100) + "%";
    }
    
    public double getRate(int i){
        return getPrice(i) / totalValue;
    }

    public CircleData sort(){
        List<Map.Entry<String, Double>> entryList = new ArrayList<>(this.entrySet());
        entryList.sort((e1,e2) -> Double.compare(e1.getValue(), e2.getValue()));
        this.clear();
        for(Map.Entry<String, Double> entry : entryList){
            this.put(entry.getKey(), entry.getValue());
        }
        return this;
    }
}
