import mss
import mss.tools

def takeFullScreenshot():
    filename = mss.mss().shot(mon=-1, output='capturedImage.png')
    print(filename)


