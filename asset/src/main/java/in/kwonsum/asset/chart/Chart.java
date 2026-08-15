package in.kwonsum.asset.chart;

import java.awt.Color;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.File;

import javax.imageio.ImageIO;

import in.kwonsum.asset.api.Discord;


public abstract class Chart{

    public enum ChartMode {LINE, DOT, BAR}
    public enum LabelPosition {OUT, IN, BASE}
    public enum LabelAngle {ROTATE_0, ROTATE_SW, ROTATE_S, ROTATE_SE}

    public static final Color WHITE = Color.decode("#F0F2F5");
    public static final Color BLUE = Color.decode("#1F41B0");
    public static final Color BLACK = Color.decode("#1A1D29");
    public static final Color GREEN = Color.decode("#05A66B");
    public static final Color RED = Color.decode("#E34054");

    private BufferedImage frame;
    protected Graphics2D g2d;
    protected FontMetrics fm;
    protected int width = 1920;
    protected int height = 1080;

    public int titleHeight = (int) (height * 0.1);
    private Title title;
    
    public Chart(String title){
        frame = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        g2d = frame.createGraphics();
        fm = g2d.getFontMetrics();

        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);

        g2d.fillRect(0,0, width, height);

        this.title = new Title(g2d, title, titleHeight);

    }

    public abstract void plot();
    public abstract void add(Data d);

    public String getImage(){
        try{
            File output = new File("img/" + title.getTitle() + ".png");
            ImageIO.write(frame, "png", output);
            return output.getPath();
        }catch(Exception e){
            Discord.printLog(e);
            return null;
        }
    }

    public BufferedImage getVirtualImage(){
        return frame;
    }

    public interface Data{

    }
}
