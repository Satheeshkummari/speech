import { Injectable } from '@angular/core';
import { VoiceData } from '../models/voice-id';
import { Polly1Service } from './polly1.service';

// Declare AWS globally
declare const AWS: any;

@Injectable({
  providedIn: 'root'
})
export class AwsVoiceIDService {
  constructor(private pollyService: Polly1Service){}

  public getAvailableVoice(languageCode: string): string {
    // Find the entry for the given language code
    const entry = this.voicesJson.find(voice => voice.LanguageCode === languageCode);

    if (!entry) {
      return ""; // No entry found for the given language code
    }

    // Determine the available VoiceId based on the data
    if (entry.VoiceIds) {
      // Multiple voice IDs available
      const preferredGender = 'Female'; // Prefer Female voices first
      const voiceIds = entry.VoiceIds;
      const genders = entry.Genders || [];
      
      // Find the first available female voice ID, then male
      for (let i = 0; i < voiceIds.length; i++) {
        if (genders[i] === preferredGender) {
          return voiceIds[i];
        }
      }

      // If no female voice found, return the first male voice ID
      for (let i = 0; i < voiceIds.length; i++) {
        if (genders[i] !== preferredGender) {
          return voiceIds[i];
        }
      }
    } else if (entry.VoiceId) {
      // Single voice ID available
      return entry.VoiceId;
    }

    return ""; // No voice ID available
  }

  voicesJson: any[] = [
    {
      "language": "Arabic",
      "language_code": "arb",
      "voices": [
        {
          "name": "Zeina",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": false,
          "standard_voice": true
        }
      ]
    },
    {
      "language": "Arabic (Gulf)",
      "language_code": "ar-AE",
      "voices": [
        {
          "name": "Hala",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": false
        },
        {
          "name": "Zayd",
          "gender": "Male",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": false
        }
      ]
    },
    {
      "language": "Dutch (Belgian)",
      "language_code": "nl-BE",
      "voices": [
        {
          "name": "Lisa",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": false
        }
      ]
    },
    {
      "language": "Catalan",
      "language_code": "ca-ES",
      "voices": [
        {
          "name": "Arlet",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": false
        }
      ]
    },
    {
      "language": "Czech",
      "language_code": "cs-CZ",
      "voices": [
        {
          "name": "Jitka",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": false
        }
      ]
    },
    {
      "language": "Chinese (Cantonese)",
      "language_code": "yue-CN",
      "voices": [
        {
          "name": "Hiujin",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": false
        }
      ]
    },
    {
      "language": "Chinese (Mandarin)",
      "language_code": "cmn-CN",
      "voices": [
        {
          "name": "Zhiyu",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": true
        }
      ]
    },
    {
      "language": "Danish",
      "language_code": "da-DK",
      "voices": [
        {
          "name": "Naja",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": false
        },
        {
          "name": "Mads",
          "gender": "Male",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": false
        },
        {
          "name": "Sofie",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": false
        }
      ]
    },
    {
      "language": "Dutch",
      "language_code": "nl-NL",
      "voices": [
        {
          "name": "Laura",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": false
        },
        {
          "name": "Lotte",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": true
        },
        {
          "name": "Ruben",
          "gender": "Male",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": true
        }
      ]
    },
    {
      "language": "English (Australian)",
      "language_code": "en-AU",
      "voices": [
        {
          "name": "Nicole",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": false,
          "standard_voice": true
        },
        {
          "name": "Olivia",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": false
        },
        {
          "name": "Russell",
          "gender": "Male",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": true
        }
      ]
    },
    {
      "language": "English (British)",
      "language_code": "en-GB",
      "voices": [
        {
          "name": "Amy",
          "gender": "Female",
          "generative_voice": true,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": true
        },
        {
          "name": "Emma",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": true
        },
        {
          "name": "Brian",
          "gender": "Male",
          "generative_voice": true,
          "long_form_voice": true,
          "neural_voice": true,
          "standard_voice": true
        },
        {
          "name": "Arthur",
          "gender": "Male",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": true
        }
      ]
    },
    {
      "language": "English (Indian)",
      "language_code": "en-IN",
      "voices": [
        {
          "name": "Aditi",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": true
        },
        {
          "name": "Raveena",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": true
        },
        {
          "name": "Kajal",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": true
        }
      ]
    },
    {
      "language": "English (Ireland)",
      "language_code": "en-IE",
      "voices": [
        {
          "name": "Niamh",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": false
        }
      ]
    },
    {
      "language": "English (New Zealand)",
      "language_code": "en-NZ",
      "voices": [
        {
          "name": "Aria",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": false
        }
      ]
    },
    {
      "language": "English (South African)",
      "language_code": "en-ZA",
      "voices": [
        {
          "name": "Ayanda",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": false
        }
      ]
    },
    {
      "language": "English (US)",
      "language_code": "en-US",
      "voices": [
        {
          "name": "Danielle",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": false
        },
        {
          "name": "Gregory",
          "gender": "Male",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": false
        },
        {
          "name": "Ivy",
          "gender": "Female (child)",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": false
        },
        {
          "name": "Joanna",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": true,
          "neural_voice": true,
          "standard_voice": true
        },
        {
          "name": "Kendra",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": true,
          "neural_voice": true,
          "standard_voice": true
        },
        {
          "name": "Kimberly",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": true
        },
        {
          "name": "Matthew",
          "gender": "Male",
          "generative_voice": false,
          "long_form_voice": true,
          "neural_voice": true,
          "standard_voice": true
        },
        {
          "name": "Salli",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": true,
          "neural_voice": true,
          "standard_voice": true
        }
      ]
    },
    {
      "language": "French (Canadian)",
      "language_code": "fr-CA",
      "voices": [
        {
          "name": "Chantal",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": true
        },
        {
          "name": "Gabrielle",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": false,
          "neural_voice": true,
          "standard_voice": false
        }
      ]
    },
    {
      "language": "French",
      "language_code": "fr-FR",
      "voices": [
        {
          "name": "Celine",
          "gender": "Female",
          "generative_voice": false,
          "long_form_voice": true,
          "neural_voice": true,
          "standard_voice": true
        },
        {
          "name": "Lea",
          "gender": "Female",
          "generative_voice": true,
          "long_form_voice": true,
          "neural_voice": true,
          "standard_voice": true
        },
        {
          "name": "Mathieu",
          "gender": "Male",
          "generative_voice": true,
          "long_form_voice": true,
          "neural_voice": true,
          "standard_voice": true
        }
      ]
    }
  ]

}
