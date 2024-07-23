import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  recognition: any;
  isListening = false;

  constructor() {
    const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
  }

  startRecognition(callback: (result: string) => void, errorCallback: (error: string) => void) {
    this.recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      callback(transcript);
    };

    this.recognition.onerror = (event: any) => {
      errorCallback(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.isListening = true;
    this.recognition.start();
  }

  stopRecognition() {
    this.isListening = false;
    this.recognition.stop();
  }

  startListening(callback: (result: string) => void, errorCallback: (error: string) => void) {
    this.startRecognition(callback, errorCallback);
  }

  stopListening() {
    this.stopRecognition();
  }
}

interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
