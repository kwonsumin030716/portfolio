package in.kwonsum.asset.chart;

import java.awt.BasicStroke;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;

import in.kwonsum.asset.tool.Pretendard;

public class Title{

    private static final Font font = Pretendard.getFont("Bold", 54);

    private String title;
    private int leftmargin = 100; 
    private int h0;
    private int textHeight;

    public Title(Graphics2D g2d, String title, int height){
        this.title = title;

        g2d.setFont(font);
        FontMetrics metrics = g2d.getFontMetrics();
        textHeight = metrics.getAscent() - metrics.getDescent();
        h0 = (int) (height / 2 + textHeight / 2);

        drawLine(g2d);
        writeTitle(g2d);
    }

    private void drawLine(Graphics2D g2d){
        g2d.setStroke(new BasicStroke(10.0f));
        g2d.setColor(Chart.BLUE);
        g2d.drawLine(leftmargin, h0 - textHeight - 10, leftmargin, h0 + 10);
    }

    private void writeTitle(Graphics2D g2d){
        g2d.setColor(Chart.BLACK);
        g2d.drawString(title, leftmargin + 20, h0);
    }

    public String getTitle(){
        return this.title;
    }
}
