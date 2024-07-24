import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-speechreco',
  templateUrl: './speechreco.component.html',
  styleUrls: ['./speechreco.component.scss']
})
export class SpeechrecoComponent implements OnInit, OnDestroy {
  isListening: boolean = false;
  transcriptLines: string[] = [];
  recognition: any;

  constructor() {
  }

  ngOnInit(): void {
      this.initSpeechRecognition();
  }

  ngOnDestroy(): void {
      if (this.recognition) {
          this.recognition.stop();
      }
  }

  initSpeechRecognition(): void {
      const { webkitSpeechRecognition }: IWindow = window as any;
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                  this.transcriptLines.push(transcript);
              } else {
                  interimTranscript += transcript;
              }
          }
          this.updateTranscript(interimTranscript);
      };

      this.recognition.onerror = (event: any) => {
          console.error(event.error);
          this.isListening = false;
      };

      this.recognition.onend = () => {
          this.isListening = false;
      };
  }

  toggleListening(): void {
      this.isListening = !this.isListening;
      if (this.isListening) {
          this.recognition.start();
      } else {
          this.recognition.stop();
      }
  }

  updateTranscript(interimTranscript: string): void {
      const interimElement = document.getElementById('interim');
      if (interimElement) {
          interimElement.innerHTML = interimTranscript;
      }
  }
}


interface IWindow extends Window {
webkitSpeechRecognition: any;
}
