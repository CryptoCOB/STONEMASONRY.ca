"""
TEST VERSION - Image Enhancement & Watermarking Script for Simcoe Stone Masonry

This version processes ONLY ONE IMAGE for testing purposes.
"""

import shutil
import sys
from pathlib import Path
from typing import Any, Dict

# --- Use Pillow (PIL) for image manipulation ---
try:
    from PIL import Image, ImageEnhance

    print("✅ Pillow (PIL) library is available.")
except ImportError:
    print("❌ Pillow (PIL) library not found. Please install it to continue.")
    print("➡️  Run this command in your terminal: pip install Pillow")
    sys.exit(1)

# ==============================================================================
# TEST CONFIGURATION - Only process one image
# ==============================================================================
CONFIG: Dict[str, Any] = {
    "images_dir": Path("./public/images"),
    "backup_dir": Path("./public/images/originals"),
    "watermark_file": Path("./public/images/SSM-watermark.png"),
    "test_image": "fireplace.png",  # ONLY process this one image
    "supported_formats": [".jpg", ".jpeg", ".png", ".webp"],
    # --- Watermark Settings ---
    "opacity": 1.0,  # FULL opacity for maximum visibility
    "margin_percent": 0.02,  # 2% margin from the edge
    "watermark_size_percent": 0.10,  # 10% of image's shortest side
    # --- Enhancement Settings ---
    "enhance_quality": True,
    "min_resolution": (800, 600),
    "max_resolution": (2500, 2500),
    "sharpness_factor": 1.1,  # Subtle sharpening
    "contrast_factor": 1.05,  # Subtle contrast
    "brightness_factor": 1.0,  # No brightness change
    "color_factor": 1.05,  # Subtle color enhancement
    "jpeg_save_quality": 95,
}


