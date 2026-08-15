package in.kwonsum.asset.dto;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import com.google.gson.annotations.JsonAdapter;
import com.google.gson.reflect.TypeToken;

@JsonAdapter(TQueue.Adapter.class)
public class TQueue extends ArrayList<Transaction>{

    public TQueue(){

    }

    //마지막 거래시간 반환
    public LocalDateTime getLastOrderTime(){
        if(size() == 0) return null;
        Collections.sort(this);
        return get(size()-1).orderTime;
    }

    //거래 기록 추가
    public boolean add(Transaction t){

        if(size() != 0 && getLastOrderTime().isAfter(t.orderTime)) return false;

        if(t.askbid.equals("매수")){
            super.add(t);
        }else{
            Collections.sort(this);
            Iterator<Transaction> it = this.iterator();

            while(it.hasNext()){
                Transaction token = it.next();
                if(token.code.equals(t.code)){
                    if(token.qty > t.qty){
                        token.cost /= token.qty;
                        token.qty -= (double) Math.round(t.qty);
                        token.cost = (double) Math.round(token.cost * token.qty);
                        t.qty = 0.0;
                    }else{
                        t.qty -= token.qty;
                        it.remove();
                    }
                }
                if(t.qty < 0.00001) return true;
            }
        }
        return false;
    }

    public LocalDate getFirstBuyDate(String code){
        LocalDate buyDate = LocalDate.now();
        for(Transaction t : this){
            LocalDate temp = t.orderTime.toLocalDate();
            if(code.equals(t.code) && buyDate.isAfter(temp)) buyDate = temp;
        }
        return buyDate;
    }

    //특정 종목 보유 기간 반환 (연 단위)
    public double getPeriod(String code){
        return ChronoUnit.DAYS.between(getFirstBuyDate(code), LocalDate.now()) / 365.0;
    }

    //특정 종목 비용 반환
    public double getCost(String code){
        double sum = 0.0;
        for(Transaction t : this){
            if(t.code.equals(code)) sum += t.cost;
        }
        return sum;
    }

    public String toString(){
        String ret = "[TQUEUE]\n";
        for(Transaction t : this){
            ret += t.toString();
        }
        return ret + "\n";
    }

    public static class Adapter implements JsonSerializer<TQueue>, JsonDeserializer<TQueue> {
        @Override
        public JsonElement serialize(TQueue src, Type typeOfSrc, JsonSerializationContext context) {
            return context.serialize(new ArrayList<Transaction>(src));
        }
        @Override
        public TQueue deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
            TQueue tQueue = new TQueue();
 
            Type listType = new TypeToken<List<Transaction>>(){}.getType();
            List<Transaction> tempList = context.deserialize(json, listType);
            
            if (tempList != null) tQueue.addAll(tempList);
            return tQueue;
        }
    }
}
