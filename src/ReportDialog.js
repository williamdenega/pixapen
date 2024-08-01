import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ShareIcon from "@mui/icons-material/Share";
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
  left: theme.spacing(1),
}));

// Container for centered content
const CenteredContent = styled("div")(({ theme }) => ({
  textAlign: "center",
  margin: theme.spacing(2, 0),
  fontFamily: dialogFontFamily,
}));

const ReportDialog = ({ open, onClose, scoreData }) => {
  const distanceCounts = scoreData?.distanceCounts || {};
  const missingTargetPointsCount = scoreData?.missingTargetPointsCount || 0;
  const percent = scoreData?.percent || "0.00";

  return (
    <CustomDialog open={open} onClose={onClose}>
      <CustomDialogTitle>
        Results
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </CustomDialogTitle>
      <DialogContent>
        <CenteredContent>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontFamily: dialogFontFamily }}
          >
            {percent}% {parseFloat(percent) > 90 && "🏆"}
          </Typography>
        </CenteredContent>
        {/* <Typography
          variant="h6"
          gutterBottom
          sx={{ fontFamily: dialogFontFamily }}
        >
          Distance Counts
        </Typography> */}
        <ul>
          {Object.entries(distanceCounts).length > 0 ? (
            Object.entries(distanceCounts).map(([distance, count]) => {
              const distanceText =
                distance === "0"
                  ? "correct 🟩"
                  : distance === "1"
                  ? "1 space away 🟨"
                  : distance === "2"
                  ? "2 spaces away 🟧"
                  : `${distance} spaces away 🟥`;

              return (
                <li key={distance}>
                  <strong>
                    {count} squares {distanceText}
                  </strong>
                </li>
              );
            })
          ) : (
            <li>No distance counts available</li>
          )}
          <li>
            <strong> {missingTargetPointsCount} missed squares ❌</strong>
          </li>
        </ul>
        {/* <CenteredContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontFamily: dialogFontFamily }}
          >
            Missed Squares: {missingTargetPointsCount}
          </Typography>
        </CenteredContent> */}
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          startIcon={<ShareIcon />}
          sx={{ fontFamily: dialogFontFamily }}
        >
          Share
        </Button>
      </DialogActions>
    </CustomDialog>
  );
};

export default ReportDialog;
