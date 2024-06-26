const canvas = document.getElementById("preview");
const fileInput = document.querySelector('input[type="file"');
const imageViwer = document.getElementById('imageViwer');

const context = canvas.getContext("2d");

let selectedImg;


const downloadNow = async () => {
    // Div element ko select karen
    const element = document.getElementById("ascii");
    console.log(element)
    document.getElementById("downloadbtnbox").innerHTML = `<h3>Plz wait for downloading...</h3>`

    // html2canvas ka istemal karke screenshot banaen
    html2canvas(element, {
        onrendered: function(canvas) {
            // Canvas ko image URL mein convert karen
            const imgData = canvas.toDataURL('image/png');

            // Image ko download karne ke liye link banayein
            const link = document.createElement('a');
            link.download = 'element_screenshot.png';
            link.href = imgData;
            link.click();
        }
    });
}


// const grayRamp = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
const grayRamp = "@=+~-,. ";
const rampLength = grayRamp.length;

// the grayScale value is an integer ranging from 0 (black) to 255 (white)
const getCharacterForGrayScale = grayScale => grayRamp[Math.ceil(((rampLength - 1) * grayScale) / 255)];


const asciiImage = document.querySelector("pre#ascii");

const drawAscii = async (grayScales, width) => {
    const ascii = grayScales.reduce((asciiImage, grayScale, index) => {
        let nextChars = getCharacterForGrayScale(grayScale);

        if ((index + 1) % width === 0) {
            nextChars += "\n";
        }

        return asciiImage + nextChars;
    }, "");

    asciiImage.textContent = ascii;
    console.log("done.....")

    document.getElementById("downloadbtnbox").innerHTML = `<button type="button" onclick="downloadNow()">Download ASCII image</button>`
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

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function createImageUrl(imageFiles) {
    // Convert each image file to Base64 and store in an array
    let base64Images = [];
    fileToBase64(imageFiles)
        .then(results => {
            imageViwer.innerHTML = `<div class="imageViwer">
            <img src=${results} alt="Image" class="img"></img>
            <div id="downloadbtnbox">
                <button type="button">Please wait...</button>
            </div>
            </div>`

        })
        .catch(error => console.error('Error converting files:', error));
}


fileInput.onchange = e => {
    // just handling single file upload
    const file = e.target.files[0];
    // console.log(file)
    createImageUrl(file)

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

