package in.kwonsum.asset.chart;

import java.awt.BasicStroke;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.geom.Line2D;
import java.awt.Color;

import in.kwonsum.asset.tool.Pretendard;

public class CircleChart extends Chart{

    private CircleData data;

    private int centerX = width / 2;
    private int centerY = (int) ((height + titleHeight) / 2);
    private int radius = (int) (centerY * 0.6);
    private int spaceRadius = (int) (radius * 0.4);

    public CircleChart(String title) {
        super(title);
    }

    public void add(Data data){
        if (data instanceof CircleData) this.data = (CircleData) data;
    }

    public void plot(){
        drawCircle(g2d, centerX, centerY, radius, BLUE);
        drawCircle(g2d, centerX, centerY, spaceRadius, WHITE);

        double startAngle = 90;
        for (int i = 0; i < data.size(); i++) {
            double arcAngle = data.getRate(i) * 360.0;
            startAngle += arcAngle;
            drawLine(g2d, centerX, centerY, radius, startAngle, WHITE);
            writeRatio(g2d, arcAngle, centerX, centerY, startAngle - arcAngle / 2, (int)(radius * 0.7));
            if(arcAngle > 4.8){
                drawlabel(g2d, data.getLabel(i), arcAngle, centerX, centerY, startAngle - arcAngle / 2, radius);
                drawConnect(g2d, data.getLabel(i), arcAngle, centerX, centerY, startAngle - arcAngle / 2, radius);
            }
        }
        writeTotalValue(g2d, centerX, centerY, data.totalValue);
    }

    private void drawCircle(Graphics2D g2d, int centerX, int centerY, int radius, Color color){
        g2d.setColor(color);
        g2d.fillArc(centerX - radius, centerY - radius, radius * 2, radius * 2, 0, 360);
    }

    private void drawLine(Graphics2D g2d, int centerX, int centerY, int radius, double angle, Color color) {
        double radian = Math.toRadians(angle);
        int endX = centerX + (int) (radius * 1.001 * Math.cos(radian));
        int endY = centerY - (int) (radius * 1.001 * Math.sin(radian));

        g2d.setColor(color);
        g2d.setStroke(new BasicStroke(5));
        g2d.draw(new Line2D.Double(centerX, centerY, endX, endY));
    }

    private void writeRatio(Graphics2D g2d, double ratio, int centerX, int centerY, double positionAngle, int radius) {
        if(ratio / 3.6 < 5) return;
        String text = String.format("%.1f%%", ratio / 3.6);
        g2d.setFont(Pretendard.getFont("Bold", 32));
        FontMetrics fm = g2d.getFontMetrics();
        int textWidth = fm.stringWidth(text);

        double radian = Math.toRadians(positionAngle);
        int labelX = centerX + (int) (radius * Math.cos(radian)) - textWidth / 2;
        int labelY = centerY - (int) (radius * Math.sin(radian)) + (fm.getAscent() - fm.getDescent()) / 2;

        g2d.setColor(WHITE);
        g2d.drawString(text, labelX, labelY);
    }

    private void drawlabel(Graphics2D g2d, String text, double ratio, int centerX, int centerY, double positionAngle, int radius) {
        double r = 1.05;
        g2d.setFont(Pretendard.getFont("Medium", 24));
        FontMetrics fm = g2d.getFontMetrics();
        double radian = Math.toRadians(positionAngle);
        int margin = centerX / 50;
        int labelX = (int)(positionAngle > 90 && positionAngle < 270 ? centerX - radius * r - margin - fm.stringWidth(text) : centerX + radius * r + margin);
        int labelY = centerY - (int) (radius * r * Math.sin(radian)) + (fm.getAscent() - fm.getDescent()) / 2;
        if(ratio < 5) labelY -= 2 / ratio * centerY / 10;
        g2d.setColor(BLACK);
        g2d.drawString(text, labelX, labelY);
    }

    private void drawConnect(Graphics2D g2d, String text, double ratio, int centerX, int centerY, double positionAngle, int radius) {
        int margin = centerX / 60;
        double r = 1.05;
        double radian = Math.toRadians(positionAngle);
        int startX = centerX + (int) (radius * 1.01 * Math.cos(radian));
        int startY = centerY - (int) (radius * 1.01 * Math.sin(radian));
        int endX = (int)(positionAngle > 90 && positionAngle < 270 ? centerX - radius * r - margin: centerX + radius * r + margin);
        int endY = centerY - (int) (radius * r * Math.sin(radian));
        if(ratio < 5) endY -= 2 / ratio * centerY / 10;

        g2d.setColor(BLACK);
        g2d.setStroke(new BasicStroke(1));
        g2d.draw(new Line2D.Double(startX, startY, endX, endY));
    }

    private void writeTotalValue(Graphics2D g2d, int centerX, int centerY, double totalValue){
        String text = String.format("%,d원", (int) totalValue);
        g2d.setFont(Pretendard.getFont("Bold", 36));
        FontMetrics fm = g2d.getFontMetrics();
        int textWidth = fm.stringWidth(text);
        int textHeight = fm.getAscent() - fm.getDescent();

        int labelX = centerX - textWidth / 2;
        int labelY = centerY + textHeight / 2;

        g2d.setColor(BLACK);
        g2d.drawString(text, labelX, labelY);
    }
}
