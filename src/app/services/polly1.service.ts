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

  async getBestVoiceForLanguage(langCode: string, preferredGender: 'Female' | 'Male') {
    const params = {
      LanguageCode: langCode
    };
  
    try {
      const response = await this.polly.describeVoices(params).promise();
      const voices = response.Voices;
  
      // Sort based on priority: Neural engine first, then gender preference
      const bestVoice = voices.sort((a:any, b:any) => {
        // Prefer Neural engine over Standard
        const aIsNeural = a.SupportedEngines.includes('neural') ? 1 : 0;
        const bIsNeural = b.SupportedEngines.includes('neural') ? 1 : 0;
  
        if (aIsNeural !== bIsNeural) {
          return bIsNeural - aIsNeural; // Neural first
        }
  
        // Choose based on gender preference
        if (a.Gender === preferredGender && b.Gender !== preferredGender) return -1;
        if (b.Gender === preferredGender && a.Gender !== preferredGender) return 1;
  
        // If engines and genders are equal, return first available
        return 0;
      })[0]; // Get the first (best) sorted voice
  
      console.log(`Best VoiceId: ${bestVoice?.Id}, Engine: ${bestVoice?.SupportedEngines.join(', ')}, Gender: ${bestVoice?.Gender}`);
      return bestVoice;
    } catch (error) {
      console.error("Error fetching voices:", error);
    }
  }
  
  // // Example usage:
  // getBestVoiceForLanguage('en-US', 'Female').then(bestVoice => {
  //   if (bestVoice) {
  //     this.pollyService.playSpeechWithCallback(bestVoice.Id, bestVoice.SupportedEngines[0]);  // Use the best voiceId and engine
  //   }
  // });

  
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
