// speech-synthesis.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechSynthesisService {
  synth: SpeechSynthesis;
  voices: SpeechSynthesisVoice[];

  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = this.synth.getVoices();
  }

  speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      //utterance.voice = this.voices.find(voice => voice.lang === 'en-US' && voice.gender === 'female');
      utterance.onend = () => resolve();
      this.synth.speak(utterance);
    });
  }
}
