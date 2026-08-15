package in.kwonsum.asset.dto;
import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.Map;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import com.google.gson.annotations.JsonAdapter;

import java.util.LinkedHashMap;

@JsonAdapter(Transaction.Adapter.class)
public class Transaction implements Comparable<Transaction>{

    public String code;
    public Double cost;
    public Double qty;
    public String askbid;
    public LocalDateTime orderTime;

    public Transaction(String code, double cost, double qty, String askbid, String orderTime){
        this(code, cost, qty, askbid, LocalDateTime.parse(orderTime));
    }

    public Transaction(String code, double cost, double qty, String askbid, LocalDateTime orderTime){
        this.code = code;
        this.cost = cost; //총 가격
        this.qty = qty;
        this.askbid = askbid;
        this.orderTime = orderTime;
    }

    public Transaction(Map<String, String> m){
        this(
            m.get("code"),
            Double.parseDouble(m.get("cost")),
            Double.parseDouble(m.get("qty")),
            m.get("askbid"),
            m.get("orderTime")
        );
    }

    public Transaction(){

    }

    public String toString(){
        String str = "[Transaction]";
        str = str.concat(" code: " + this.code);
        str = str.concat(" cost: " + this.cost);
        str = str.concat(" qty: " + this.qty);
        str = str.concat(" askbid: " + this.askbid);
        str = str.concat(" orderTime: " + this.orderTime + "\n");

        return str;
    }

    public Map<String, String> toMap(){
        Map<String, String> map = new LinkedHashMap<>();
        map.put("code", this.code);
        map.put("cost", this.cost.toString());
        map.put("qty", this.qty.toString());
        map.put("askbid", this.askbid);
        map.put("orderTime", orderTime.toString());

        return map;
    }

    @Override
    public int compareTo(Transaction other){
        return this.orderTime.isAfter(other.orderTime) ? 1 : -1;
    }

    public static class Adapter implements JsonSerializer<Transaction>, JsonDeserializer<Transaction>{
        @Override
        public JsonElement serialize(Transaction src, Type type, JsonSerializationContext context){
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("code", src.code);
            jsonObject.addProperty("cost", src.cost);
            jsonObject.addProperty("qty", src.qty);
            jsonObject.addProperty("askbid", src.askbid);
            jsonObject.addProperty("orderTime", src.orderTime.toString());
            return jsonObject;
        }

        @Override
        public Transaction deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
                throws JsonParseException {
            JsonObject jsonObject = json.getAsJsonObject();
            String code = jsonObject.get("code").getAsString();
            double cost = jsonObject.get("cost").getAsDouble();
            double qty = jsonObject.get("qty").getAsDouble();
            String askbid = jsonObject.get("askbid").getAsString();
            String orderTime = jsonObject.get("orderTime").getAsString();

            return new Transaction(code, cost, qty, askbid, orderTime);
        }
    }
}
