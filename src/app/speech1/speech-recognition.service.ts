// speech-recognition.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  recognition: any;

  constructor() {
    const { webkitSpeechRecognition }: IWindow = window as any;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.continuous = false;
  }

  init() {
    this.recognition.onresult = (event: any) => {
      console.log('Recognition result:', event);
    };
  }

  listenFor(seconds: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.recognition.start();
      setTimeout(() => {
        this.recognition.stop();
      }, seconds * 1000);

      this.recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        resolve(result);
      };

      this.recognition.onerror = (event: any) => {
        reject(event.error);
      };
    });
  }
}

interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
