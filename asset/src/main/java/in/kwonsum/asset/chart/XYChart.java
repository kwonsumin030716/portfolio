package in.kwonsum.asset.chart;

import java.awt.BasicStroke;
import java.util.ArrayList;
import java.util.Collections;

import in.kwonsum.asset.tool.Pretendard;

public class XYChart<K> extends Chart{

    public LabelAngle labelAngle = LabelAngle.ROTATE_0;
    public ArrayList<XYData<K>> db = new ArrayList<>();
    
    public int margin = 200;
    public int thick = 100;
    public double max = -1000000000.0;
    public double min = 1000000000.0;
    public int lrMargin = (int)(width * 0.1);
    public int x0 = lrMargin;
    public int y0 = (int) (height * 0.7);
    public int y1 = (int)(titleHeight * 1.5);

    private Xaxis<K> x;
    private Yaxis y;

    public XYChart(String title) {
        super(title);
    }

    @SuppressWarnings("unchecked")
    public void add(Data data){
        if (data instanceof XYData<?> xyData && !((XYData<?>)data).isEmpty()) {
            db.add((XYData<K>) xyData);
            for(XYData<K> d : db){
                max = Math.max(max, Collections.max(d.values()));
                min = Math.min(min, Collections.min(d.values()));
            }
        }
    }

    public void plot(){
        y = new Yaxis(this);
        plotGrid();
        x = new Xaxis<K>(this);

        for(XYData<K> data : db){
            switch (data.mode) {
                case ChartMode.LINE:
                    plotLine(data); break;
                case ChartMode.DOT:
                    plotDot(data); break;
                case ChartMode.BAR:
                    plotBar(data); break;
                default:
                    break;
            }
            plotLabel(data);
        }
        g2d.setColor(BLACK);
        x.drawLine();
        if(y.min < 0) g2d.drawLine(x0, y.getY(0.0), x0 + x.width, y.getY(0.0));
    }

    private void plotLine(XYData<K> data){
        g2d.setColor(data.color);
        g2d.setStroke(new BasicStroke(3.0f));

        boolean isFirst = true;
        int prevX = 0;
        int prevY = 0;
        for(K o : new ArrayList<>(data.keySet())){
            if(isFirst){
                prevX = x.getX(o);
                prevY = y.getY(data.get(o));
                isFirst = false;
            }else{
                int currX = x.getX(o);
                int currY = y.getY(data.get(o));
                g2d.drawLine(prevX, prevY, currX, currY);
                prevX = currX;
                prevY = currY;
            }
        }
    }

    private void plotDot(XYData<K> data){
        g2d.setColor(data.color);
        int r = 5;
        for(K o : new ArrayList<>(data.keySet())){
            int xpos = x.getX(o);
            int ypos = y.getY(data.get(o));
            g2d.fillOval(xpos - r, ypos - r, r * 2,r * 2);
        }
    }

    private void plotBar(XYData<K> data){
        g2d.setColor(data.color);
        int barWidth = 0;
        if(x.count() > 0) barWidth = x.width / x.count() * data.width / 100;

        for(K o : new ArrayList<>(data.keySet())){
            int xpos = x.getX(o) - barWidth / 2;
            int ypos = y.getY(data.get(o));
            int y0 = y.getY(0.0);
            if(data.get(o) > 0){
                g2d.fillRect(xpos, ypos, barWidth, y0 - ypos);
            }else if(data.get(o) < 0){
                g2d.fillRect(xpos, y0 + 2, barWidth, ypos - y0);
            }
            
        }
    }

    private void plotLabel(XYData<K> data){
        if(!data.label) return;
        g2d.setColor(BLACK);
        g2d.setFont(Pretendard.getFont("Medium", 24));
        fm = g2d.getFontMetrics();
        LabelPosition pos = data.labelPos;

        int textHeight = fm.getAscent() - fm.getDescent();
        int y_corr = 30;
        if(pos == LabelPosition.OUT) y_corr *= -1;

        for(Object o : new ArrayList<>(data.keySet())){
            double value = data.get(o);
            int ypos = y.getY(value);
            if(pos == LabelPosition.BASE) ypos = y.getY(0.0);
            ypos += y_corr;
            if(value < 0 ) ypos -= 2 * y_corr;

            String s = String.format("%.1f", value);
            if(value >= 1000) s = String.format("%,.0f", value);

            int xpos = x.getX(o) - fm.stringWidth(s) / 2;
            g2d.drawString(s, xpos, ypos + textHeight / 2);
        }
    }

    private void plotGrid(){
        float[] dashPattern = {3.0f, 3.0f};
        g2d.setColor(BLACK);
        g2d.setStroke(new BasicStroke(
            1.0f,
            BasicStroke.CAP_BUTT,
            BasicStroke.JOIN_MITER,
            10.0f,
            dashPattern,
            0.0f
        ));

        for(double d : y.getLabels()){
            if(d != y.min) g2d.drawLine(x0, y.getY(d), width - x0, y.getY(d));
        }
    }

    public void setLabelAngle(LabelAngle a){
        labelAngle = a;
    }
}
