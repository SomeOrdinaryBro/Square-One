
class SoundService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  init() {
    if (typeof window !== 'undefined' && !this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0, volume: number = 0.1) {
    if (!this.enabled || !this.ctx) return;
    
    // Resume context if needed (browsers pause auto-play audio)
    if (this.ctx.state === 'suspended') {
        this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + startTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(this.ctx.currentTime + startTime);
    osc.stop(this.ctx.currentTime + startTime + duration);
  }

  playSelect() {
    // Soft tick
    this.playTone(400, 'sine', 0.05, 0, 0.05);
  }

  playMove() {
    // Crisp tick
    this.playTone(600, 'triangle', 0.1, 0, 0.1);
  }

  playCapture() {
    // Punchy crunch
    this.playTone(150, 'sawtooth', 0.15, 0, 0.15);
    this.playTone(100, 'square', 0.1, 0, 0.1);
  }

  playError() {
    // Low buzz
    this.playTone(150, 'sawtooth', 0.3, 0, 0.1);
    this.playTone(140, 'sawtooth', 0.3, 0.1, 0.1);
  }

  playSuccess() {
    // Major chord arpeggio
    this.playTone(523.25, 'sine', 0.3, 0, 0.1); // C5
    this.playTone(659.25, 'sine', 0.3, 0.1, 0.1); // E5
    this.playTone(783.99, 'sine', 0.6, 0.2, 0.1); // G5
  }
  
  playPanic() {
      // High tempo ticker
      this.playTone(800, 'square', 0.05, 0, 0.05);
  }
}

export const soundManager = new SoundService();
