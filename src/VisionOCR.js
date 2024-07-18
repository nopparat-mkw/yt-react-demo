import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const VisionOCR = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  };

  const processImage = async () => {
    if (image) {
      const base64Image = image.split(',')[1];

      try {
        const response = await axios.post(
          `https://vision.googleapis.com/v1/images:annotate?key=YOUR_API_KEY`,
          {
            requests: [
              {
                image: {
                  content: base64Image,
                },
                features: [
                  {
                    type: 'TEXT_DETECTION',
                  },
                ],
              },
            ],
          }
        );

        const detectedText = response.data.responses[0].fullTextAnnotation.text;
        setText(detectedText);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
  };

  return (
    <div>
      <h1>Cloud Vision OCR</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
      />
      <button onClick={capture}>Capture</button>
      {image && (
        <div>
          <img src={image} alt="Captured" />
          <button onClick={processImage}>Process Image</button>
        </div>
      )}
      {text && (
        <div>
          <h2>Detected Text:</h2>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default VisionOCR;
