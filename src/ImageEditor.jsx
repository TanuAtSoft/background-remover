// import React, { useState, useRef } from 'react';

// function ImageEditor() {
//   const canvasRef = useRef(null);
//   const [ctx, setCtx] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [historyIndex, setHistoryIndex] = useState(-1);
//   const [image, setImage] = useState(null);

//   const handleUploadImage = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const newImage = new Image();
//         newImage.src = e.target.result;
//         newImage.onload = () => {
//           setImage(newImage);
//           const canvas = canvasRef.current;
//           const newCtx = canvas.getContext('2d');
//           newCtx.drawImage(newImage, 0, 0, canvas.width, canvas.height);
//           setCtx(newCtx);
//           setHistory([{ imageData: newCtx.getImageData(0, 0, canvas.width, canvas.height) }]);
//           setHistoryIndex(0);
//         };
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleEraser = () => {
//     if (ctx) {
//       const canvas = canvasRef.current;
//       canvas.addEventListener('mousemove', erase);
//       canvas.addEventListener('mouseup', stopErasing);
//     }
//   };

//   const erase = (e) => {
//     const canvas = canvasRef.current;
//     const canvasRect = canvas.getBoundingClientRect();
//     const x = e.clientX - canvasRect.left;
//     const y = e.clientY - canvasRect.top;

//     ctx.clearRect(x, y, 20, 20);
//     ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // Transparent color
//     ctx.fillRect(x, y, 20, 20);
//   };

//   const stopErasing = () => {
//     const canvas = canvasRef.current;
//     canvas.removeEventListener('mousemove', erase);
//     saveState();
//   };

//   const undo = () => {
//     if (historyIndex > 0) {
//       setHistoryIndex(historyIndex - 1);
//       const previousState = history[historyIndex - 1];
//       ctx.putImageData(previousState.imageData, 0, 0);
//     }
//   };

//   const redo = () => {
//     if (historyIndex < history.length - 1) {
//       setHistoryIndex(historyIndex + 1);
//       const nextState = history[historyIndex + 1];
//       ctx.putImageData(nextState.imageData, 0, 0);
//     }
//   };

//   const saveState = () => {
//     const canvas = canvasRef.current;
//     const newImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     setHistory([...history.slice(0, historyIndex + 1), { imageData: newImageData }]);
//     setHistoryIndex(historyIndex + 1);
//   };

//   const saveImage = () => {
//     if (ctx) {
//       const canvas = canvasRef.current;
//       const editedImageURL = canvas.toDataURL('image/png');
//       const downloadLink = document.createElement('a');
//       downloadLink.href = editedImageURL;
//       downloadLink.download = 'edited_image.png';
//       downloadLink.click();
//     }
//   };

//   return (
//     <div>
//       <input type="file" accept="image/*" onChange={handleUploadImage} />
//       <button onClick={handleEraser}>Eraser</button>
//       <button onClick={undo}>Undo</button>
//       <button onClick={redo}>Redo</button>
//       <button onClick={saveImage}>Save</button>
//       <canvas ref={canvasRef} width={800} height={600} />
//     </div>
//   );
// }

// export default ImageEditor;

import React, { useState, useRef } from 'react';

function ImageEditor() {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [image, setImage] = useState(null);

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = new Image();
        newImage.src = e.target.result;
        newImage.onload = () => {
          setImage(newImage);
          const canvas = canvasRef.current;
          const newCtx = canvas.getContext('2d');
          newCtx.drawImage(newImage, 0, 0, canvas.width, canvas.height);
          setCtx(newCtx);
          setHistory([{ imageData: newCtx.getImageData(0, 0, canvas.width, canvas.height) }]);
          setHistoryIndex(0);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEraser = () => {
    if (ctx) {
      const canvas = canvasRef.current;
      canvas.addEventListener('mousemove', erase);
      canvas.addEventListener('mouseup', stopErasing);
    }
  };

  const erase = (e) => {
    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    ctx.clearRect(x, y, 20, 20);
    ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // Transparent color
    ctx.fillRect(x, y, 20, 20);
  };

  const stopErasing = () => {
    const canvas = canvasRef.current;
    canvas.removeEventListener('mousemove', erase);
    saveState();
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const previousState = history[historyIndex - 1];
      ctx.putImageData(previousState.imageData, 0, 0);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextState = history[historyIndex + 1];
      ctx.putImageData(nextState.imageData, 0, 0);
    }
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    const newImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([...history.slice(0, historyIndex + 1), { imageData: newImageData }]);
    setHistoryIndex(historyIndex + 1);
  };

  const saveImage = () => {
    if (ctx) {
      const canvas = canvasRef.current;
      const editedImageURL = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = editedImageURL;
      downloadLink.download = 'edited_image.png';
      downloadLink.click();
    }
  };

  const performBackgroundRemoval = () => {
    if (ctx) {
      const canvas = canvasRef.current;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Simple color-based background removal attempt
      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        // Adjust these thresholds based on your needs
        if (red < 200 && green > 200 && blue < 200) {
          data[i + 3] = 0; // Set alpha channel to 0 (transparent)
        }
      }

      ctx.putImageData(imageData, 0, 0);
      saveState();
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUploadImage} />
      <button onClick={handleEraser}>Eraser</button>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
      <button onClick={saveImage}>Save</button>
      <button onClick={performBackgroundRemoval}>Remove Background</button>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
}

export default ImageEditor;
