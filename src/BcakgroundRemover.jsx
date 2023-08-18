import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import "bootstrap/dist/css/bootstrap.min.css";
import Eraser from "./Eraser";
import Restore from "./Restore";

function BackgroundRemovalApp() {
  const canvasRef = useRef(null);
   const [newCanvas, setNewCanvas] = useState(null);
  let canvas;
  const [canvasHistory, setCanvasHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [originalImage, setOriginalImage] = useState("http://fabricjs.com/assets/pug_small.jpg");
   const [restored,setRestored] = useState(false)


  const handleEraser = () => {
    // setIsDrawing(!isDrawing)
    if (canvas) {
        canvas.erasable = true
        canvas.isDrawingMode = true;
        var brush = new fabric.PencilBrush(canvas);
        canvas.isDrawingMode = 1;
        brush.width = 10;
         canvas.freeDrawingBrush.width = 10;
        // Implement your eraser logic here
        // After erasing, update the canvas state
              
        canvas.on('mouse:down', (options) => {
            if (options.e.shiftKey) {
              canvas.isErasing = true;
            }
          });
             // Erase
             canvas.on('mouse:move', (options) => {
                if (canvas.isErasing) {
                  const pointer = canvas.getPointer(options.e);
                  canvas.contextContainer.clearRect(
                    pointer.x - canvas.freeDrawingBrush.width / 2,
                    pointer.y - canvas.freeDrawingBrush.width / 2,
                    canvas.freeDrawingBrush.width,
                    canvas.freeDrawingBrush.width
                  );
                }
              });
      }
      canvas.on('mouse:up', () => {
        canvas.isErasing = false;
        canvas.renderAll();
       // updateCanvasHistory();
      });

  };

 
      

  useEffect(() => {
    // Initialize Fabric.js canvas
    canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: false, // Enable drawing mode
       erasable: false ,
      freeDrawingBrush: new fabric.PencilBrush(canvas), // Use pencil brush
      backgroundColor: "transparent", // Set background color to transparent
    });

    // Set up brush settings
    canvas.freeDrawingBrush.width = 20; // Adjust brush width as needed
    canvas.freeDrawingBrush.color = "white"; // Set brush color to remove background

    // Handle brush strokes
    canvas.on("path:created", (options) => {
      // Remove the drawn path from the image
      const path = options.path;
      const image = canvas.backgroundImage;
      //   image.removePath(path);
      canvas.renderAll();
    });

    // Load the image onto the canvas
    fabric.Image.fromURL("http://fabricjs.com/assets/pug_small.jpg", (img) => {
      canvas.setWidth(img.width);
      canvas.setHeight(img.height);
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    });
  }, [restored]);

  const restoreOriginalImage = () => {
    if (canvas) {
        canvas.isDrawingMode = false;
        fabric.Image.fromURL("http://fabricjs.com/assets/pug_small.jpg", (img) => {
            canvas.setWidth(img.width);
            canvas.setHeight(img.height);
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
          });
        }
          setRestored(true)
    
  };

  

  return (
    <div className="canvas-container">
      {" "}
      <div className="side-div">
        <div className="icons" onClick={handleEraser}>
          <Eraser onClick={handleEraser} />
        </div>
        <div className="icons" onClick={restoreOriginalImage}>
          <Restore onClick={restoreOriginalImage} />
        </div>
        <div className="icons" onClick={()=>canvas.freeDrawingBrush.inverted = true}>
          <Restore onClick={()=>canvas.freeDrawingBrush.inverted = true} />
        </div>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default BackgroundRemovalApp;
