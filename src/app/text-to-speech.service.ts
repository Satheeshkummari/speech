import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {
  private synth: SpeechSynthesis;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    this.synth.speak(utterance);
  }

  stopSpeaking() {
    this.synth.cancel();
  }
}
