import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-speech',
  templateUrl: './speech.component.html',
  styleUrls: ['./speech.component.scss']
})
export class SpeechComponent implements OnInit, OnDestroy {
  recognition: any;
  isListening = false;
  isSpeaking = false;
  transcript = '';
  audioContext: AudioContext;
  analyser: AnalyserNode;
  microphone: MediaStreamAudioSourceNode;
  javascriptNode: ScriptProcessorNode;
  threshold = 0.02; // Set your desired threshold for noise filtering

  constructor() {
    const { webkitSpeechRecognition }: IWindow = window as any;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onresult = (event: any) => {
      const interimTranscript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      this.transcript = interimTranscript;
    };

    this.recognition.onspeechstart = () => {
      this.isSpeaking = true;
      console.log('Speech started');
    };

    this.recognition.onspeechend = () => {
      this.isSpeaking = false;
      console.log('Speech ended');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Recognition ended');
    };
  }

  ngOnInit() {
    this.initAudioProcessing();
  }

  ngOnDestroy() {
    this.audioContext.close();
    this.microphone.disconnect();
    this.analyser.disconnect();
    this.javascriptNode.disconnect();
  }

  startRecording() {
    this.isListening = true;
    this.recognition.start();
  }

  stopRecording() {
    this.isListening = false;
    this.recognition.stop();
  }

  initAudioProcessing() {
    this.audioContext = new AudioContext();
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.javascriptNode = this.audioContext.createScriptProcessor(2048, 1, 1);

      this.analyser.smoothingTimeConstant = 0.8;
      this.analyser.fftSize = 1024;

      this.microphone.connect(this.analyser);
      this.analyser.connect(this.javascriptNode);
      this.javascriptNode.connect(this.audioContext.destination);

      this.javascriptNode.onaudioprocess = () => {
        const array = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(array);
        const volume = array.reduce((acc, val) => acc + val, 0) / array.length;
        const normalizedVolume = volume / 255;

        if (normalizedVolume > this.threshold) {
          if (!this.isListening) {
            this.startRecording();
          }
        } else {
          if (this.isListening) {
            this.stopRecording();
          }
        }
      };
    }).catch(err => {
      console.error('Error accessing microphone:', err);
    });
  }
}

interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
