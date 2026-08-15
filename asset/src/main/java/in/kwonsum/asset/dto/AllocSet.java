package in.kwonsum.asset.dto;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import com.google.gson.annotations.JsonAdapter;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import in.kwonsum.asset.dto.AllocSet.Alloc;

@JsonAdapter(AllocSet.Adapter.class)
public class AllocSet extends HashSet<Alloc>{
    
    @JsonAdapter(Alloc.Adapter.class)
    public static class Alloc{
        public String code;
        public LocalDate date;
        public double value;

        public Alloc(String code, LocalDate date, double value){
            this.code = code;
            this.date = date;
            this.value = value;
        }

        public Map<String, String> toMap(){
            Map<String, String> field = new HashMap<>();
            field.put("code", code);
            field.put("date", date.toString());
            field.put("value", String.valueOf(value));
            return field;
        }

        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null || getClass() != obj.getClass()) return false;
            Alloc a = (Alloc) obj;
            return Objects.equals(this.code, a.code) && 
                   (this.date != null && this.date.isEqual(a.date));
        }

        @Override
        public int hashCode() {
            return Objects.hash(code, date);
        }

        @Override
        public String toString(){
            return code + "/ " + date + "/" + value + "\n";
        }

        public static class Adapter implements JsonSerializer<Alloc>, JsonDeserializer<Alloc>{
            @Override
            public JsonElement serialize(Alloc src, Type typeOfSrc, JsonSerializationContext context) {
                JsonObject o = new JsonObject();
                o.addProperty("code", src.code);
                o.addProperty("date", src.date.toString());
                o.addProperty("value", src.value);
                return o;
            }
            @Override
            public Alloc deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
                    throws JsonParseException {
                JsonObject o = json.getAsJsonObject();
                String code = o.get("code").getAsString();
                LocalDate date = LocalDate.parse(o.get("date").getAsString());
                double value = o.get("value").getAsDouble();
                return new Alloc(code, date, value);
            }
        }
    }

    public AllocSet(){

    }

    public double getStockAllocs(String code, LocalDate date){
        double sum = 0.0;
        for(Alloc a : this){
            if(code.equals(a.code) && date.isBefore(a.date)) sum += a.value;
        }
        return sum;
    }

    public double getPeriodAllocs(LocalDate start, LocalDate end){
        double sum = 0.0;
        for(Alloc a : this){
            if(!a.date.isBefore(start) && !a.date.isAfter(end)){
                sum += a.value;
            }
        }
        return sum;
    }

    public static class Adapter implements JsonSerializer<AllocSet>, JsonDeserializer<AllocSet>{
        @Override
        public JsonElement serialize(AllocSet src, Type typeOfSrc, JsonSerializationContext context) {
            return context.serialize(new HashSet<Alloc>(src)); 
        }

        @Override
        public AllocSet deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
                throws JsonParseException {
            Set<Alloc> tempSet = context.deserialize(json, new TypeToken<Set<Alloc>>(){}.getType());
            AllocSet allocSet = new AllocSet();
            if (tempSet != null) allocSet.addAll(tempSet);
            return allocSet;
        }
    }
    
    
}
