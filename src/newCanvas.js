import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
} from "@mui/material";
import AuthWrapper1 from "./AuthWrapper1";
import AuthCardWrapper from "./AuthCardWrapper";
// import AuthFooter from 'ui-component/cards/AuthFooter';
// import { Link } from 'react-router-dom';
import {
  calculateTotalScoreChebyshev,
  getRandomPathNearMiddle,
} from "./mathStuff";
// import TimerDisplay from "./TimerDisplay"; // Import the TimerDisplay component

const GridCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [filledSquares, setFilledSquares] = useState([]);
  // const [squarePosition, setSquarePosition] = useState([]);
  // const [matchingPositions, setMatchingPositions] = useState([]);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [isDrawingAllowed, setIsDrawingAllowed] = useState(false);
  const [countdown, setCountdown] = useState(4); // Initialize countdown to 3
  const [distanceCounts, setDistanceCounts] = useState({});
  const [remainingTime, setRemainingTime] = useState(5);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const drawingTimeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const radius = 5;
  const size = 15;
  const pathLength = 100;
  const [coords, setCoords] = useState([]);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 600 });

  const drawGrid = useCallback(() => {
    // if (!isDrawingAllowed) return;
    const canvas = canvasRef.current;
    if (!canvas) return; // Ensure canvas is available
    const ctx = canvas.getContext("2d");
    const cellSize = canvas.width / size;
    // console.log('gw')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // const maxDistance = Math.max(...filledSquares.map(([, , distance]) => distance));
    // Draw grid lines
    ctx.beginPath();
    for (let i = 0; i <= size; i++) {
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
    }
    ctx.strokeStyle = "#ddd";
    // ctx.stroke();

    isDrawing &&
      filledSquares.forEach(([row, col]) => {
        fillCell(ctx, row, col, canvas);
        // console.log(distance);
      });
  }, [filledSquares, size]);

  const drawCountdown = (ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.font = `200px 'Pixelify Sans'`; // Use the font you selected
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black"; // Adjust color as needed
    ctx.fillText(
      countdown,
      canvasRef.current.width / 2,
      canvasRef.current.height / 2
    );
  };

  useEffect(() => {
    if (ready) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (countdown > 0) {
        drawCountdown(ctx);

        const timer = setTimeout(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        return () => clearTimeout(timer); // Cleanup timeout if component unmounts or countdown changes
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // console.log(coords);
        coords.forEach(([row, col]) => fillCell(ctx, row, col, canvas));
        const displayTimer = setTimeout(() => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          setIsDrawingAllowed(true);
        }, 1000);
        return () => {
          clearTimeout(displayTimer);
        };
      }
    }
  }, [ready, countdown, coords]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        const size = window.innerWidth - 40;
        setCanvasSize({
          width: size,
          height: size,
        });
      } else {
        setCanvasSize({ width: 600, height: 600 });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check size on mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array means this runs only once

  useEffect(() => {
    // console.log(size)
    setCoords(getRandomPathNearMiddle(size, radius, pathLength));
    // console.log(coords)
  }, []);

  useEffect(() => {
    if (isDrawingAllowed) {
      drawGrid();
      // resizeCanvas();
      // window.addEventListener('resize', resizeCanvas);
      // return () => window.removeEventListener('resize', resizeCanvas);
    }
  }, [drawGrid, isDrawingAllowed]);

  useEffect(() => {
    if (done) {
      const calculateAndDrawResults = async () => {
        const newCoords = await handleCalculateScore();

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const maxDistance = Math.max(
          ...newCoords.map(([, , distance]) => distance),
          3
        );

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        coords.forEach(([row, col]) => fillCell(ctx, row, col, canvas));
        newCoords.forEach(([row, col, distance]) =>
          fillCell(ctx, row, col, canvas, distance, maxDistance)
        );
      };

      calculateAndDrawResults();
    }
  }, [done]);

  const interpolateColor = (distance, maxDistance) => {
    const ratio = distance / maxDistance;
    const r = 255;
    const g = Math.floor(255 * (1 - ratio));
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const fillCell = (ctx, row, col, canvas, distance, maxDistance) => {
    const cellSize = canvas.width / size;
    let color;

    if (distance === 0) {
      color = "green";
    } else if (distance === undefined || distance === null) {
      color = "black";
    } else {
      color = interpolateColor(distance, maxDistance);
    }

    // console.log(`Filling cell at row ${row}, col ${col} with color ${color}`);
    ctx.fillStyle = color;
    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
  };

  const startDrawing = (e) => {
    if (!isDrawingAllowed || done) return;
    setIsDrawing(true);
    setRemainingTime(5); // Reset the countdown to 3 seconds
    const { clientX, clientY } = e.type === "touchstart" ? e.touches[0] : e;

    setCursorPosition({ x: clientX, y: clientY });

    fillSquare(e); // Your drawing logic here

    if (drawingTimeoutRef.current) {
      clearTimeout(drawingTimeoutRef.current);
    }

    drawingTimeoutRef.current = setTimeout(() => {
      setIsDrawing(false);
      setIsDrawingAllowed(false);
      setDone(true);
      stopDrawing();
    }, remainingTime * 1000);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev === 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const draw = (e) => {
    if (!isDrawingAllowed || done) return;
    if (isDrawing) {
      fillSquare(e); // Your drawing logic here
      const { clientX, clientY } = e.type === "touchmove" ? e.touches[0] : e;
      setCursorPosition({ x: clientX, y: clientY });
    }
  };

  const stopDrawing = async () => {
    if (!isDrawing || !isDrawingAllowed) return;
    if (drawingTimeoutRef.current) {
      clearTimeout(drawingTimeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsDrawing(false);
    setIsDrawingAllowed(false);
    setDone(true);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (drawingTimeoutRef.current) {
        clearTimeout(drawingTimeoutRef.current);
      }
    };
  }, []);

  const fillSquare = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width; // Relationship bitmap vs. element for X
    const scaleY = canvasRef.current.height / rect.height; // Relationship bitmap vs. element for Y
    const x = ((e.clientX || e.touches[0].clientX) - rect.left) * scaleX; // Scale mouse coordinates after they have
    const y = ((e.clientY || e.touches[0].clientY) - rect.top) * scaleY; // been adjusted to be relative to element

    const col = Math.floor(x / (canvasRef.current.width / size));
    const row = Math.floor(y / (canvasRef.current.height / size));

    const id = [row, col];

    const newFilledSquares = [...filledSquares];

    if (!newFilledSquares.some(([r, c]) => r === row && c === col)) {
      newFilledSquares.push(id);
    }

    setFilledSquares(newFilledSquares);
  };

  const handlePlay = () => {
    setReady(true);
  };

  const handleCalculateScore = async () => {
    return new Promise((resolve) => {
      const result = calculateTotalScoreChebyshev(
        coords,
        filledSquares,
        setFilledSquares
      );
      // console.log(`Your score: ${score}`);
      // console.log(result[1]);

      setDistanceCounts(result[0]);
      //   console.log(distanceCounts);

      resolve(result[1]); // Resolve the promise once the score is calculated
    });
  };

  const pointsMapping = {
    0: 15,
    1: 12,
    2: 10,
    3: 8,
    4: 6,
    5: 5,
    6: 4,
    7: 3,
    8: 2,
    9: 1,
  };

  const calculateTotalPoints = (distanceCounts) => {
    return Object.entries(distanceCounts).reduce((total, [key, value]) => {
      // Convert key to number for comparison
      const distance = Number(key);

      // Check if distance is 5 or less
      if (distance <= 5) {
        const points = pointsMapping[key] || 0; // Get points from mapping
        return total + value * points; // Add to total
      }

      return total; // If distance > 5, add 0 points
    }, 0);
  };

  const totalPoints = calculateTotalPoints(distanceCounts);

  return (
    <AuthWrapper1>
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        sx={{ minHeight: "100vh", marginTop: 0 }}
      >
        <Grid
          container
          justifyContent="center"
          mt={0}
          alignItems="center"
          sx={{ minHeight: "calc(100vh - 0px)" }}
        >
          <Grid item sx={{ m: { xs: 1, sm: 2 }, mb: 0, mt: 0 }}>
            <AuthCardWrapper>
              <Grid
                container
                spacing={!ready ? 10 : 0}
                alignItems="center"
                justifyContent="center"
              >
                <Grid
                  item
                  sx={{ mb: 0, mt: 0 }}
                  xs={12}
                  alignItems="center"
                  textAlign="center"
                >
                  <Typography
                    variant="h1"
                    style={{
                      fontSize: "5rem",
                      fontWeight: "bold", // Make the text bold
                    }}
                  >
                    PIXAPEN
                  </Typography>
                </Grid>
                <Grid
                  item
                  sx={{ mb: 0 }}
                  xs={12}
                  alignItems="center"
                  textAlign="center"
                >
                  <Box>
                    {!ready ? (
                      <Button
                        variant="contained"
                        onClick={handlePlay}
                        size="large"
                        style={{
                          padding: "30px 80px",
                          fontSize: "3rem",
                          // fontFamily: 'Comic Sans MS, cursive, sans-serif', // 90s font
                          backgroundColor: "#FFFFFF", // white background
                          color: "#000000", // black text
                          border: "3px solid #000000", // bold border
                          borderRadius: "0px", // rounded corners
                          boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.5)", // subtle shadow
                          textTransform: "uppercase", // all caps
                          letterSpacing: "1px", // slightly spaced letters
                        }}
                      >
                        Play
                      </Button>
                    ) : (
                      <Grid container direction="column" alignItems="center">
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              //   backgroundColor: "lightblue",
                              height: "40px", // Adjust height to fit the text
                              width: canvasSize.width, // Full width of the canvas
                              //   borderBottom: "1px solid blue",
                              display: "flex",
                              //    fontFamily: "Luckiest Guy, Pixelify Sans",
                              alignItems: "center", // Center text vertically
                              justifyContent: "center", // Center text horizontally
                              mb: 0, // No margin-bottom
                            }}
                          >
                            {isDrawing && (
                              <Typography
                                variant="h6"
                                component="span"
                                sx={{
                                  fontFamily: "Luckiest Guy, Pixelify Sans",
                                }}
                              >
                                Time Remaining: {remainingTime}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              backgroundColor: "white",
                              padding: 0,
                              display: "inline-block",
                              border: "1px solid black",
                              borderRadius: "4px",
                            }}
                          >
                            <canvas
                              ref={canvasRef}
                              width={canvasSize.width}
                              height={canvasSize.height}
                              tabIndex="0"
                              onMouseDown={startDrawing}
                              onMouseMove={draw}
                              onMouseUp={stopDrawing}
                              //   onMouseOut={stopDrawing}
                              onTouchStart={startDrawing}
                              onTouchMove={draw}
                              onTouchEnd={stopDrawing}
                              onTouchCancel={stopDrawing}
                              onBlur={() => setIsDrawing(false)}
                              style={{
                                cursor: isDrawing ? "crosshair" : "default",
                                display: "block",
                                margin: 0,
                                touchAction: done ? "auto" : "none",
                              }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    )}
                  </Box>
                </Grid>
                {done && (
                  <Grid
                    item
                    sx={{ mb: 0 }}
                    xs={12}
                    alignItems="center"
                    textAlign="center"
                  >
                    <div>distance | pixels</div>
                    {Object.entries(distanceCounts).map(([key, value]) => {
                      const distance = Number(key);
                      const points = pointsMapping[key] || 0; // Default to 0 if key is not in the mapping
                      const totalPointsForKey =
                        distance <= 5 ? value * points : 0; // Calculate total points for this key

                      return (
                        <div key={key}>
                          {value} pixels {key} space away (Total Points:{" "}
                          {totalPointsForKey})
                        </div>
                      );
                    })}
                    <div>Total Points: {totalPoints}</div>
                  </Grid>
                )}
                <Grid
                  item
                  container
                  direction="column"
                  alignItems="center"
                  xs={12}
                >
                  {!ready && (
                    <Typography
                      variant="subtitle1"
                      onClick={() => setShowDialog(true)}
                      sx={{
                        textDecoration: "none",
                        fontSize: "1.5rem", // Increase font size
                        fontWeight: "bold", // Make the text bold
                        color: "#000", // Change text color
                        letterSpacing: "0.5px", // Adjust letter spacing
                        "&:hover": {
                          textDecoration: "underline", // Underline on hover
                          cursor: "pointer", // Change cursor to pointer on hover
                        },
                      }}
                    >
                      How to Play?
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </AuthCardWrapper>
            <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
              <DialogTitle>Instructions</DialogTitle>
              <Typography variant="body1">
                Draw the shape that appears on the screen. The better you match
                the shape, the higher your score!
              </Typography>
            </Dialog>
          </Grid>
        </Grid>
        {/* </Grid> */}
      </Grid>
    </AuthWrapper1>
  );
};

export default GridCanvas;
