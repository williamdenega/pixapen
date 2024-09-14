
function chebyshevDistance(x1, y1, x2, y2) {
  return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
}

function closestDistanceChebyshev(targetSet, guessPoint, distanceCounts) {
  let minDistance = Infinity;

  targetSet.forEach((point) => {
    const distance = chebyshevDistance(
      point[0],
      point[1],
      guessPoint[0],
      guessPoint[1]
    );
    if (distance < minDistance) {
      minDistance = distance;
    }
  });

  // Update the distance count
  if (distanceCounts[minDistance] !== undefined) {
    distanceCounts[minDistance]++;
  } else {
    distanceCounts[minDistance] = 1;
  }

  return minDistance;
}

function calculateExponentialPenalty(distance) {
  // Exponential penalty function (e.g., penalty = 2^distance)
  return Math.pow(2, distance);
}

export function calculateTotalScoreChebyshev(
  targetSet,
  guessSet,
  updateFilledSquares
) {
  let totalScore = 0;
  let distanceCounts = {}; // Object to track distance counts

  // Convert targetSet and guessSet to Sets for uniqueness
  const uniqueTargetSet = new Set(targetSet.map((point) => point.join(",")));
  const uniqueGuessSet = new Set(guessSet.map((point) => point.join(",")));

  const updatedGuessSet = guessSet.map((guessPoint) => {
    // Check if the guess point already exists in the target set
    const existsInTarget = uniqueTargetSet.has(guessPoint.join(","));

    let minDistance;
    if (!existsInTarget) {
      minDistance = closestDistanceChebyshev(
        targetSet,
        guessPoint,
        distanceCounts
      );
      const penalty = calculateExponentialPenalty(minDistance);
      totalScore -= penalty; // Deduct exponential penalty based on distance
    } else {
      // If the distance is zero (point exists in target), still track it
      if (distanceCounts[0] !== undefined) {
        distanceCounts[0]++;
      } else {
        distanceCounts[0] = 1;
      }
      minDistance = 0;
    }
    return [...guessPoint, minDistance];
  });

  // Calculate how many unique targetSet points were not in unique guessSet
  const missingTargetPointsCount = Array.from(uniqueTargetSet).reduce(
    (count, targetPoint) => {
      const targetKey = targetPoint;
      if (!uniqueGuessSet.has(targetKey)) {
        count++;
      }
      return count;
    },
    0
  );
  //   const perfectScore =
  //     (distanceCounts["0"] ? distanceCounts["0"] : 0 + missingTargetPointsCount) *
  //     100;
  //   //   const userScore = (distanceCounts)
  //   const missedPointsPenalty = missingTargetPointsCount * 100;
  // Update the state with the new guess points including distances
  updateFilledSquares(updatedGuessSet);
  //   console.log("Distance Counts:", distanceCounts);
  //   console.log("Missing Target Points Count:", missingTargetPointsCount);
  // Base value per pixel
  // Base value per pixel
  const baseValuePerPixel = 100;

  // Penalty per space away from the target
  const penaltyPerSpace = 25;

  // Calculate total points from correctly placed pixels
  const totalPixels = Object.entries(distanceCounts).reduce(
    (total, [distance, count]) => {
      const distanceValue = parseInt(distance, 10);
      const penalty = distanceValue * penaltyPerSpace;
      return total + (baseValuePerPixel - penalty) * count;
    },
    0
  );

  // Calculate penalty for missed target points
  const missedTargetPenalty = missingTargetPointsCount * penaltyPerSpace;

  // Calculate the final score
  const finalScore = totalPixels - missedTargetPenalty;

  // Calculate the perfect score
  const totalPixelsCount =
    Object.values(distanceCounts).reduce((sum, count) => sum + count, 0) +
    missingTargetPointsCount;
  const perfectScore = totalPixelsCount * baseValuePerPixel;

  // Calculate the percentage score
  //   const percentageScore = (finalScore / perfectScore) * 100;
  const clampedPercentageScore = Math.max((finalScore / perfectScore) * 100, 0);
  //   constg
  const percent = clampedPercentageScore.toFixed(2);
  //   console.log(`Final Score: ${finalScore}`);
  //   console.log(`Perfect Score: ${perfectScore}`);
  //   console.log(`Percentage Score: ${clampedPercentageScore.toFixed(2)}%`);
  return [distanceCounts, updatedGuessSet, missingTargetPointsCount, percent];
}

