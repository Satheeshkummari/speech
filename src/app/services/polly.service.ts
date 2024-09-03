import { Injectable } from '@angular/core';
// import * as AWS from 'aws-sdk';
declare const AWS: any;

@Injectable({
  providedIn: 'root'
})
export class PollyService {
  private polly: AWS.Polly;

  constructor() {
    AWS.config.update({
      region: 'ap-southeast-2', // your region
      // region: 'us-east-1', // your region
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'hp-southeast-2:8b995ac9-3184-438b-9d29-0445e6c6d672' // Your Identity Pool ID
      })
    });

    this.polly = new AWS.Polly();
  }

  // Common method to handle speech synthesis, playback, and callback
  playSpeechWithCallback(text: string, voiceId: string = 'Joanna', languageCode: string = 'en-US', callback: () => void) {
    const params = {
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: voiceId,
      LanguageCode: languageCode
    };

    return this.polly.synthesizeSpeech(params).promise()
      .then(data => {
        if (data.AudioStream) {
          const audio = this.createAudio(data.AudioStream as ArrayBuffer);

          audio.onended = () => {
            if (callback) callback();
          };

          audio.play();
        }
      })
      .catch(error => {
        console.error('Error synthesizing speech:', error);
      });
  }

  private createAudio(audioStream: ArrayBuffer): HTMLAudioElement {
    const audioBlob = new Blob([audioStream], { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(audioBlob);
    return new Audio(audioUrl);
  }
}
