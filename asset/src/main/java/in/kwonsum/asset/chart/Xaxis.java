package in.kwonsum.asset.chart;

import java.awt.BasicStroke;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.TreeMap;

import in.kwonsum.asset.chart.Chart.LabelAngle;
import in.kwonsum.asset.tool.Pretendard;

public class Xaxis<K>{

    private final Comparator<String> smartComp = (s1, s2) -> {
        try{
            return Integer.compare(Integer.parseInt(s1), Integer.parseInt(s2));
        }catch(NumberFormatException e1){
            try{
                return Double.compare(Double.parseDouble(s1), Double.parseDouble(s2));
            }catch(NumberFormatException e2){
                return s1.compareTo(s2);
            }
        }
    };
    private TreeMap<String, Integer> xMap = new TreeMap<>(smartComp);
    private Font font = Pretendard.getFont("Medium", 24);
    private Graphics2D g2d;
    private FontMetrics fm;

    private LabelAngle labelAngle = LabelAngle.ROTATE_0;

    private int x0;
    private int y0;
    public int width;

    public Xaxis(XYChart<K> chart){
        g2d = chart.g2d;
        fm = g2d.getFontMetrics();
        x0 = chart.x0;
        y0 = chart.y0;
        width = (int)(chart.width - x0 * 2);

        labelAngle = chart.labelAngle;
        setXmap(chart.db);
    }

    public void drawLine(){
        g2d.setColor(Chart.BLACK);
        g2d.setStroke(new BasicStroke(4.0f));
        g2d.drawLine(x0, y0, x0 + width, y0);
    }

    private void setXmap(ArrayList<XYData<K>> db){
        for(XYData<K> d : db){
            for(K k : d.keySet()){
                String s = String.valueOf(k);
                if(! xMap.containsKey(s)) xMap.put(s, 0);
            }
        }

        int textHeight = y0 + fm.getAscent() - fm.getDescent() + 30;
        int size = (int) (width / xMap.size());
        double index = 0.5;
        for(String s : xMap.keySet()){
            int xpos = (int)(x0 + size * index++);
            xMap.replace(s, xpos);
            writeLabel(s, xpos, textHeight);
        }
    }

    private void writeLabel(String s, int x, int y){
        g2d.setFont(font);
        fm = g2d.getFontMetrics();
        double angle = 0.0;
        int xpos = x;
        int ypos = y;

        switch(labelAngle){
            case ROTATE_0:
                xpos -= fm.stringWidth(s) / 2;
                break;
            case ROTATE_SW:
                angle = Math.toRadians(-45);
                xpos -= fm.stringWidth(s) - 10;
                break;
            case ROTATE_S:
                angle = Math.toRadians(90);
                xpos -= 20;
                break;
            case ROTATE_SE:
                angle = Math.toRadians(45);
                xpos -= 10;
                break;
            default:
                break;
        }

        g2d.rotate(angle, x, y);
        g2d.drawString(s, xpos, ypos);
        g2d.rotate(-angle, x, y);
        
    }

    public int getX(Object o){
        return xMap.get(String.valueOf(o));
    }

    public int count(){
        return xMap.size();
    }
}
