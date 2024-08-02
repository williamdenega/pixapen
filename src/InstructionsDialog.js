import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

// Define a custom font style
const dialogFontFamily = '"Roboto", "Arial", sans-serif'; // Change this to your desired font

// Styled Dialog component
const CustomDialog = styled(Dialog)({
  fontFamily: dialogFontFamily,
});

// Styled DialogTitle to customize the title
const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  textAlign: "center",
  fontSize: "1.5rem",
  fontWeight: "bold",
  padding: theme.spacing(2),
  position: "relative",
  fontFamily: dialogFontFamily,
}));

// Styled IconButton for the close button
const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
}));

// Container for centered content
const CenteredContent = styled(Box)(({ theme }) => ({
  textAlign: "center",
  margin: theme.spacing(2, 0),
  fontFamily: dialogFontFamily,
}));

const steps = [
  "Step 1: Understanding the Game",
  "Step 2: Drawing the Shape",
  "Step 3: Scoring and Feedback",
];

const stepContent = [
  <CenteredContent key="step1">
    <Typography variant="h6" sx={{ fontFamily: dialogFontFamily }}>
      You will be shown a shape for a limited amount of time
    </Typography>
    <img
      src="/shape.gif"
      alt="Shape to draw"
      style={{ marginTop: 16, maxWidth: "100%", height: "auto" }}
    />
  </CenteredContent>,
  <CenteredContent key="step2">
    <Typography variant="h6" sx={{ fontFamily: dialogFontFamily }}>
      Try to recreate the shape as closely as possible.
    </Typography>
    <img
      src="/drawing.gif"
      alt="User drawing example"
      style={{ marginTop: 16, maxWidth: "100%", height: "auto" }}
    />
  </CenteredContent>,
  <CenteredContent key="step3">
    <Typography variant="h6" sx={{ fontFamily: dialogFontFamily }}>
      After you finish drawing or the timer runs out, you'll receive a score
    </Typography>
    <img
      src="/result.gif"
      alt="Percent score example"
      style={{ marginTop: 16, maxWidth: "100%", height: "auto" }}
    />
  </CenteredContent>,
];

const InstructionsStepperDialog = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [newUser, setNewUser] = useState(false);

  useEffect(() => {
    // Check if the flag is already set in localStorage
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      // Set the flag to indicate that the user has visited
      localStorage.setItem("hasVisited", "true");
      setNewUser(true); // Show the instructions dialog
    }
  }, []);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleClose = () => {
    setActiveStep(0);
    onClose();
  };

  return (
    <CustomDialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <CustomDialogTitle>
        {newUser ? "Welcome New User!" : "Instructions"}
        <CloseButton onClick={handleClose}>
          <CloseIcon />
        </CloseButton>
      </CustomDialogTitle>
      <Box p={3}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box mt={2}>{stepContent[activeStep]}</Box>
      </Box>
      <DialogActions>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          color="primary"
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
            color="primary"
          >
            Next
          </Button>
        )}
      </DialogActions>
    </CustomDialog>
  );
};

export default InstructionsStepperDialog;
