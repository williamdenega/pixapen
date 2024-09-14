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

// Font families
const titleFontFamily = '"Pixelify Sans", "Press Start 2P", monospace';
const bodyFontFamily = '"Arial", "Roboto", sans-serif';

// Styled Dialog component
const CustomDialog = styled(Dialog)({
  "& .MuiPaper-root": {
    backgroundColor: "#fff",
    border: "4px solid #000",
    borderRadius: "0px",
    boxShadow: "8px 8px 0px rgba(0, 0, 0, 0.2)",
  },
});

// Styled DialogTitle to customize the title
const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  textAlign: "center",
  fontSize: "2rem",
  fontWeight: "bold",
  padding: theme.spacing(2),
  position: "relative",
  fontFamily: bodyFontFamily,
  borderBottom: "4px solid #000",
  backgroundColor: "#66CED6",
}));

// Styled IconButton for the close button
const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  left: theme.spacing(1),
  color: "#000",
}));

// Container for centered content
const CenteredContent = styled("div")(({ theme }) => ({
  textAlign: "center",
  margin: theme.spacing(2, 0),
}));

const StyledList = styled("ul")(({ theme }) => ({
  listStyle: "none",
  padding: 0,
  margin: theme.spacing(2, 0),
  fontFamily: bodyFontFamily,
  fontSize: "1.2rem",
}));

const StyledListItem = styled("li")({
  marginBottom: "8px",
});

const ReportDialog = ({ open, onClose, scoreData }) => {
  const distanceCounts = scoreData?.distanceCounts || {};
  const missingTargetPointsCount = scoreData?.missingTargetPointsCount || 0;
  const percent = scoreData?.percent || "0.00";

  // Function to handle the share button click
  const handleShare = async () => {
    if (navigator.share) {
      try {
        const distanceCountsText = Object.entries(distanceCounts)
          .map(([distance, count]) => {
            const distanceText =
              distance === "0"
                ? "correct 🟩"
                : distance === "1"
                  ? "1 space away 🟨"
                  : distance === "2"
                    ? "2 spaces away 🟧"
                    : `${distance} spaces away 🟥`;
            return `${count} squares ${distanceText}`;
          })
          .join("\n"); // Use newline characters to separate lines

        const shareText = `I scored ${percent}% in PixaPen!\n\n${distanceCountsText}\n\nMissed squares: ${missingTargetPointsCount} ❌`;

        await navigator.share({
          title: "Check out my game score!",
          text: shareText,
          url: window.location.href, // or any relevant URL
        });
        console.log("Share was successful.");
      } catch (error) {
        console.log("Sharing failed:", error);
      }
    } else {
      console.log("Share API not supported");
    }
  };

  // Determine the emoji based on the percentage score
  const scoreEmoji =
    parseFloat(percent) >= 90
      ? "🏆"
      : parseFloat(percent) >= 80
        ? "👍"
        : parseFloat(percent) >= 70
          ? "😊"
          : parseFloat(percent) == 69
            ? "😉"
            : parseFloat(percent) >= 60
              ? "😐"
              : parseFloat(percent) >= 50
                ? "😕"
                : parseFloat(percent) >= 40
                  ? "😞"
                  : "😢";

  return (
    <CustomDialog open={open} onClose={onClose}>
      <CustomDialogTitle>
        RESULTS
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </CustomDialogTitle>
      <DialogContent>
        <CenteredContent>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontFamily: bodyFontFamily,
              fontSize: "4rem",
              fontWeight: "bold",
              color: "#000",
            }}
          >
            {percent}% {scoreEmoji}
          </Typography>
        </CenteredContent>
        <StyledList>
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
                <StyledListItem key={distance}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", fontFamily: bodyFontFamily }}
                  >
                    {count} squares {distanceText}
                  </Typography>
                </StyledListItem>
              );
            })
          ) : (
            <StyledListItem>
              <Typography
                variant="body1"
                sx={{ fontFamily: bodyFontFamily }}
              >
                No distance counts available
              </Typography>
            </StyledListItem>
          )}
          <StyledListItem>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", fontFamily: bodyFontFamily }}
            >
              {missingTargetPointsCount} missed squares ❌
            </Typography>
          </StyledListItem>
        </StyledList>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", padding: 2 }}>
        <Button
          variant="contained"
          endIcon={<ShareIcon />}
          sx={{
            fontFamily: bodyFontFamily,
            fontSize: "1.5rem",
            padding: "16px 32px",
            backgroundColor: "#66CED6",
            color: "#000",
            border: "4px solid #000",
            borderRadius: "0px",
            boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.2)",
            textTransform: "uppercase",
            "&:hover": {
              backgroundColor: "#4db4c1",
            },
          }}
          onClick={handleShare}
        >
          Share
        </Button>
      </DialogActions>
    </CustomDialog>
  );
};

export default ReportDialog;
