export interface VoiceData {
    Language: string;
    LanguageCode: string;
    VoiceId?: string;          // Optional, for single VoiceId case
    VoiceIds?: string[];       // Optional, for multiple VoiceIds case
    Gender?: string;           // Optional, for single Gender case
    Genders?: string[];        // Optional, for multiple Genders case
    GenerativeVoice: any;
    LongFormVoice: any;
    NeuralVoice: string[] | string;
    StandardVoice: string[] | string;
}