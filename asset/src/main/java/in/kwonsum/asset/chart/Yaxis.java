package in.kwonsum.asset.chart;

import java.awt.BasicStroke;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;

import in.kwonsum.asset.tool.Pretendard;

public class Yaxis{

    private Font font = Pretendard.getFont("Medium", 28);
    private Graphics2D g2d;

    private int x0;
    private int y0;
    private int width;
    private int height;

    public Double max;
    public Double min;
    public Double step;

    private int textHeight;
    
    public Yaxis(XYChart<?> chart){
        this.g2d = chart.g2d;
        this.x0 = chart.x0;
        this.y0 = chart.y0;
        this.width = (int)(chart.lrMargin / 10);
        this.height = chart.y0 - chart.y1;

        double range = Math.max(chart.max - chart.min, 0.0001);
        double rawStep = range / 8.0;
        double p = Math.pow(10, Math.floor(Math.log10(rawStep)));
        double fraction = rawStep / p;
        double niceFraction = 
            (fraction <= 1.0) ? 1.0 :
            (fraction <= 2.0) ? 2.0 :
            (fraction <= 5.0) ? 5.0 : 10.0;
        
        this.step = niceFraction * p;
        this.min = Math.floor(chart.min / this.step) * this.step;
        this.max = Math.ceil(chart.max / this.step) * this.step;
        

        g2d.setColor(Chart.BLACK);
        g2d.setStroke(new BasicStroke(4.0f));
        g2d.drawLine(x0, getY(min), x0, getY(max));

        g2d.setFont(font);
        FontMetrics fm = g2d.getFontMetrics();
        textHeight = fm.getAscent() - fm.getDescent();

        for(double d : getLabels()){
            String label = String.format("%.1f", d);
            if(d >= 1000) label = String.format("%,.0f", d);

            int stringWidth = fm.stringWidth(label);
            g2d.drawString(label, x0 - stringWidth - width, getY(d) + textHeight / 2);
        }
    }

    public int getY(Double v){
        return (int) Math.round(y0 - (v - min) / (max - min) * height);
    }

    public double[] getLabels(){
        double[] ret = new double[(int)((max - min) / step) + 1];
        for(int i = 0;i < ret.length; i ++){
            ret[i] = min + step * i;
        }
        return ret;
    }
}
