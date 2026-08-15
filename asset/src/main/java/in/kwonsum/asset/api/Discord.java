package in.kwonsum.asset.api;

import java.awt.BasicStroke;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.imageio.ImageIO;

import com.google.gson.Gson;

import in.kwonsum.asset.chart.Chart;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.Request;
import okhttp3.RequestBody;
import in.kwonsum.asset.tool.FileManager;
import in.kwonsum.asset.tool.Pretendard;
import in.kwonsum.asset.dto.Account;
import in.kwonsum.asset.dto.AllocSet;
import in.kwonsum.asset.dto.Transaction;


public class Discord extends Api{
    private static final String baseURL = "https://discord.com/api/v10/";
    private static Gson gson = new Gson();

    private static String botToken = FileManager.readEnv(FileManager.KEYPATH, "DISCORD_BOT_TOKEN");
    private static String logChannelId = FileManager.readEnv(FileManager.KEYPATH, "LOG_CHANNEL_ID");

    private static final Map<String, String> HEADERS = Map.ofEntries(
        Map.entry("Authorization", "Bot " + botToken),
        Map.entry("User-Agent", "DiscordBot (https://github.com, 1.0.0)")
    );

    // private static final Map<String, String> CHANNEL_ID = Map.ofEntries(
    //     Map.entry("일반계좌", "1526111512765141106"),
    //     Map.entry("연금저축", "1526279750572572812"),
    //     Map.entry("ISA", "1526279817396490352"),
    //     Map.entry("UPBIT", "1526279834383155251"),
    //     Map.entry("총 자산", "1526279864561303712")
    // );
    private static LocalDateTime lastRequest = LocalDateTime.now();

    public Discord(){
        
    }

    public static void updateTotalChart(List<BufferedImage> images){
        updateChart("총 자산", FileManager.readEnv(FileManager.KEYPATH, "TOTAL_CHANNEL_ID"), images);
    }

    public static void updateChart(String name, String id, List<BufferedImage> images){
        cleanChat(id);
        int margin = 100;
        int width = 1920;
        int height = 200;
        BufferedImage banner = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = banner.createGraphics();
        g2d.setFont(Pretendard.getFont("ExtraBold", 70));
        g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        FontMetrics fm = g2d.getFontMetrics();
        
        int textBase = (height - fm.getHeight()) / 2 + fm.getAscent();

        g2d.setColor(Chart.WHITE);
        g2d.fillRect(0, 0, width, height);

        g2d.setColor(Chart.BLUE);
        g2d.setStroke(new BasicStroke(16.0f));
        g2d.drawLine(margin, (int) (textBase * 1.1), margin, height - (int)(textBase * 1.1));

        g2d.setColor(Chart.BLACK);
        g2d.drawString(name, margin + 50, textBase);

        String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yy.MM.dd HH:mm:ss"));
        int x = fm.stringWidth(time);
        g2d.drawString(time, width - x - margin, textBase);

        g2d.dispose();

        sendImage(id, banner);
        sendImage(id, images);
    }

    @SuppressWarnings("unchecked")
    public static void cleanChat(String id){
        String url = baseURL + "channels/" + id + "/messages?limit=100";

        sleep();
        Map<String, String> response = requestGet(url, HEADERS, null);
        String body = response.get("body");
      
        List<Map<String,String>> chatList = gson.fromJson(body, List.class);
        List<Long> idList = chatList.stream().map(map -> Long.parseLong(map.get("id"))).toList();
        if(idList.isEmpty()) return;
        Map<String, Object> params = new HashMap<>();
        params.put("messages", idList);

        sleep();
        String deleteUrl = baseURL + "channels/" + id + "/messages/bulk-delete";
        requestPost(deleteUrl, HEADERS, (Map<String, String>)(Map)params);        
    }

    public static void printLog(String s){
        sendMessage(logChannelId, s);
//        System.out.println(s);
    }

    public static void printLog(Exception e){
        StringWriter sw = new StringWriter();
        e.printStackTrace(new PrintWriter(sw));
        printLog(sw.toString());
    }

    public static void sendMessage(String id, String s){
        String url = baseURL + "channels/" + id + "/messages";
        send(url, s);
    }

    public static void send(String url, String s){
        if(s.length() > 2000) s = s.substring(0, 1999);
        Map<String, String> params = new HashMap<>();
        params.put("content", s);
        sleep();
        requestPost(url, HEADERS, params);
    }

    public static void sendImage(String id, BufferedImage img){
        List<BufferedImage> images = new ArrayList<>();
        images.add(img);
        sendImage(id, images);
    }

    public static void sendImage(String id, List<BufferedImage> images){
        String url = baseURL + "channels/" + id + "/messages";

        try{
            for(int i=0; i<images.size(); i++){
                MultipartBody.Builder mpBuilder = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM);
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(images.get(i), "png", baos);
                byte[] imageBytes = baos.toByteArray();
                RequestBody imageBody = RequestBody.create(imageBytes, MediaType.parse("image/png"));
                mpBuilder.addFormDataPart("files", id + (i+1) + ".png", imageBody);

                Request.Builder requestBuilder = new Request.Builder()
                    .url(url)
                    .post(mpBuilder.build());
                HEADERS.forEach(requestBuilder::addHeader);
                sleep();
                execute(requestBuilder.build());
            }
        }catch(Exception e){
            printLog(e);
        }
    }

    public static void sleep(){
        while(LocalDateTime.now().isBefore(lastRequest.plusNanos(300 * 1000000L))){
            try{
                Thread.sleep(50);
            }catch(Exception e){
                printLog(e);
            }
        }
        lastRequest = LocalDateTime.now();
    }

    @Override
    public String getStockName(String code) {
        throw new UnsupportedOperationException("Unimplemented method 'getStockName'");
    }
    @Override
    public double getCurrent(String code) {
        throw new UnsupportedOperationException("Unimplemented method 'getCurrent'");
    }
    @Override
    public void setBalance(Account acc) {
        throw new UnsupportedOperationException("Unimplemented method 'setBalance'");
    }
    @Override
    public List<Transaction> getTransactions(Account acc, LocalDate start, LocalDate end) {
        throw new UnsupportedOperationException("Unimplemented method 'getTransactions'");
    }
    @Override
    public AllocSet getAllocations(Account acc, LocalDate start, LocalDate end) {
        throw new UnsupportedOperationException("Unimplemented method 'getAllocations'");
    }
    @Override
    public double getPrevValue(String code, LocalDate date) {
        throw new UnsupportedOperationException("Unimplemented method 'getPrevValue'");
    }

    @Override
    public double getChangeRate(String code, LocalDate date) {
        throw new UnsupportedOperationException("Unimplemented method 'getChangeRate'");
    }
}
