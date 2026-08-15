package in.kwonsum.asset.tool;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

import in.kwonsum.asset.api.Discord;
import in.kwonsum.asset.chart.Chart;
import in.kwonsum.asset.chart.Chart.ChartMode;
import in.kwonsum.asset.chart.Chart.LabelAngle;
import in.kwonsum.asset.chart.Chart.LabelPosition;
import in.kwonsum.asset.chart.CircleChart;
import in.kwonsum.asset.chart.CircleData;
import in.kwonsum.asset.chart.XYChart;
import in.kwonsum.asset.chart.XYData;
import in.kwonsum.asset.dto.*;

public class AssetManager {

    Map<String, Account> accMap;

    public double deposit = 0.0;
    public double rapidStandard = Double.parseDouble(FileManager.readEnv(FileManager.KEYPATH, "RAPID_STANDARD"));

    HashMap<String, Double> standard = new HashMap<>(Map.of(
        "379800",0.24,
        "294400",0.18,
        "283580",0.08,
        "453810",0.08,
        "411060",0.15,
        "308620",0.07,
        "453850",0.07,
        "385560",0.08,
        "KRW",0.05
    ));

    Map<String, String> toName = new LinkedHashMap<>(Map.of(
        "379800", "KODEX 미국S&P500",
        "294400", "KIWOOM 200TR",
        "283580", "차이나CSI300",
        "453810", "인도Nifty50",
        "411060", "KRX금현물",
        "308620", "미국10년국채선물",
        "453850", "미국30년국채액티브(H)",
        "385560", "KIS국고채30년",
        "KRW", "원화"
    ));

    public AssetManager() {
        accMap = loadAccount();

        for(Map.Entry<String, Account> e : accMap.entrySet()){
            deposit += e.getValue().deposit;
        }

        for(String name : accMap.keySet()){
            Account acc = accMap.get(name);
            List<BufferedImage> images = accountChart(name, acc);
            toFile(acc.accNum, getMergedImage(images));
            Discord.updateChart(name, acc.channelId, images);
            if(name.contains("*")) balancingTrade(acc);
            rapidSwing(acc);
        }

        List<BufferedImage> total = new ArrayList<>();
        total.add(totalWeightChart());
        total.add(totalTargetRateChart());
        total.add(totalMonthAllocation());
        total.add(totalMonthAsset());

        toFile("total", getMergedImage(total));
        Discord.updateTotalChart(total);


    }
    
    public Map<String, Account> loadAccount(){
        List<Map<String, String>> accList = FileManager.getAccountList();

        Map<String, Account> accMap = new HashMap<>();
        for(Map<String, String> m : accList){
            accMap.put(m.get("nickName"), new Account(m));
        }

        return accMap;
    }

    public String toFile(String name, BufferedImage img){
        try{
            File output = new File("src/main/resources/static/img/" + name + ".png");

            File parentDir = output.getParentFile();
            if (parentDir != null && !parentDir.exists()) parentDir.mkdirs(); 
            
            ImageIO.write(img, "png", output);
            return output.getPath();
        }catch(Exception e){
            Discord.printLog(e);
            return null;
        }
    }

    public BufferedImage getMergedImage(List<BufferedImage> images){
        int width = images.stream().mapToInt(BufferedImage::getWidth).max().orElse(0);
        int height = images.stream().mapToInt(BufferedImage::getHeight).sum();
        BufferedImage img = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = img.createGraphics();

        int y = 0;
        for(BufferedImage i : images){
            g2d.drawImage(i, 0, y, null);
            y += i.getHeight();
        }
        g2d.dispose();

        return img;
    }

    //계좌별 페이지 생성
    public List<BufferedImage> accountChart(String name, Account acc){
        List<BufferedImage> images = new ArrayList<>();

        //보유비중 
        CircleChart chart1 = new CircleChart(name + " 비중 현황");
        chart1.add(acc.toCircleWeight()); chart1.plot();
        images.add(chart1.getVirtualImage());

        //목표 수익률 달성도
        XYChart<String> chart2 = new XYChart<>(name + " 종목별 목표 수익률 달성 현황");
        chart2.setLabelAngle(LabelAngle.ROTATE_SW);
        XYData<String> red = new XYData<>(ChartMode.BAR, Chart.RED, true, LabelPosition.OUT);
        XYData<String> green = new XYData<>(ChartMode.BAR, Chart.GREEN, true, LabelPosition.OUT);
        XYData<String> blue = new XYData<>(ChartMode.BAR, Chart.BLUE);

        for(String code : acc.sm.getCodeList()){
            Stock s = acc.sm.get(code);
            double targetRate = Math.round(acc.getTargetRate(code) * 1000) / 10.0;
            double currRate = Math.round(s.getEarnRate() * 1000) / 10.0;
            if(targetRate > currRate){
                red.put(s.name, targetRate);
                blue.put(s.name, currRate);
            }else{
                green.put(s.name, currRate);
                blue.put(s.name, targetRate);
            }
        }
        chart2.add(red); chart2.add(green); chart2.add(blue); chart2.plot();
        images.add(chart2.getVirtualImage());

        if(name.contains("*")) images.add(weightCompareFromAcc(acc));

        return images;
    }

