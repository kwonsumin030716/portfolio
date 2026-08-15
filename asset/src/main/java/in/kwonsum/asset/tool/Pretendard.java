package in.kwonsum.asset.tool;

import java.awt.Font;
import java.awt.GraphicsEnvironment;
import java.io.InputStream;

import in.kwonsum.asset.api.Discord;

public class Pretendard {
    
    public static Font getFont(String style, int size){
        
        try (InputStream is = Pretendard.class.getResourceAsStream("/fonts/PretendardGOV-" + style + ".ttf")){
            Font font = Font.createFont(Font.TRUETYPE_FONT, is);
            GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
                ge.registerFont(font);
            return font.deriveFont((float)size);
        } catch (Exception e) {
            Discord.printLog(e);
            return new Font("Malgun Gothic", Font.PLAIN, size);
        }
    }
}
