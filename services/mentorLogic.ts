
import { LevelTask } from "../types";

export class MentorLogic {
  
  static getGreeting(streak: number, retries: number): string {
    if (retries > 2) {
      return this.pick([
        "Don't worry. Strategy takes patience. Try again.",
        "Take a deep breath. Look at the board clearly.",
        "We learn more from failure than success. Let's go."
      ]);
    }
    
    if (streak >= 3) {
      return this.pick([
        "You're on fire! Keep that momentum going.",
        "Unstoppable! Let's see if you can handle this one.",
        "Focus is sharp today. I like it."
      ]);
    }

    return this.pick([
      "Ready? Let's solve this.",
      "New board. New puzzle.",
      "Show me what you've got.",
      "Analyze the board first, then move."
    ]);
  }

  static getMistakeReaction(context: 'danger' | 'miss' | 'general' = 'general'): string {
    if (context === 'danger') {
      return this.pick([
        "Oh no! You walked into a trap!",
        "Danger! That square is controlled by the enemy.",
        "Watch out! They will capture you there.",
        "That's not safe! Abort!"
      ]);
    }

    if (context === 'miss') {
      return this.pick([
        "Not quite the target. Look again.",
        "Valid move, but not the goal.",
        "You missed the objective. Try a different square.",
        "Close, but we need to hit the specific target."
      ]);
    }

    return this.pick([
      "Not quite. Rewinding...",
      "Careful! Check your lines.",
      "Oops. Try a different path.",
      "That move didn't work. Let's take it back.",
      "Almost! But chess is about precision."
    ]);
  }

  static getSuccessReaction(streak: number): string {
    if (streak >= 3) {
      return this.pick([
        "Brilliant! You're getting good at this.",
        "Perfect execution!",
        "Strategy confirmed. Excellent work.",
        "Grandmaster in the making!"
      ]);
    }
    return this.pick([
      "Good job.",
      "Correct.",
      "Well done.",
      "That's it!",
      "Exactly right."
    ]);
  }

  static getPanicMessage(): string {
    return this.pick([
      "Hurry! Time is ticking!",
      "Think fast! Clock is red!",
      "Don't freeze! Make a move!",
      "Seconds left! Go go go!"
    ]);
  }

  static getSpamWarning(): string {
    return this.pick([
      "Whoa, slow down! Think first, click second.",
      "Too fast! You're guessing, not thinking.",
      "Calm down. Breathe. Look at the board.",
      "Random clicking won't help. Strategy will."
    ]);
  }

  static getPieceTip(pieceType: string): string {
    switch (pieceType) {
      case 'p': return "Pawns are small but brave. They only move forward.";
      case 'n': return "The Knight is tricky. It jumps over other pieces!";
      case 'b': return "Bishops love diagonals. They stay on one color forever.";
      case 'r': return "Rooks are like tanks. They crash through straight lines.";
      case 'q': return "The Queen is the boss. She moves however she wants.";
      case 'k': return "The King is precious. Keep him safe at all costs.";
      default: return "Selected. Now, where to go?";
    }
  }

  static getIdleHint(level: LevelTask): string {
    const pieceName = level.requiredPiece ? this.getPieceName(level.requiredPiece) : "piece";
    
    if (level.goalType === 'move_to') {
      return this.pick([
        `Stuck? Try selecting the ${pieceName}.`,
        "Look for the highlighted square.",
        `The ${pieceName} needs to reach the target.`,
        "Just click the piece to see where it can go."
      ]);
    }
    
    if (level.goalType === 'capture') {
      return this.pick([
        "See that enemy piece? It's vulnerable.",
        `Your ${pieceName} can capture it.`,
        "Attack! Take the enemy piece off the board.",
        "Find the path to capture."
      ]);
    }
    
    if (level.goalType === 'survive') {
      return this.pick([
        "Danger is close. Find a green square.",
        "Don't stay there! You'll be captured.",
        "Run! Move to safety.",
        "Check which squares are safe."
      ]);
    }

    return "Need a hand? Follow the instructions.";
  }

  private static getPieceName(p: string): string {
    const names: Record<string, string> = {
      'p': 'Pawn', 'n': 'Knight', 'b': 'Bishop', 
      'r': 'Rook', 'q': 'Queen', 'k': 'King'
    };
    return names[p] || 'piece';
  }

  private static pick(options: string[]): string {
    return options[Math.floor(Math.random() * options.length)];
  }
}
