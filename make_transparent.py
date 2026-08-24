import sys
from PIL import Image

def make_white_transparent(img_path):
    try:
        img = Image.open(img_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Check if pixel is white or very close to white
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                newData.append((255, 255, 255, 0)) # transparent
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(img_path, "PNG")
        print("Success")
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    make_white_transparent(sys.argv[1])
