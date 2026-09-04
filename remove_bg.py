import sys
from PIL import Image

def remove_white_background(input_path, output_path, tolerance=220):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # Check if pixel is white/near-white
        if item[0] >= tolerance and item[1] >= tolerance and item[2] >= tolerance:
            # Make it transparent
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    remove_white_background('public/images/fortivex-logo.png', 'public/images/fortivex-logo-transparent.png')
    print("Successfully processed the image.")
