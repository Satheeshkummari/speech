import { Injectable } from '@angular/core';
import { VoiceData } from '../models/voice-id';

// Declare AWS globally
declare const AWS: any;

@Injectable({
  providedIn: 'root'
})
export class AwsVoiceIDService {

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

  voicesJson: VoiceData[] = [
    {
      "Language": "Arabic",
      "LanguageCode": "arb",
      "VoiceId": "Zeina",
      "Gender": "Female",
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": "No",
      "StandardVoice": "Yes"
    },
    {
      "Language": "Arabic (Gulf)",
      "LanguageCode": "ar-AE",
      "VoiceIds": ["Hala", "Zayd"],
      "Genders": ["Female", "Male"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": "No",
      "StandardVoice": ["Yes", "Yes"]
    },
    {
      "Language": "Dutch (Belgian)",
      "LanguageCode": "nl-BE",
      "VoiceId": "Lisa",
      "Gender": "Female",
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": "Yes",
      "StandardVoice": "No"
    },
    {
      "Language": "Catalan",
      "LanguageCode": "ca-ES",
      "VoiceId": "Arlet",
      "Gender": "Female",
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": "Yes",
      "StandardVoice": "No"
    },
    {
      "Language": "Czech",
      "LanguageCode": "cs-CZ",
      "VoiceId": "Jitka",
      "Gender": "Female",
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": "Yes",
      "StandardVoice": "No"
    },
    {
      "Language": "Chinese (Cantonese)",
      "LanguageCode": "yue-CN",
      "VoiceId": "Hiujin",
      "Gender": "Female",
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": "Yes",
      "StandardVoice": "No"
    },
    {
      "Language": "Chinese (Mandarin)",
      "LanguageCode": "cmn-CN",
      "VoiceId": "Zhiyu",
      "Gender": "Female",
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes"],
      "StandardVoice": ["Yes", "Yes"]
    },
    {
      "Language": "Danish",
      "LanguageCode": "da-DK",
      "VoiceIds": ["Naja", "Mads", "Sofie"],
      "Genders": ["Female", "Male", "Female"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes", "Yes"],
      "StandardVoice": "No"
    },
    {
      "Language": "Dutch",
      "LanguageCode": "nl-NL",
      "VoiceIds": ["Laura", "Lotte", "Ruben"],
      "Genders": ["Female", "Female", "Male"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes", "Yes"],
      "StandardVoice": ["No", "No", "No"]
    },
    {
      "Language": "English (Australian)",
      "LanguageCode": "en-AU",
      "VoiceIds": ["Nicole", "Olivia", "Russell"],
      "Genders": ["Female", "Female", "Male"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes", "Yes"],
      "StandardVoice": "No"
    },
    {
      "Language": "English (British)",
      "LanguageCode": "en-GB",
      "VoiceIds": ["Amy", "Emma", "Brian", "Arthur"],
      "Genders": ["Female", "Female", "Male", "Male"],
      "GenerativeVoice": ["Yes", "No", "No", "No"],
      "LongFormVoice": ["No", "No", "No", "No"],
      "NeuralVoice": ["Yes", "Yes", "Yes", "Yes"],
      "StandardVoice": ["Yes", "Yes", "Yes", "No"]
    },
    {
      "Language": "English (Indian)",
      "LanguageCode": "en-IN",
      "VoiceIds": ["Aditi", "Raveena", "Kajal"],
      "Genders": ["Female", "Female", "Female"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes", "Yes"],
      "StandardVoice": "No"
    },
    {
      "Language": "English (Ireland)",
      "LanguageCode": "en-IE",
      "VoiceId": "Niamh",
      "Gender": "Female",
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": "Yes",
      "StandardVoice": "No"
    },
    {
      "Language": "English (New Zealand)",
      "LanguageCode": "en-NZ",
      "VoiceId": "Aria",
      "Gender": "Female",
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": "Yes",
      "StandardVoice": "No"
    },
    {
      "Language": "English (South African)",
      "LanguageCode": "en-ZA",
      "VoiceId": "Ayanda",
      "Gender": "Female",
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": "Yes",
      "StandardVoice": "No"
    },
    {
      "Language": "English (US)",
      "LanguageCode": "en-US",
      "VoiceIds": [
        "Danielle", "Gregory", "Ivy", "Joanna", "Kendra", "Kimberly", "Salli",
        "Joey", "Justin", "Kevin", "Matthew", "Ruth", "Stephen"
      ],
      "Genders": [
        "Female", "Male", "Female (child)", "Female", "Female", "Female", "Female",
        "Male", "Male (child)", "Male (child)", "Male", "Female", "Male"
      ],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": [
        "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes",
        "Yes", "Yes", "Yes", "Yes", "Yes", "Yes"
      ],
      "StandardVoice": [
        "No", "No", "No", "No", "No", "No", "No",
        "No", "No", "No", "Yes", "No", "No"
      ]
    },
    {
      "Language": "English (Welsh)",
      "LanguageCode": "en-GB-WLS",
      "VoiceId": "Geraint",
      "Gender": "Male",
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": "No",
      "StandardVoice": "Yes"
    },
    {
      "Language": "Finnish",
      "LanguageCode": "fi-FI",
      "VoiceId": "Suvi",
      "Gender": "Female",
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": "Yes",
      "StandardVoice": "No"
    },
    {
      "Language": "French",
      "LanguageCode": "fr-FR",
      "VoiceIds": ["Céline", "Léa", "Mathieu", "Rémi"],
      "Genders": ["Female", "Female", "Male", "Male"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes", "Yes", "Yes"],
      "StandardVoice": ["No", "No", "No", "No"]
    },
    {
      "Language": "French (Belgian)",
      "LanguageCode": "fr-BE",
      "VoiceId": "Isabelle",
      "Gender": "Female",
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": "Yes",
      "StandardVoice": "No"
    },
    {
      "Language": "French (Canadian)",
      "LanguageCode": "fr-CA",
      "VoiceIds": ["Chantal", "Gabrielle", "Liam"],
      "Genders": ["Female", "Female", "Male"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes", "Yes"],
      "StandardVoice": ["No", "No", "No"]
    },
    {
      "Language": "German",
      "LanguageCode": "de-DE",
      "VoiceIds": ["Marlene", "Vicki", "Hans", "Daniel"],
      "Genders": ["Female", "Female", "Male", "Male"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes", "Yes", "Yes"],
      "StandardVoice": ["No", "No", "No", "No"]
    },
    {
      "Language": "German (Austrian)",
      "LanguageCode": "de-AT",
      "VoiceId": "Hannah",
      "Gender": "Female",
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": "Yes",
      "StandardVoice": "No"
    },
    {
      "Language": "German (Swiss)",
      "LanguageCode": "de-CH",
      "VoiceId": "Sabrina",
      "Gender": "Female",
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": "Yes",
      "StandardVoice": "No"
    },
    {
      "Language": "Hindi",
      "LanguageCode": "hi-IN",
      "VoiceIds": ["Aditi", "Kajal"],
      "Genders": ["Female", "Female"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes"],
      "StandardVoice": "No"
    },
    {
      "Language": "Icelandic",
      "LanguageCode": "is-IS",
      "VoiceIds": ["Dóra", "Karl"],
      "Genders": ["Female", "Male"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes"],
      "StandardVoice": "No"
    },
    {
      "Language": "Italian",
      "LanguageCode": "it-IT",
      "VoiceIds": ["Carla", "Bianca", "Giorgio", "Adriano"],
      "Genders": ["Female", "Female", "Male", "Male"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes", "Yes", "Yes"],
      "StandardVoice": ["No", "No", "No", "No"]
    },
    {
      "Language": "Japanese",
      "LanguageCode": "ja-JP",
      "VoiceIds": ["Mizuki", "Takumi", "Kazuha", "Tomoko"],
      "Genders": ["Female", "Male", "Female", "Female"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes", "Yes", "Yes"],
      "StandardVoice": ["No", "No", "No", "No"]
    },
    {
      "Language": "Korean",
      "LanguageCode": "ko-KR",
      "VoiceId": "Seoyeon",
      "Gender": "Female",
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes"],
      "StandardVoice": "No"
    },
    {
      "Language": "Norwegian",
      "LanguageCode": "nb-NO",
      "VoiceIds": ["Liv", "Ida"],
      "Genders": ["Female", "Female"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes"],
      "StandardVoice": "No"
    },
    {
      "Language": "Polish",
      "LanguageCode": "pl-PL",
      "VoiceIds": ["Ewa", "Maja", "Jacek", "Jan", "Ola"],
      "Genders": ["Female", "Female", "Male", "Male", "Female"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes", "Yes", "Yes", "No"],
      "StandardVoice": ["No", "No", "No", "No", "No"]
    },
    {
      "Language": "Portuguese (Brazilian)",
      "LanguageCode": "pt-BR",
      "VoiceIds": ["Camila", "Vitória", "Ricardo", "Thiago"],
      "Genders": ["Female", "Female", "Male", "Male"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes", "Yes", "Yes"],
      "StandardVoice": ["No", "No", "No", "No"]
    },
    {
      "Language": "Portuguese (European)",
      "LanguageCode": "pt-PT",
      "VoiceIds": ["Inês", "Cristiano"],
      "Genders": ["Female", "Male"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes"],
      "StandardVoice": ["Yes", "Yes"]
    },
    {
      "Language": "Romanian",
      "LanguageCode": "ro-RO",
      "VoiceId": "Carmen",
      "Gender": "Female",
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": "Yes",
      "StandardVoice": "No"
    },
    {
      "Language": "Russian",
      "LanguageCode": "ru-RU",
      "VoiceIds": ["Tatyana", "Maxim"],
      "Genders": ["Female", "Male"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes"],
      "StandardVoice": ["No", "No"]
    },
    {
      "Language": "Spanish (European)",
      "LanguageCode": "es-ES",
      "VoiceIds": ["Conchita", "Lucia", "Enrique", "Sergio"],
      "Genders": ["Female", "Female", "Male", "Male"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes", "Yes", "Yes"],
      "StandardVoice": ["No", "No", "No", "No"]
    },
    {
      "Language": "Spanish (Mexican)",
      "LanguageCode": "es-MX",
      "VoiceIds": ["Mia", "Andrés"],
      "Genders": ["Female", "Male"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes"],
      "StandardVoice": ["No", "No"]
    },
    {
      "Language": "Spanish (US)",
      "LanguageCode": "es-US",
      "VoiceIds": ["Lupe", "Penélope", "Miguel", "Pedro"],
      "Genders": ["Female", "Female", "Male", "Male"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes", "Yes", "Yes"],
      "StandardVoice": ["No", "No", "No", "No"]
    },
    {
      "Language": "Swedish",
      "LanguageCode": "sv-SE",
      "VoiceIds": ["Astrid", "Elin"],
      "Genders": ["Female", "Female"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes"],
      "StandardVoice": "No"
    },
    {
      "Language": "Turkish",
      "LanguageCode": "tr-TR",
      "VoiceIds": ["Filiz", "Burcu"],
      "Genders": ["Female", "Female"],
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": ["Yes", "Yes"],
      "StandardVoice": "No"
    },
    {
      "Language": "Welsh",
      "LanguageCode": "cy-GB",
      "VoiceId": "Gwyneth",
      "Gender": "Female",
      "GenerativeVoice": "No",
      "LongFormVoice": "No",
      "NeuralVoice": "No",
      "StandardVoice": "Yes"
    }
    //test
    // {
    //     "Language": "Arabic",
    //     "LanguageCode": "arb",
    //     "VoiceIds": "Zeina",
    //     "Genders": "Female",
    //     "GenerativeVoice": "No",
    //     "LongFormVoice": "No",
    //     "NeuralVoice": "No",
    //     "StandardVoice": "Yes"
    // },
    // {
    //     "Language": "Dutch (Belgian)",
    //     "LanguageCode": "nl-BE",
    //     "VoiceIds": ["Lisa"],
    //     "Genders": ["Female"],
    //     "GenerativeVoice": "No",
    //     "LongFormVoice": "No",
    //     "NeuralVoice": "Yes",
    //     "StandardVoice": "No"
    // },
    // {
    //     "Language": "English (Australian)",
    //     "LanguageCode": "en-AU",
    //     "VoiceIds": ["Nicole", "Olivia"],
    //     "Genders": ["Female", "Female"],
    //     "GenerativeVoice": "No",
    //     "LongFormVoice": "No",
    //     "NeuralVoice": ["Yes", "Yes"],
    //     "StandardVoice": "No"
    // },
  ];

}
