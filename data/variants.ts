import { VariantScenario } from '../types';

export const VARIANTS: VariantScenario[] = [
  {
    id: 'pawn-wars',
    name: 'Pawn Wars',
    description: 'Advance your pawn phalanx and learn how to coordinate breakthroughs.',
    fen: '8/1ppppppp/8/8/8/8/PPPPPPP1/8 w - - 0 1'
  },
  {
    id: 'queen-hunt',
    name: 'Queen Hunt',
    description: 'Black brought the Queen out too early. Punish the overextension.',
    fen: 'rnb1kbnr/pppp1ppp/8/4q3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 1 3'
  },
  {
    id: 'endgame-drill',
    name: 'Endgame Drill',
    description: 'Classic rook and king versus king. Practice precision.',
    fen: '8/8/8/4k3/8/8/4R3/4K3 w - - 0 1'
  }
];