export function getDailyPath(gridSize, radius, pathLength, rng) {
  // Function to get a random point near the middle
  function getRandomPointNearMiddle(gridSize, radius) {
    const centerX = Math.floor(gridSize / 2);
    const centerY = Math.floor(gridSize / 2);
    const minX = Math.max(0, centerX - radius);
    const maxX = Math.min(gridSize - 1, centerX + radius);
    const minY = Math.max(0, centerY - radius);
    const maxY = Math.min(gridSize - 1, centerY + radius);

    const x = Math.floor(rng() * (maxX - minX + 1)) + minX;
    const y = Math.floor(rng() * (maxY - minY + 1)) + minY;

    return { x, y };
  }

  // Function to get the next point from the current point
  function getNextPoint(x, y) {
    const directions = [
      { dx: 0, dy: 1 },  // Down
      { dx: 0, dy: -1 }, // Up
      { dx: 1, dy: 0 },  // Right
      { dx: -1, dy: 0 }, // Left
    ];

    const dir = directions[Math.floor(rng() * directions.length)];
    const nextX = x + dir.dx;
    const nextY = y + dir.dy;

    return { x: nextX, y: nextY };
  }

  let path = [];
  let currentPoint = getRandomPointNearMiddle(gridSize, radius);
  path.push([currentPoint.x, currentPoint.y]);

  for (let i = 1; i < pathLength; i++) {
    let nextPoint = getNextPoint(currentPoint.x, currentPoint.y);

    // Ensure the next point is within the grid boundaries
    while (
      nextPoint.x < 0 ||
      nextPoint.x >= gridSize ||
      nextPoint.y < 0 ||
      nextPoint.y >= gridSize
    ) {
      nextPoint = getNextPoint(currentPoint.x, currentPoint.y);
    }

    path.push([nextPoint.x, nextPoint.y]);
    currentPoint = nextPoint;
  }

  return path;
}


export function getRandomPath(gridSize, radius, pathLength) {
  // Function to get a random point near the middle
  function getRandomPointNearMiddle(gridSize, radius) {
    const centerX = Math.floor(gridSize / 2);
    const centerY = Math.floor(gridSize / 2);
    const minX = Math.max(0, centerX - radius);
    const maxX = Math.min(gridSize - 1, centerX + radius);
    const minY = Math.max(0, centerY - radius);
    const maxY = Math.min(gridSize - 1, centerY + radius);

    const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

    return { x, y };
  }

  // Function to get the next point from the current point
  function getNextPoint(x, y) {
    const directions = [
      { dx: 0, dy: 1 }, // Down
      { dx: 0, dy: -1 }, // Up
      { dx: 1, dy: 0 }, // Right
      { dx: -1, dy: 0 }, // Left
    ];

    const dir = directions[Math.floor(Math.random() * directions.length)];
    const nextX = x + dir.dx;
    const nextY = y + dir.dy;

    return { x: nextX, y: nextY };
  }

  let path = [];
  let currentPoint = getRandomPointNearMiddle(gridSize, radius);
  path.push([currentPoint.x, currentPoint.y]);

  for (let i = 1; i < pathLength; i++) {
    let nextPoint = getNextPoint(currentPoint.x, currentPoint.y);

    // Ensure the next point is within the grid boundaries
    while (
      nextPoint.x < 0 ||
      nextPoint.x >= gridSize ||
      nextPoint.y < 0 ||
      nextPoint.y >= gridSize
    ) {
      nextPoint = getNextPoint(currentPoint.x, currentPoint.y);
    }

    path.push([nextPoint.x, nextPoint.y]);
    currentPoint = nextPoint;
  }
  // setCoords(path);
  // console.log(coords);
  // console.log(path)
  return path;
}


// export function getRandomPathNearMiddle(gridSize, radius, pathLength) {
//   // Function to get a random point near the middle
//   function getRandomPointNearMiddle(gridSize, radius) {
//     const centerX = Math.floor(gridSize / 2);
//     const centerY = Math.floor(gridSize / 2);
//     const minX = Math.max(0, centerX - radius);
//     const maxX = Math.min(gridSize - 1, centerX + radius);
//     const minY = Math.max(0, centerY - radius);
//     const maxY = Math.min(gridSize - 1, centerY + radius);

//     const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
//     const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

//     return { x, y };
//   }

//   // Function to get the next point from the current point
//   function getNextPoint(x, y, visited) {
//     const directions = [];

//     // Check available directions and prevent moving off the grid
//     if (y + 1 < gridSize && !visited.has(`${x},${y + 1}`))
//       directions.push({ dx: 0, dy: 1 }); // Down
//     if (y - 1 >= 0 && !visited.has(`${x},${y - 1}`))
//       directions.push({ dx: 0, dy: -1 }); // Up
//     if (x + 1 < gridSize && !visited.has(`${x + 1},${y}`))
//       directions.push({ dx: 1, dy: 0 }); // Right
//     if (x - 1 >= 0 && !visited.has(`${x - 1},${y}`))
//       directions.push({ dx: -1, dy: 0 }); // Left

//     if (directions.length === 0) {
//       return null; // No valid moves available
//     }

//     const dir = directions[Math.floor(Math.random() * directions.length)];
//     return { x: x + dir.dx, y: y + dir.dy };
//   }

//   let path = [];
//   let visited = new Set();
//   let currentPoint = getRandomPointNearMiddle(gridSize, radius);
//   path.push([currentPoint.x, currentPoint.y]);
//   visited.add(`${currentPoint.x},${currentPoint.y}`);

//   for (let i = 1; i < pathLength; i++) {
//     let nextPoint = getNextPoint(currentPoint.x, currentPoint.y, visited);

//     if (nextPoint === null) {
//       // No valid moves available; terminate the path early
//       break;
//     }

//     path.push([nextPoint.x, nextPoint.y]);
//     visited.add(`${nextPoint.x},${nextPoint.y}`);
//     currentPoint = nextPoint;
//   }

//   return path;
// }
