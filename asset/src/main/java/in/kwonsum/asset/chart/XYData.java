package in.kwonsum.asset.chart;

import java.awt.Color;
import java.util.TreeMap;

import in.kwonsum.asset.chart.Chart.ChartMode;
import in.kwonsum.asset.chart.Chart.LabelPosition;

public class XYData<K> extends TreeMap<K,Double> implements Chart.Data {

    public ChartMode mode = ChartMode.DOT;
    public Color color = Chart.BLACK;
    public int width = 50;
    public boolean label = false;
    public LabelPosition labelPos = LabelPosition.OUT;

    public XYData(){
    }

    public XYData(ChartMode mode, Color color){
        this.mode = mode;
        this.color = color;
    }

    public XYData(ChartMode mode, Color color, boolean label, LabelPosition labelPos){
        this(mode, color);
        this.label = label;
        this.labelPos = labelPos;
    }
}
