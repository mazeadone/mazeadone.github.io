"""
ACM QR Scavenger Hunt - Styled QR Code Generator
Creates Nickelodeon-themed QR codes with slime green and orange colors
"""

import qrcode
from PIL import Image, ImageDraw, ImageFont
import os

# Your GitHub Pages URL (change this to your actual domain)
BASE_URL = "https://mazeadone.github.io"

# Hunt locations and their QR codes
QR_CODES = {
    "1-starter-russell-union": {
        "url": f"{BASE_URL}/hunt/1.html",
        "title": "START HERE",
        "location": "Russell Union / ACM Table",
        "emoji": "🏛️",
        "color": "#ff6f00",  # Orange
        "label": "CLUE 1"
    },
    "2-lakeside-dining": {
        "url": f"{BASE_URL}/hunt/2.html",
        "title": "SCAN ME",
        "location": "Lakeside Dining Hall",
        "emoji": "🍽️",
        "color": "#6bd425",  # Slime green
        "label": "CLUE 2"
    },
    "3-it-building": {
        "url": f"{BASE_URL}/hunt/3.html",
        "title": "SCAN ME",
        "location": "IT Building",
        "emoji": "💻",
        "color": "#6bd425",  # Slime green
        "label": "CLUE 3"
    },
    "4-iab-building": {
        "url": f"{BASE_URL}/hunt/4.html",
        "title": "SCAN ME",
        "location": "IAB Building",
        "emoji": "🌳",
        "color": "#6bd425",  # Slime green
        "label": "CLUE 4"
    },
    "5-finish": {
        "url": f"{BASE_URL}/hunt/done.html",
        "title": "YOU DID IT!",
        "location": "Return to ACM Table",
        "emoji": "🏁",
        "color": "#00a7ff",  # Blue
        "label": "FINISH"
    }
}

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_styled_qr(filename, config):
    """Create a styled QR code with Nickelodeon theme"""
    
    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=15,
        border=2,
    )
    qr.add_data(config['url'])
    qr.make(fit=True)
    
    # Generate QR image with custom colors
    primary_color = hex_to_rgb(config['color'])
    qr_img = qr.make_image(fill_color=primary_color, back_color="white")
    
    # Create poster-style image (8.5" x 11" at 300 DPI = 2550 x 3300 pixels)
    # Using smaller size for web/screen: 850 x 1100
    poster_width = 850
    poster_height = 1100
    poster = Image.new('RGB', (poster_width, poster_height), color='#fffaf3')
    
    # Draw colorful header
    draw = ImageDraw.Draw(poster)
    header_height = 180
    
    # Header background (gradient effect with rectangles)
    for i in range(header_height):
        alpha = i / header_height
        color_rgb = primary_color
        draw.rectangle(
            [(0, i), (poster_width, i+1)],
            fill=color_rgb
        )
    
    # Try to use a bold font, fallback to default
    try:
        title_font = ImageFont.truetype("arial.ttf", 70)
        label_font = ImageFont.truetype("arialbd.ttf", 50)
        location_font = ImageFont.truetype("arial.ttf", 40)
        emoji_font = ImageFont.truetype("seguiemj.ttf", 80)
    except:
        title_font = ImageFont.load_default()
        label_font = ImageFont.load_default()
        location_font = ImageFont.load_default()
        emoji_font = ImageFont.load_default()
    
    # Draw emoji at top
    emoji_text = config['emoji']
    try:
        emoji_bbox = draw.textbbox((0, 0), emoji_text, font=emoji_font)
        emoji_width = emoji_bbox[2] - emoji_bbox[0]
        draw.text(
            ((poster_width - emoji_width) // 2, 20),
            emoji_text,
            fill='white',
            font=emoji_font
        )
    except:
        pass
    
    # Draw title text
    title_text = config['title']
    try:
        title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
        title_width = title_bbox[2] - title_bbox[0]
        draw.text(
            ((poster_width - title_width) // 2, 110),
            title_text,
            fill='white',
            font=title_font,
            stroke_width=3,
            stroke_fill='#141414'
        )
    except:
        draw.text((poster_width // 2 - 100, 120), title_text, fill='white')
    
    # Add decorative border under header
    draw.rectangle(
        [(0, header_height), (poster_width, header_height + 15)],
        fill='#141414'
    )
    
    # Add label badge
    badge_y = 220
    badge_width = 250
    badge_height = 60
    badge_x = (poster_width - badge_width) // 2
    
    # Draw rounded rectangle for badge
    draw.rounded_rectangle(
        [(badge_x, badge_y), (badge_x + badge_width, badge_y + badge_height)],
        radius=30,
        fill='#141414',
        outline=primary_color,
        width=5
    )
    
    label_text = config['label']
    try:
        label_bbox = draw.textbbox((0, 0), label_text, font=label_font)
        label_width = label_bbox[2] - label_bbox[0]
        draw.text(
            ((poster_width - label_width) // 2, badge_y + 12),
            label_text,
            fill=primary_color,
            font=label_font
        )
    except:
        draw.text((poster_width // 2 - 50, badge_y + 15), label_text, fill=primary_color)
    
    # Resize and paste QR code
    qr_size = 550
    qr_img = qr_img.resize((qr_size, qr_size), Image.Resampling.LANCZOS)
    qr_x = (poster_width - qr_size) // 2
    qr_y = 320
    
    # Add white background for QR
    qr_bg_padding = 20
    draw.rounded_rectangle(
        [(qr_x - qr_bg_padding, qr_y - qr_bg_padding),
         (qr_x + qr_size + qr_bg_padding, qr_y + qr_size + qr_bg_padding)],
        radius=20,
        fill='white',
        outline='#141414',
        width=5
    )
    
    poster.paste(qr_img, (qr_x, qr_y))
    
    # Location text
    location_y = qr_y + qr_size + 50
    location_text = config['location']
    try:
        location_bbox = draw.textbbox((0, 0), location_text, font=location_font)
        location_width = location_bbox[2] - location_bbox[0]
        draw.text(
            ((poster_width - location_width) // 2, location_y),
            location_text,
            fill='#141414',
            font=location_font
        )
    except:
        draw.text((poster_width // 2 - 100, location_y), location_text, fill='#141414')
    
    # Instructions
    instructions = "SCAN WITH YOUR PHONE CAMERA"
    try:
        inst_bbox = draw.textbbox((0, 0), instructions, font=location_font)
        inst_width = inst_bbox[2] - inst_bbox[0]
        draw.text(
            ((poster_width - inst_width) // 2, location_y + 60),
            instructions,
            fill='#666',
            font=ImageFont.truetype("arial.ttf", 28) if title_font != ImageFont.load_default() else ImageFont.load_default()
        )
    except:
        draw.text((poster_width // 2 - 100, location_y + 60), instructions, fill='#666')
    
    # Footer
    footer_text = "ACM @ Organization Fair"
    footer_y = poster_height - 60
    try:
        footer_bbox = draw.textbbox((0, 0), footer_text, font=location_font)
        footer_width = footer_bbox[2] - footer_bbox[0]
        draw.text(
            ((poster_width - footer_width) // 2, footer_y),
            footer_text,
            fill='#999',
            font=ImageFont.truetype("arial.ttf", 24) if title_font != ImageFont.load_default() else ImageFont.load_default()
        )
    except:
        draw.text((poster_width // 2 - 100, footer_y), footer_text, fill='#999')
    
    # Save
    poster.save(filename, quality=95, dpi=(300, 300))
    print(f"✅ Created {filename}")
    return poster

def main():
    """Generate all QR codes"""
    print("🎨 ACM Hunt QR Code Generator")
    print("=" * 50)
    print(f"Base URL: {BASE_URL}")
    print("=" * 50)
    
    # Create output directory
    output_dir = "qr_codes"
    os.makedirs(output_dir, exist_ok=True)
    
    for filename, config in QR_CODES.items():
        output_path = os.path.join(output_dir, f"{filename}.png")
        print(f"\n📱 Generating: {config['label']}")
        print(f"   URL: {config['url']}")
        print(f"   Location: {config['location']}")
        
        create_styled_qr(output_path, config)
    
    print("\n" + "=" * 50)
    print(f"🎉 All QR codes saved to './{output_dir}/' folder")
    print("\n📋 Next steps:")
    print("1. Open the 'qr_codes' folder")
    print("2. Print each PNG file on 8.5x11\" paper (letter size)")
    print("3. Laminate with clear tape or use page protectors")
    print("4. Tape to walls at each location (see QR_CODE_SETUP.md)")
    print("\n✨ Your QR codes are Nickelodeon-styled and ready to go!")

if __name__ == "__main__":
    main()
