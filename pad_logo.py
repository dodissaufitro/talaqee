from PIL import Image
import sys

def create_padded_image(input_path, output_path, canvas_size, scale_factor):
    try:
        img = Image.open(input_path).convert("RGBA")
        
        # Calculate new size based on scale_factor
        aspect_ratio = img.width / img.height
        if img.width > img.height:
            new_width = int(canvas_size * scale_factor)
            new_height = int(new_width / aspect_ratio)
        else:
            new_height = int(canvas_size * scale_factor)
            new_width = int(new_height * aspect_ratio)
            
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Create white background
        bg = Image.new("RGBA", (canvas_size, canvas_size), (255, 255, 255, 255))
        
        # Calculate position to paste
        paste_x = (canvas_size - new_width) // 2
        paste_y = (canvas_size - new_height) // 2
        
        # Paste with alpha channel
        bg.paste(img, (paste_x, paste_y), img)
        
        bg.convert("RGB").save(output_path)
        print(f"Created {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    input_file = "public/logo/logo_app.talaqee.png"
    # Splash should be 2732x2732, icon 1024x1024
    create_padded_image(input_file, "assets/splash.png", 2732, 0.4) # Logo takes up 40% of splash
    create_padded_image(input_file, "assets/icon.png", 1024, 0.4)   # Logo takes up 70% of icon
