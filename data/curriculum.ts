
import { Chapter } from '../types';

// Helper to add kings to corners if not present, but we'll manually construct valid FENs
// Standard positions: White King h1, Black King h8 (to avoid conflict with center/demos)

export const CURRICULUM: Chapter[] = [
  {
    id: 'intro-rook',
    title: '1. The Tower (Rook)',
    description: 'Learn the first piece: The Rook. It moves in straight lines.',
    levels: [
      {
        id: '1-1',
        fen: '7k/8/8/8/4R3/8/8/7K w - - 0 1', // Kings added at corners
        instruction: 'Click the white piece in the center to select it.',
        mentorText: "Hello! I'm Bit. I'll teach you chess. See that tower? That's a Rook. Click it.",
        goalType: 'select',
        targetSquare: 'none',
        requiredPiece: 'r',
        hideKings: true
      },
      {
        id: '1-2',
        fen: '7k/8/8/8/4R3/8/8/7K w - - 0 1',
        instruction: 'Move the Rook to the highlighted square at the top.',
        mentorText: "Rooks move in straight lines like a robot. Up, down, left, right. Try moving it UP.",
        goalType: 'move_to',
        targetSquare: 'e8',
        requiredPiece: 'r',
        hideKings: true
      },
      {
        id: '1-3',
        fen: '4k3/8/8/8/8/8/R7/4K3 w - - 0 1', // Kings centered to avoid corners for this specific route
        instruction: 'Reach the other side of the board.',
        mentorText: "Good! Now, try moving all the way to the right. One giant slide.",
        goalType: 'move_to',
        targetSquare: 'h2',
        requiredPiece: 'r',
        hideKings: true
      },
      {
        id: '1-4',
        fen: '7k/1p6/8/8/1R6/8/8/7K w - - 0 1',
        instruction: 'Capture the black pawn.',
        mentorText: "See that little black piece? It's in your way. In chess, we 'capture' by landing on top of them. Smash it!",
        goalType: 'capture',
        targetSquare: 'b7',
        requiredPiece: 'r',
        hideKings: true
      }
    ]
  },
  {
    id: 'bishop',
    title: '2. The Sniper (Bishop)',
    description: 'Bishops move diagonally.',
    levels: [
      {
        id: '2-1',
        fen: '7k/8/8/8/8/8/8/K2B4 w - - 0 1',
        instruction: 'Move the Bishop diagonally.',
        mentorText: "This pointy hat guy is a Bishop. He only walks on diagonal lines. Try moving him.",
        goalType: 'move_to',
        targetSquare: 'h5',
        requiredPiece: 'b',
        hideKings: true
      },
      {
        id: '2-2',
        fen: 'k7/6p1/8/4B3/8/8/8/K7 w - - 0 1',
        instruction: 'Capture the black piece.',
        mentorText: "Diagonal power! Capture that enemy piece.",
        goalType: 'capture',
        targetSquare: 'g7',
        requiredPiece: 'b',
        hideKings: true
      },
      {
        id: '2-3',
        fen: '7k/8/8/2p5/8/8/4B3/7K w - - 0 1',
        instruction: 'Capture the distant pawn.',
        mentorText: "Bishops can slide as far as they want, as long as the path is clear.",
        goalType: 'capture',
        targetSquare: 'c5',
        requiredPiece: 'b',
        hideKings: true
      }
    ]
  },
  {
    id: 'king-safety',
    title: '3. The King (Survival)',
    description: 'The King is slow, but he is the most important.',
    levels: [
      {
        id: '3-1',
        fen: '7k/8/8/8/4K3/8/8/8 w - - 0 1',
        instruction: 'Move the King one step.',
        mentorText: "This is the King. He's old and slow. He can only move 1 square at a time.",
        goalType: 'move_to',
        targetSquare: 'e5',
        requiredPiece: 'k',
        hideKings: false
      },
      {
        id: '3-2',
        fen: '7k/8/8/3r4/4K3/8/8/8 w - - 0 1',
        instruction: 'Move to a safe square (Green).',
        mentorText: "Watch out! That black Rook controls the line. Don't step into the laser beam! Move away.",
        goalType: 'move_to',
        targetSquare: 'f3',
        requiredPiece: 'k',
        hideKings: false
      }
    ]
  },
  {
    id: 'knight',
    title: '4. The Horse (Knight)',
    description: 'Knights jump in an L shape.',
    levels: [
      {
        id: '4-1',
        fen: '7k/8/8/8/4N3/8/8/7K w - - 0 1',
        instruction: 'Select the Knight to see how it moves.',
        mentorText: "This is the Knight. It moves in an 'L' shape. Two steps one way, then one step to the side.",
        goalType: 'select',
        targetSquare: 'none',
        requiredPiece: 'n',
        hideKings: true
      },
      {
        id: '4-2',
        fen: '7k/8/3p4/8/4N3/8/8/7K w - - 0 1',
        instruction: 'Jump over the gap and capture.',
        mentorText: "Knights can jump over walls! Go get that pawn.",
        goalType: 'capture',
        targetSquare: 'd6',
        requiredPiece: 'n',
        hideKings: true
      }
    ]
  },
  {
    id: 'patterns',
    title: '5. Ninja Patterns (Speed)',
    description: 'Master common tricks. Think fast!',
    levels: [
      {
        id: '5-1',
        // White Knight d4. Black King e8, Rook a8.
        fen: 'r3k3/8/8/8/3N4/8/8/7K w - - 0 1', 
        instruction: 'Attack TWO pieces at once!',
        mentorText: "This is a FORK. Move the Knight to hit both the King and the Rook!",
        goalType: 'move_to',
        targetSquare: 'c6',
        requiredPiece: 'n',
        timeLimit: 10,
        hideKings: false
      },
      {
        id: '5-2',
        // White Bishop b2. Black King f6, Queen g7.
        fen: '8/6q1/5k2/8/8/8/1B6/7K w - - 0 1',
        instruction: 'Attack through the King!',
        mentorText: "This is a SKEWER (X-Ray). Attack the King so he must move, leaving the Queen behind.",
        goalType: 'move_to',
        targetSquare: 'e5',
        requiredPiece: 'b',
        timeLimit: 10,
        hideKings: false
      },
      {
        id: '5-3',
        // White Rook h1. Black King e8, Queen e4.
        fen: '4k3/8/8/8/4q3/8/8/7R w - - 0 1',
        instruction: 'Freeze the Queen!',
        mentorText: "This is a PIN. Move the Rook to trap the Queen against the King.",
        goalType: 'move_to',
        targetSquare: 'e1',
        requiredPiece: 'r',
        timeLimit: 10,
        hideKings: false
      },
      {
        id: '5-4',
        // Back Rank Mate. White Rook a1. Black King g8, pawns f7,g7,h7.
        fen: '6k1/5ppp/8/8/8/8/8/R6K w - - 0 1',
        instruction: 'Deliver Checkmate!',
        mentorText: "The King is trapped behind his wall. Slide down for the win!",
        goalType: 'move_to',
        targetSquare: 'a8',
        requiredPiece: 'r',
        timeLimit: 8,
        hideKings: false
      }
    ]
  }
];