    //전 계좌 종목 비중 현황
    public BufferedImage totalWeightChart(){
        CircleChart chart = new CircleChart("총 보유 종목 비중 현황");
        CircleData data = new CircleData();
        for(Account acc : accMap.values()){
            CircleData temp = acc.toCircleWeight();
            for(String s : temp.keySet()){
                data.add(s, temp.get(s));
            }
        }
        chart.add(data.sort()); chart.plot();
        return chart.getVirtualImage();
    }

    //전 계좌 종목별 목표 수익률 달성 현황
    public BufferedImage totalTargetRateChart(){
        XYChart<String> chart = new XYChart<>("총 보유 종목 목표 수익률 달성 현황");
        chart.setLabelAngle(LabelAngle.ROTATE_SW);
        XYData<String> red = new XYData<>(ChartMode.BAR, Chart.RED, true, LabelPosition.OUT);
        XYData<String> green = new XYData<>(ChartMode.BAR, Chart.GREEN, true, LabelPosition.OUT);
        XYData<String> blue = new XYData<>(ChartMode.BAR, Chart.BLUE);
        for(Account acc : accMap.values()){
            StockMap sm = acc.sm;
            for(String code : sm.getCodeList()){
                Stock s = sm.get(code);
                double targetRate = Math.round(acc.getTargetRate(code) * 1000) / 10.0;
                double currRate = Math.round(s.getEarnRate() * 1000) / 10.0;
                if(targetRate > currRate){
                    red.put(s.name, targetRate);
                    blue.put(s.name, currRate);
                }else{
                    green.put(s.name, currRate);
                    blue.put(s.name, targetRate);
                }
            }
        }
        chart.add(red); chart.add(green); chart.add(blue); chart.plot();
        return chart.getVirtualImage();
    }
    
    //최근 1년 월별 배당금
    public BufferedImage totalMonthAllocation(){
        XYChart<String> chart = new XYChart<>("최근 1년 월별 배당금");
        chart.setLabelAngle(LabelAngle.ROTATE_SW);
        XYData<String> total = new XYData<>(ChartMode.LINE, Chart.BLUE, true, LabelPosition.OUT);

        for(Account acc : accMap.values()){
            XYData<String> data = acc.toMonthAllocation();
            chart.add(data);
            data.forEach((k,v) -> total.merge(k,v, Double::sum));
        }
        chart.add(total); chart.plot();
        return chart.getVirtualImage();
    }
    
    //총 자산 변동 추이
    public BufferedImage totalMonthAsset(){
        XYChart<String> chart = new XYChart<>("월별 자산");
        chart.setLabelAngle(LabelAngle.ROTATE_SW);
        XYData<String> total = new XYData<>(ChartMode.LINE, Chart.BLUE);
        for(Account acc : accMap.values()){
            XYData<String> data = acc.toMonthAsset();
            chart.add(data);
            data.forEach((k,v) -> total.merge(k,v,Double::sum));
        }
        chart.add(total); chart.plot();
        return chart.getVirtualImage();
    }

    //밸런싱
    public BufferedImage weightCompareFromAcc(Account acc){

        XYData<String> green = new XYData<String>(ChartMode.BAR, Chart.GREEN, true, LabelPosition.OUT);
        XYData<String> red = new XYData<String>(ChartMode.BAR, Chart.RED, true, LabelPosition.OUT);
        XYData<String> blue = new XYData<String>(ChartMode.BAR, Chart.BLUE);

        for(String code : standard.keySet()){
            double nowWeight = Math.round(acc.getTotalWeight(code) * 1000) / 10.0;
            double targetWeight = Math.round(standard.get(code)* 1000) / 10.0;
            String name = toName.get(code);

            if(nowWeight > targetWeight){
                green.put(name, nowWeight);
                blue.put(name, targetWeight);
            }else{
                red.put(name, targetWeight);
                blue.put(name, nowWeight);
            }
        }

        XYChart<String> chart = new XYChart<>(acc.nickName + " 밸런싱 체크");
        chart.add(green);
        chart.add(red);
        chart.add(blue);

        chart.setLabelAngle(LabelAngle.ROTATE_SW);
        chart.plot();
        return chart.getVirtualImage();
    }

    public void balancingTrade(Account acc){
        for(String code : standard.keySet()){
            if(!code.equals("KRW")){
                double target = acc.totalValue * standard.get(code);
                double now = acc.sm.get(code).getTotalValue();
                double cur = acc.sm.get(code).value;
                int tradeQty = (int) Math.floor((target - now) / cur);
                String message = "[밸런싱] " + toName.get(code) + " " + String.valueOf(Math.abs(tradeQty)) + "주 ";
                if(tradeQty > 1) message += "매수";
                else if(tradeQty < -1) message += "매도";
                Discord.sendMessage(acc.channelId, message);
            }
        }
    }

    public void rapidSwing(Account acc){
        for(String code : acc.sm.getCodeList()){
            double changeRate = acc.api.getChangeRate(code, LocalDate.now());
            String message = "[급등락] " + acc.sm.get(code).name + " " + changeRate + "%";
            if(rapidStandard < Math.abs(changeRate)) Discord.sendMessage(acc.channelId, message);
        }
    }
}