class TestImageProcessor:
    """
    TEST VERSION: Process only one specific image
    """

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.processed_count = 0
        self.error_count = 0
        self._validate_paths()

    def _validate_paths(self) -> None:
        """Validate paths and find test image"""
        # Ensure the main image directory exists
        if not self.config["images_dir"].is_dir():
            print(
                f"❌ Error: Image directory not found at '{self.config['images_dir']}'"
            )
            sys.exit(1)

        # Check if watermark exists
        if not self.config["watermark_file"].is_file():
            print(
                f"❌ Error: Watermark file not found at '{self.config['watermark_file']}'"
            )
            sys.exit(1)

        # Check if test image exists
        test_image_path = self.config["images_dir"] / self.config["test_image"]
        if not test_image_path.is_file():
            print(f"❌ Error: Test image '{self.config['test_image']}' not found")
            print("Available images:")
            for img in self.config["images_dir"].glob("*"):
                if img.suffix.lower() in self.config["supported_formats"]:
                    print(f"  - {img.name}")
            sys.exit(1)

        # Create the backup directory
        self.config["backup_dir"].mkdir(parents=True, exist_ok=True)
        print(f"📁 Backup directory ready: '{self.config['backup_dir']}'")

    def run(self) -> None:
        """Process the single test image"""
        print("=" * 60)
        print("🧪 TEST MODE - Processing ONE image only")
        print("=" * 60)

        test_image_path = self.config["images_dir"] / self.config["test_image"]
        print(f"🎯 Target image: {test_image_path.name}")
        print(f"🏷️  Watermark: {self.config['watermark_file'].name}")
        print()

        self._process_single_image(test_image_path)
        self._print_summary()

    def _backup_original(self, image_path: Path) -> None:
        """Back up the original image"""
        backup_path = self.config["backup_dir"] / image_path.name
        if not backup_path.exists():
            shutil.copy2(image_path, backup_path)
            print(f"  📋 Backed up '{image_path.name}'")
        else:
            print(f"  📋 Backup already exists for '{image_path.name}'")

    def _process_single_image(self, image_path: Path) -> None:
        """Process the test image"""
        print(f"🔄 Processing: {image_path.name}")
        try:
            # Step 1: Back up original
            self._backup_original(image_path)

            # Step 2: Open and process image
            with Image.open(image_path) as img:
                print(f"  📏 Original size: {img.size}, Mode: {img.mode}")

                # Convert to RGBA for processing
                if img.mode in ("P", "LA"):
                    img = img.convert("RGBA")
                elif img.mode != "RGBA":
                    img = img.convert("RGB")

                # Step 3: Enhance image quality
                if self.config["enhance_quality"]:
                    img = self._enhance_image(img)

                # Step 4: Prepare watermark
                watermark = self._prepare_watermark(img)

                # Step 5: Apply watermarks to corners
                img_with_watermarks = self._apply_watermarks(img, watermark)

                # Step 6: Save processed image
                final_image = img_with_watermarks
                if image_path.suffix.lower() in [".jpg", ".jpeg"]:
                    if final_image.mode == "RGBA":
                        white_bg = Image.new("RGB", final_image.size, (255, 255, 255))
                        white_bg.paste(
                            img_with_watermarks, mask=img_with_watermarks.split()[3]
                        )
                        final_image = white_bg

                # Create a test output with different name so we don't overwrite
                output_path = image_path.parent / f"TEST-FINAL-{image_path.name}"
                final_image.save(
                    output_path, quality=self.config["jpeg_save_quality"], optimize=True
                )

                print(f"  💾 Saved test result as: {output_path.name}")
                print("  ✅ SUCCESS: Enhanced and watermarked!")

            self.processed_count += 1

        except Exception as e:
            print(f"  ❌ ERROR: {e}")
            self.error_count += 1

    def _enhance_image(self, img: Image.Image) -> Image.Image:
        """Enhance image quality"""
        print("  ✨ Enhancing image quality...")

        # Check and adjust resolution
        min_w, min_h = self.config["min_resolution"]
        max_w, max_h = self.config["max_resolution"]

        if img.width < min_w or img.height < min_h:
            print(f"     📈 Upscaling from {img.size}")
            aspect_ratio = img.width / img.height
            new_w, new_h = (min_w, int(min_w / aspect_ratio))
            img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            print(f"     📈 New size: {img.size}")

        if img.width > max_w or img.height > max_h:
            print(f"     📉 Downscaling from {img.size}")
            img.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
            print(f"     📉 New size: {img.size}")

        # Apply enhancements
        enhancements = [
            ("Sharpness", self.config["sharpness_factor"]),
            ("Contrast", self.config["contrast_factor"]),
            ("Brightness", self.config["brightness_factor"]),
            ("Color", self.config["color_factor"]),
        ]

        for name, factor in enhancements:
            if factor != 1.0:
                enhancer = getattr(ImageEnhance, name)(img)
                img = enhancer.enhance(factor)
                print(f"     🎨 {name}: {factor}")

        return img

    def _prepare_watermark(self, base_image: Image.Image) -> Image.Image:
        """Prepare the watermark"""
        print("  🏷️  Preparing watermark...")

        with Image.open(self.config["watermark_file"]) as wm:
            wm = wm.convert("RGBA")
            print(f"     🏷️  Original watermark size: {wm.size}")

            # Resize watermark based on image size
            shortest_side = min(base_image.size)
            new_wm_size = int(shortest_side * self.config["watermark_size_percent"])
            wm.thumbnail((new_wm_size, new_wm_size), Image.Resampling.LANCZOS)
            print(f"     📏 Resized to: {wm.size}")

            # Adjust opacity
            alpha = wm.getchannel("A")
            alpha = ImageEnhance.Brightness(alpha).enhance(self.config["opacity"])
            wm.putalpha(alpha)
            print(f"     👻 Opacity: {self.config['opacity']:.0%}")

            return wm

    def _apply_watermarks(
        self, img: Image.Image, watermark: Image.Image
    ) -> Image.Image:
        """Apply watermarks to all four corners"""
        print("  📍 Adding watermarks to corners...")

        if img.mode != "RGBA":
            img = img.convert("RGBA")

        img_w, img_h = img.size
        wm_w, wm_h = watermark.size
        margin = int(min(img_w, img_h) * self.config["margin_percent"])

        # Define corner positions
        positions = [
            (margin, margin),  # Top-left
            (img_w - wm_w - margin, margin),  # Top-right
            (margin, img_h - wm_h - margin),  # Bottom-left
            (img_w - wm_w - margin, img_h - wm_h - margin),  # Bottom-right
        ]

        corners = ["top-left", "top-right", "bottom-left", "bottom-right"]
        for i, pos in enumerate(positions):
            img.paste(watermark, pos, mask=watermark)
            print(f"     📍 {corners[i]}: {pos}")

        return img

    def _print_summary(self) -> None:
        """Print test summary"""
        print("\n" + "=" * 60)
        print("🧪 TEST COMPLETE!")
        print("=" * 60)
        print(f"✅ Processed: {self.processed_count} image")
        print(f"❌ Errors: {self.error_count}")

        if self.processed_count > 0:
            test_image_path = (
                self.config["images_dir"] / f"TEST-FINAL-{self.config['test_image']}"
            )
            print(f"\n🎉 Check your result: {test_image_path}")
            print("📁 Original backup saved in: public/images/originals/")
            print(
                "\n💡 If you like the result, run the full watermark-images.py script!"
            )


# Run the test
if __name__ == "__main__":
    processor = TestImageProcessor(config=CONFIG)
    processor.run()
