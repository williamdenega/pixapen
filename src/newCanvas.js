


import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import AuthWrapper1 from "./AuthWrapper1";
import AuthCardWrapper from "./AuthCardWrapper";
import ReportDialog from "./ReportDialog";
import InstructionsDialog from "./InstructionsDialog";
// import SettingsDialog from "./SettingsDialog";
import {
  calculateTotalScoreChebyshev,
  getRandomPath,
  getDailyPath,
} from "./mathStuff";
import DrawIcon from '@mui/icons-material/Draw';
// import SettingsIcon from "@mui/icons-material/Settings";
import seedrandom from 'seedrandom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const GridCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [filledSquares, setFilledSquares] = useState([]);

  const [showSettings, setShowSettings] = useState(false);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [isDrawingAllowed, setIsDrawingAllowed] = useState(false);
  const [countdown, setCountdown] = useState(4); // Initialize countdown to 3
  const [distanceCounts, setDistanceCounts] = useState({});
  const [remainingTime, setRemainingTime] = useState(5);
  const drawingTimeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [puzzleType, setPuzzleType] = useState('daily'); // or 'daily' as default

  //CONSTANTS
  const radius = 5;
  const size = 15;
  const pathLength = 100;
  // const today = new Date().toISOString().split('T')[0];
  // const rng = seedrandom(today);

  const [coords, setCoords] = useState([]);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 600 });

  const [scoreData, setScoreData] = useState({
    distanceCounts: null,
    missingTargetPointsCount: null,
    percent: null,
  });

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
    // Check if the flag is already set in localStorage
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      // Set the flag to indicate that the user has visited
      localStorage.setItem("hasVisited", "true");
      setShowDialog(true); // Show the instructions dialog
    }
    // RNG for EST TimeZONE
    // const now = new Date();
    // const utcOffset = now.getTimezoneOffset() * 60000; // in milliseconds
    // const easternOffset = -5 * 60 * 60000; // UTC-5 for Eastern Time
    // const easternTime = new Date(now.getTime() + utcOffset + easternOffset);
    // const today = easternTime.toISOString().split('T')[0];
    // const rng = seedrandom(today);

    // if (type === 'daily') {
    //   const newCoords = getDailyPath(size, radius, pathLength, rng);
    //   setCoords(newCoords);
    // } else {
    //   const newCoords = getRandomPath(size, radius, pathLength, rng);
    //   setCoords(newCoords);
    // }

  }, []);

  useEffect(() => {
    if (isDrawingAllowed) {
      drawGrid();
    }
  }, [drawGrid, isDrawingAllowed]);






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
    // const { clientX, clientY } = e.type === "touchstart" ? e.touches[0] : e;

    // setCursorPosition({ x: clientX, y: clientY });

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
      //   const { clientX, clientY } = e.type === "touchmove" ? e.touches[0] : e;
      //   setCursorPosition({ x: clientX, y: clientY });
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

  const handlePlay = (type) => {
    const now = new Date();
    const utcOffset = now.getTimezoneOffset() * 60000; // in milliseconds
    const easternOffset = -5 * 60 * 60000; // UTC-5 for Eastern Time
    const easternTime = new Date(now.getTime() + utcOffset + easternOffset);
    const today = easternTime.toISOString().split('T')[0];
    const rng = seedrandom(today);

    if (type === 'daily') {
      const newCoords = getDailyPath(size, radius, pathLength, rng);
      setPuzzleType('daily')
      setCoords(newCoords);
    } else {
      const newCoords = getRandomPath(size, radius, pathLength, rng);
      setCoords(newCoords);
      setPuzzleType('practice')
    }

    setReady(true);
  };

  const handleCalculateScore = async () => {
    return new Promise((resolve) => {
      const [
        distanceCounts,
        updatedGuessSet,
        missingTargetPointsCount,
        percent,
      ] = calculateTotalScoreChebyshev(coords, filledSquares, setFilledSquares);
      // console.log(`Your score: ${score}`);
      // console.log(result[1]);
      setScoreData({
        distanceCounts,
        // updatedGuessSet,
        missingTargetPointsCount,
        percent,
      });
      setDistanceCounts(distanceCounts);
      console.log("missed sqaures: " + missingTargetPointsCount);
      console.log(percent + "% accraucy");
      //   console.log(distanceCounts);

      resolve(updatedGuessSet); // Resolve the promise once the score is calculated
    });
  };

  const handleCanvasClick = () => {
    if (done && animationComplete) {
      setShowReport(true);
    }
  };

  const handleBack = () => {
    // Reset all the state values to their initial values
    setIsDrawing(false);
    setFilledSquares([]);
    setShowSettings(false);
    setReady(false);
    setDone(false);
    setIsDrawingAllowed(false);
    setCountdown(4);  // Reset countdown
    setDistanceCounts({});
    setRemainingTime(5);  // Reset timer
    setShowDialog(false);
    setShowReport(false);
    setAnimationComplete(false);
    setPuzzleType('daily');  // Reset puzzle type if necessary
    setCoords([]);
    // setCanvasSize({ width: 600, height: 600 });  // Reset canvas size
    setScoreData({
      distanceCounts: null,
      missingTargetPointsCount: null,
      percent: null,
    });

    // Clear any timeouts or intervals if necessary
    if (drawingTimeoutRef.current) {
      clearTimeout(drawingTimeoutRef.current);
      drawingTimeoutRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Optionally clear the canvas if necessary
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
    }
  };


  const handleRedo = () => {
    // Reset all the state values to their initial values
    setIsDrawing(false);
    setFilledSquares([]);
    setShowSettings(false);
    // setReady(true);
    setDone(false);
    setIsDrawingAllowed(false);
    setCountdown(4);  // Reset countdown
    setDistanceCounts({});
    setRemainingTime(5);  // Reset timer
    setShowDialog(false);
    setShowReport(false);
    setAnimationComplete(false);
    setPuzzleType('practice');  // Reset puzzle type if necessary
    setCoords([]);
    // setCanvasSize({ width: 600, height: 600 });  // Reset canvas size
    setScoreData({
      distanceCounts: null,
      missingTargetPointsCount: null,
      percent: null,
    });
    // Clear any timeouts or intervals if necessary
    if (drawingTimeoutRef.current) {
      clearTimeout(drawingTimeoutRef.current);
      drawingTimeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Optionally clear the canvas if necessary
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
    }

    handlePlay()
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


  useEffect(() => {
    if (done) {
      let animationFrameId;
      let framesPerCell = 5; // Adjust this value to control animation speed
      let frameCount = 0;
      let index = 0;

      const calculateAndDrawResults = async () => {
        try {
          const newCoords = await handleCalculateScore();

          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");

          const maxDistance = Math.max(
            ...newCoords.map(([, , distance]) => distance),
            3
          );

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          coords.forEach(([row, col]) => fillCell(ctx, row, col, canvas));

          const animateDrawing = () => {
            frameCount++;
            if (frameCount >= framesPerCell) {
              frameCount = 0; // Reset frameCount
              if (index < newCoords.length) {
                const [row, col, distance] = newCoords[index];
                fillCell(ctx, row, col, canvas, distance, maxDistance);
                index++;
              } else {
                // Animation is complete
                setAnimationComplete(true); // Update the state
                setShowReport(true)
                return; // Exit the function to stop the animation loop
              }
            }
            animationFrameId = requestAnimationFrame(animateDrawing);
          };

          // Start the animation
          animateDrawing();
        } catch (error) {
          console.error("Error in calculateAndDrawResults:", error);
        }
      };

      calculateAndDrawResults();

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, [done, coords]);

  // const totalPoints = calculateTotalPoints(distanceCounts);

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
                    {!ready ? (<Grid container direction="column" alignItems="center" spacing={5}>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          onClick={(e) => handlePlay(e.target.value)}
                          size="large"
                          value='daily'
                          style={{
                            padding: "30px 80px",
                            fontSize: "3rem",
                            // fontFamily: 'Comic Sans MS, cursive, sans-serif', // 90s font
                            backgroundColor: "#FFFFFF", // white background
                            color: "#000000", // black text
                            border: "3px solid #000000", // bold border
                            borderRadius: "4px", // rounded corners
                            boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.5)", // subtle shadow
                            textTransform: "uppercase", // all caps
                            letterSpacing: "1px", // slightly spaced letters
                          }}
                        >
                          Play
                        </Button>
                      </Grid>
                    </Grid>
                    ) : (
                      <Grid container direction="column" alignItems="center">
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              height: "40px",
                              width: canvasSize.width,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between", // Position items at opposite ends
                              mb: 0,
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
                              border: "3px solid black",
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
                              onTouchStart={startDrawing}
                              onTouchMove={draw}
                              onTouchEnd={stopDrawing}
                              onTouchCancel={stopDrawing}
                              onBlur={() => setIsDrawing(false)}
                              onClick={handleCanvasClick} // Add onClick handler
                              style={{
                                cursor: isDrawing ? "crosshair" : "default",
                                display: "block",
                                margin: 0,
                                touchAction: done ? "auto" : "none",
                              }}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          {done && <Button
                            variant="contained"
                            onClick={handleBack}
                            startIcon={<ArrowBackIcon />}

                            sx={{
                              padding: "15px 50px", // Same padding as the Play button
                              fontSize: "1.5rem", // Font size to match the Play button
                              backgroundColor: "#FFFFFF", // White background
                              color: "#000000", // Black text
                              border: "3px solid #000000", // Bold border
                              borderRadius: "4px", // Remove border radius to match the Play button
                              boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.5)", // Subtle shadow
                              textTransform: "uppercase", // Uppercase text
                              letterSpacing: "1px", // Slightly spaced letters
                              fontFamily: "Luckiest Guy, Pixelify Sans", // Custom font
                              ml: 2, // Adjust margin if needed

                            }}
                          >
                            Back
                          </Button>}

                        </Grid>
                      </Grid>
                    )}
                  </Box>
                </Grid>
                <Grid
                  item
                  container
                  direction="column"
                  alignItems="center"
                  xs={12}
                >
                  {!ready && (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center", // Align items vertically centered
                          cursor: "pointer", // Change cursor to pointer on hover
                          "&:hover": {
                            textDecoration: "underline", // Underline on hover
                          },
                        }}
                        onClick={(e) => handlePlay(e.target.value)}
                        value='daily'
                      >
                        <DrawIcon
                          sx={{
                            marginRight: 1, // Space between icon and text
                            fontSize: "1.5rem", // Match font size of text
                            color: "#000", // Match text color
                          }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{
                            textDecoration: "none",
                            fontSize: "1.5rem", // Increase font size
                            fontWeight: "bold", // Make the text bold
                            color: "#000", // Change text color
                            letterSpacing: "0.5px", // Adjust letter spacing
                          }}
                        >
                          Practice
                        </Typography>
                      </Box>

                      {/* <Box
                        sx={{
                          display: "flex",
                          alignItems: "center", // Align items vertically centered
                          cursor: "pointer", // Change cursor to pointer on hover
                          "&:hover": {
                            textDecoration: "underline", // Underline on hover
                          },
                        }}
                        onClick={() => setShowSettings(true)}
                      >
                        <SettingsIcon
                          sx={{
                            marginRight: 1, // Space between icon and text
                            fontSize: "1.5rem", // Match font size of text
                            color: "#000", // Match text color
                          }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{
                            textDecoration: "none",
                            fontSize: "1.5rem", // Increase font size
                            fontWeight: "bold", // Make the text bold
                            color: "#000", // Change text color
                            letterSpacing: "0.5px", // Adjust letter spacing
                          }}
                        >
                          Settings
                        </Typography>
                      </Box> */}
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
                    </>
                  )}
                </Grid>
              </Grid>
            </AuthCardWrapper>
            <ReportDialog
              open={showReport}
              onClose={() => setShowReport(false)}
              scoreData={scoreData}
              puzzleType={puzzleType}
              handleRedo={handleRedo}
            />
            <InstructionsDialog
              open={showDialog}
              onClose={() => setShowDialog(false)}
            />
            {/* <SettingsDialog
              open={showSettings}
              onClose={() => setShowSettings(false)}
            //   currentDifficulty={difficulty}
            //   onSave={handleSaveDifficulty}
            /> */}
          </Grid>
        </Grid>
        {/* </Grid> */}
      </Grid>
    </AuthWrapper1>
  );
};

export default GridCanvas;
