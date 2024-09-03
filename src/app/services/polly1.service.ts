import { Injectable } from '@angular/core';

// Declare AWS globally
declare const AWS: any;

@Injectable({
  providedIn: 'root'
})
export class Polly1Service {
  private polly: any;

  constructor() {
    AWS.config.update({
      region: 'ap-southeast-2', // your region
      // region: 'us-east-1', // your region
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'hp-southeast-2:8b995ac9-3184-438b-9d29-0445e6c6d672'
      })
    });

    this.polly = new AWS.Polly();
  }

  playSpeechWithCallback(text: string, voiceId: string = 'Joanna', languageCode: string = 'en-US', callback: () => void) {
    const params = {
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: voiceId,
      LanguageCode: languageCode
    };

    this.polly.synthesizeSpeech(params).promise()
      .then((data:any) => {
        if (data.AudioStream) {
          const audio = this.createAudio(data.AudioStream as ArrayBuffer);

          audio.onended = () => {
            if (callback) callback();
          };

          audio.play();
        }
      })
      .catch((error:any) => {
        console.error('Error synthesizing speech:', error);
      });
  }

  private createAudio(audioStream: ArrayBuffer): HTMLAudioElement {
    const audioBlob = new Blob([audioStream], { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(audioBlob);
    return new Audio(audioUrl);
  }
}
