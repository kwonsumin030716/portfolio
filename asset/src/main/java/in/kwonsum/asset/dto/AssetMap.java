package in.kwonsum.asset.dto;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.TreeMap;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import com.google.gson.annotations.JsonAdapter;

@JsonAdapter(AssetMap.Adapter.class)
public class AssetMap extends TreeMap<LocalDate, Double>{

    public AssetMap(){

    }

    public static class Adapter implements JsonSerializer<AssetMap>, JsonDeserializer<AssetMap>{
        @Override
        public JsonElement serialize(AssetMap src, Type typeOfSrc, JsonSerializationContext context) {
            JsonObject o = new JsonObject();
            for(Map.Entry<LocalDate, Double> e : src.entrySet()){
                o.addProperty(e.getKey().toString(), e.getValue());
            }
            return o;
        }
        @Override
        public AssetMap deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
                throws JsonParseException {
            AssetMap am = new AssetMap();
            JsonObject o = json.getAsJsonObject();

            for(Map.Entry<String, JsonElement> e : o.entrySet()){
                LocalDate date = LocalDate.parse(e.getKey());
                Double value = e.getValue().getAsDouble();
                am.put(date, value);
            }

            return am;
        }
    }
}
