import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
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
  fontFamily: dialogFontFamily,
}));

// Container for centered content
const CenteredContent = styled(Box)(({ theme }) => ({
  textAlign: "center",
  margin: theme.spacing(2, 0),
  fontFamily: dialogFontFamily,
}));

const difficultyDescriptions = {
  easy: {
    displayTime: "3 seconds",
    drawTime: "10 seconds",
    description:
      "The shape is displayed for 3 seconds and you have 10 seconds to draw it.",
  },
  medium: {
    displayTime: "1 second",
    drawTime: "5 seconds",
    description:
      "The shape is displayed for 1 second and you have 5 seconds to draw it.",
  },
  hard: {
    displayTime: "1 second",
    drawTime: "3 seconds",
    description:
      "The shape is displayed for 1 second and you have 3 seconds to draw it.",
  },
  "super-duper-crazy-hard": {
    displayTime: "none",
    drawTime: "5 seconds",
    description:
      "The shape is not displayed, but you have 5 seconds to draw it.",
  },
};

const SettingsDialog = ({ open, onClose, currentDifficulty, onSave }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    currentDifficulty || "easy"
  );

  const handleChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  const handleSave = () => {
    // onSave(selectedDifficulty);
    onClose();
  };

  const difficulty = difficultyDescriptions[selectedDifficulty];

  return (
    <CustomDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <CustomDialogTitle>DOESNT WORK YET TOP G</CustomDialogTitle>
      <CenteredContent>
        <Typography variant="h6" sx={{ fontFamily: dialogFontFamily }}>
          Choose Difficulty Level
        </Typography>
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={selectedDifficulty}
            onChange={handleChange}
            label="Difficulty"
          >
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
            <MenuItem value="super-duper-crazy-hard">
              Super Duper Crazy Hard
            </MenuItem>
          </Select>
        </FormControl>
        <Box mt={2}>
          {/* <Typography variant="body1" sx={{ fontFamily: dialogFontFamily }}>
            {difficulty.description}
          </Typography> */}
          <Typography
            variant="body2"
            sx={{ fontFamily: dialogFontFamily, marginTop: 1 }}
          >
            Shape Display Time: {difficulty.displayTime}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: dialogFontFamily }}>
            Drawing Time: {difficulty.drawTime}
          </Typography>
        </Box>
      </CenteredContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </CustomDialog>
  );
};

export default SettingsDialog;
