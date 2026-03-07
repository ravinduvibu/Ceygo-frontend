const { Jimp } = require("jimp");
const path = require("path");

async function removeBackground() {
    const inputPath = path.join(__dirname, "public", "images", "logo.png");
    const outputPath = path.join(__dirname, "public", "images", "logo_transparent.png");

    try {
        const image = await Jimp.read(inputPath);

        // Iterate through all pixels and make white ones completely transparent
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];

            // If the pixel is very close to white (allow some tolerance for anti-aliasing)
            if (red > 240 && green > 240 && blue > 240) {
                this.bitmap.data[idx + 3] = 0; // alpha channel
            }
        });

        await image.write(outputPath);
        console.log("Successfully created transparent logo at:", outputPath);
    } catch (err) {
        console.error("Error creating transparent logo:", err);
    }
}

removeBackground();
