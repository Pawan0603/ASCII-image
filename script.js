const canvas = document.getElementById("preview");
const fileInput = document.querySelector('input[type="file"');

const context = canvas.getContext("2d");


const grayRamp = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
const rampLength = grayRamp.length;

// the grayScale value is an integer ranging from 0 (black) to 255 (white)
const getCharacterForGrayScale = grayScale => grayRamp[Math.ceil(((rampLength - 1) * grayScale) / 255)];


const asciiImage = document.querySelector("pre#ascii");

// const drawAscii = grayScales => {
//   const ascii = grayScales.reduce((asciiImage, grayScale) => {
//     return asciiImage + getCharacterForGrayScale(grayScale);
//   }, "");

//   asciiImage.textContent = ascii;
// };

const drawAscii = (grayScales, width) => {
    const ascii = grayScales.reduce((asciiImage, grayScale, index) => {
        let nextChars = getCharacterForGrayScale(grayScale);

        if ((index + 1) % width === 0) {
            nextChars += "\n";
        }

        return asciiImage + nextChars;
    }, "");

    asciiImage.textContent = ascii;
};


const toGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;

const convertToGrayScales = (context, width, height) => {
    const imageData = context.getImageData(0, 0, width, height);

    const grayScales = [];

    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        const grayScale = toGrayScale(r, g, b);
        imageData.data[i] = imageData.data[i + 1] = imageData.data[
            i + 2
        ] = grayScale;

        grayScales.push(grayScale);
    }

    context.putImageData(imageData, 0, 0);

    return grayScales;
};


fileInput.onchange = e => {
    // just handling single file upload
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = event => {
        const image = new Image();
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;

            context.drawImage(image, 0, 0);
            const grayScales = convertToGrayScales(context, canvas.width, canvas.height);
            console.log(grayScales)
            drawAscii(grayScales, canvas.width)
        };

        image.src = event.target.result;
    };

    reader.readAsDataURL(file);

};

