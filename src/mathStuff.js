function chebyshevDistance(x1, y1, x2, y2) {
    return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
}

function closestDistanceChebyshev(targetSet, guessPoint, distanceCounts) {
    let minDistance = Infinity;

    targetSet.forEach((point) => {
        const distance = chebyshevDistance(point[0], point[1], guessPoint[0], guessPoint[1]);
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

export function calculateTotalScoreChebyshev(targetSet, guessSet, updateFilledSquares) {
    let totalScore = 0;
    let distanceCounts = {}; // Object to track distance counts

    const updatedGuessSet = guessSet.map((guessPoint) => {
        // Check if the guess point already exists in the target set
        const existsInTarget = targetSet.some((targetPoint) => targetPoint[0] === guessPoint[0] && targetPoint[1] === guessPoint[1]);

        let minDistance;
        if (!existsInTarget) {
            minDistance = closestDistanceChebyshev(targetSet, guessPoint, distanceCounts);
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

    // Update the state with the new guess points including distances
    // console.log(updatedGuessSet);
    // console.log(totalScore);
    updateFilledSquares(updatedGuessSet);
    console.log('Distance Counts:', distanceCounts);
    return [distanceCounts, updatedGuessSet];
}

export function getRandomPathNearMiddle(gridSize, radius, pathLength) {
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
            { dx: -1, dy: 0 } // Left
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
        while (nextPoint.x < 0 || nextPoint.x >= gridSize || nextPoint.y < 0 || nextPoint.y >= gridSize) {
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

export const numbers = [
    [
        [14, 17],
        [14, 18],
        [13, 18],
        [13, 19],
        [12, 19],
        [12, 20],
        [11, 20],
        [11, 21],
        [12, 21],
        [13, 21],
        [14, 21],
        [15, 21],
        [16, 21],
        [17, 21],
        [18, 21],
        [19, 21],
        [20, 21],
        [21, 21],
        [22, 21],
        [23, 21],
        [24, 21],
        [25, 21],
        [26, 21],
        [27, 21],
        [27, 20],
        [27, 19],
        [27, 18],
        [27, 17],
        [27, 16],
        [27, 22],
        [27, 23],
        [27, 24],
        [27, 25]
    ],
    [
        [12, 15],
        [12, 16],
        [12, 17],
        [12, 18],
        [12, 19],
        [12, 20],
        [12, 21],
        [13, 21],
        [13, 22],
        [14, 22],
        [14, 23],
        [15, 23],
        [16, 23],
        [17, 23],
        [18, 23],
        [19, 23],
        [20, 23],
        [21, 23],
        [22, 23],
        [22, 22],
        [23, 22],
        [24, 22],
        [24, 21],
        [25, 21],
        [26, 20],
        [27, 20],
        [27, 19],
        [28, 18],
        [28, 17],
        [29, 17],
        [29, 16],
        [29, 15],
        [29, 14],
        [28, 14],
        [27, 14],
        [26, 13],
        [25, 13],
        [24, 14],
        [24, 15],
        [23, 15],
        [23, 16],
        [23, 17],
        [23, 18],
        [24, 18],
        [24, 19],
        [24, 20],
        [25, 20],
        [26, 21],
        [26, 22],
        [26, 23],
        [27, 23],
        [27, 24],
        [27, 25],
        [28, 25],
        [28, 26]
    ],
    [
        [13, 17],
        [13, 18],
        [13, 19],
        [13, 20],
        [13, 21],
        [13, 22],
        [13, 23],
        [14, 23],
        [14, 23],
        [14, 23],
        [14, 23],
        [14, 24],
        [15, 24],
        [16, 24],
        [17, 24],
        [18, 24],
        [18, 23],
        [19, 23],
        [19, 22],
        [19, 21],
        [20, 21],
        [20, 20],
        [20, 19],
        [20, 18],
        [20, 17],
        [20, 22],
        [20, 23],
        [21, 23],
        [21, 24],
        [22, 24],
        [23, 24],
        [24, 24],
        [24, 23],
        [25, 23],
        [25, 22],
        [26, 22],
        [26, 21],
        [26, 20],
        [26, 19],
        [26, 18],
        [26, 17]
    ]
];

// const sqaureCoords = [
//     [10, 10],
//     [30, 10],
//     [10, 11],
//     [30, 11],
//     [10, 12],
//     [30, 12],
//     [10, 13],
//     [30, 13],
//     [10, 14],
//     [30, 14],
//     [10, 15],
//     [30, 15],
//     [10, 16],
//     [30, 16],
//     [10, 17],
//     [30, 17],
//     [10, 18],
//     [30, 18],
//     [10, 19],
//     [30, 19],
//     [10, 20],
//     [30, 20],
//     [10, 21],
//     [30, 21],
//     [10, 22],
//     [30, 22],
//     [10, 23],
//     [30, 23],
//     [10, 24],
//     [30, 24],
//     [10, 25],
//     [30, 25],
//     [10, 26],
//     [30, 26],
//     [10, 27],
//     [30, 27],
//     [10, 28],
//     [30, 28],
//     [10, 29],
//     [30, 29],
//     [10, 30],
//     [30, 30],
//     [11, 10],
//     [11, 30],
//     [12, 10],
//     [12, 30],
//     [13, 10],
//     [13, 30],
//     [14, 10],
//     [14, 30],
//     [15, 10],
//     [15, 30],
//     [16, 10],
//     [16, 30],
//     [17, 10],
//     [17, 30],
//     [18, 10],
//     [18, 30],
//     [19, 10],
//     [19, 30],
//     [20, 10],
//     [20, 30],
//     [21, 10],
//     [21, 30],
//     [22, 10],
//     [22, 30],
//     [23, 10],
//     [23, 30],
//     [24, 10],
//     [24, 30],
//     [25, 10],
//     [25, 30],
//     [26, 10],
//     [26, 30],
//     [27, 10],
//     [27, 30],
//     [28, 10],
//     [28, 30],
//     [29, 10],
//     [29, 30]
// ];
