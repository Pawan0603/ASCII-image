// utils/convertDivToJpg.js
import html2canvas from 'html2canvas';

const convertDivToJpg = async (divId, quality = 1, scale = 7) => {
  try {
    const divElement = document.getElementById(divId);

    const canvas = await html2canvas(divElement, { quality, scale });
    const jpgDataUrl = canvas.toDataURL('image/jpeg', quality);
    return jpgDataUrl;
  } catch (error) {
    console.error('Error converting div to JPG:', error);
    return null;
  }
};

export default convertDivToJpg;
