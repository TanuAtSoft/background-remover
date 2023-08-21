import React, { useState, useRef } from 'react';

function ImageEditor() {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [image, setImage] = useState(null);
  const [eraserSize, setEraserSize] = useState(20); // Initial eraser size
  const originalImageData = useRef(null);

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
          originalImageData.current = newCtx.getImageData(0, 0, canvas.width, canvas.height);
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

    ctx.clearRect(x, y, eraserSize, eraserSize);
    ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // Transparent color
    ctx.fillRect(x, y, eraserSize, eraserSize);
  };

  const stopErasing = () => {
    const canvas = canvasRef.current;
    canvas.removeEventListener('mousemove', erase);
    saveState();
  };

  const handleEraserSizeChange = (event) => {
    setEraserSize(parseInt(event.target.value));
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const previousState = history[historyIndex - 1];
      ctx.putImageData(previousState.imageData, 0, 0);
      updateCanvasSize();
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextState = history[historyIndex + 1];
      ctx.putImageData(nextState.imageData, 0, 0);
      updateCanvasSize();
    }
  };

  const updateCanvasSize = () => {
    const canvas = canvasRef.current;
    const nonTransparentPixels = findNonTransparentPixels(canvas);
    if (nonTransparentPixels) {
      canvas.width = nonTransparentPixels.width;
      canvas.height = nonTransparentPixels.height;
      ctx.drawImage(image, 0, 0, nonTransparentPixels.width, nonTransparentPixels.height);
    }
  };

  const findNonTransparentPixels = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = 0;
    let maxY = 0;
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        if (data[index + 3] !== 0) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    if (minX <= maxX && minY <= maxY) {
      return { width: maxX - minX + 1, height: maxY - minY + 1 };
    } else {
      return null;
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

  const restoreImage = () => {
    if (ctx && originalImageData.current) {
      ctx.putImageData(originalImageData.current, 0, 0);
      saveState();
      updateCanvasSize();
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUploadImage} />
      <button onClick={handleEraser}>Eraser</button>
      <input
        type="range"
        min="5"
        max="100"
        value={eraserSize}
        onChange={handleEraserSizeChange}
      />
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
      <button onClick={saveImage}>Save</button>
      <button onClick={restoreImage}>Restore Image</button>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
}

export default ImageEditor;
