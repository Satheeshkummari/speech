import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

@Component({
  selector: 'app-speech',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit, OnDestroy {

  recognition: any;
  isListening = false;
  isSpeaking = false;
  transcript = '';
  currentQuestionIndex = 0;
  isQuestionnaireStarted = false;
  questions = [
    { text: 'What is your favorite color?', options: ['Red', 'Blue', 'Green', 'Yellow'] },
    { text: 'What is your favorite animal?', options: ['Dog', 'Cat', 'Bird', 'Fish'] },
    { text: 'What is your favorite food?', options: ['Pizza', 'Burger', 'Sushi', 'Pasta'] },
    { text: 'What is your favorite sport?', options: ['Football', 'Basketball', 'Tennis', 'Swimming'] }
  ];
  selectedOptions: { [questionIndex: number]: string[] } = {};

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
      console.log('Transcript updated:', this.transcript);
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
      console.log("d:: onend")
      if (this.isListening) {
        this.isListening = false;
        console.log("d:: onend this.isListening", this.isListening)
        console.log("d:: this.isListening made false", this.isListening)
        console.log('Recognition ended');
        this.handleUserResponse();
      }
    };
  }

  ngOnInit() {
    // Initialization code if needed
  }

  ngOnDestroy() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  startQuestionnaire() {
    this.isQuestionnaireStarted = true;
    this.announceConfirmation();
  }

  announceConfirmation() {
    const speech = new SpeechSynthesisUtterance('Would you like to answer the questions?');
    speech.onend = () => {
      this.showListeningIndicator();
      this.startRecordingFor(5);  // Listen for 5 seconds for response
    };
    window.speechSynthesis.speak(speech);
  }

  startRecordingFor(seconds: number) {
    console.log("d:: startRecordingFor this.isListening", this.isListening)
    if (!this.isListening) {
      this.startRecording();
      setTimeout(() => {
        if (!this.transcript) {
          const retrySpeech = new SpeechSynthesisUtterance('I did not hear a response. Please try again.');
          window.speechSynthesis.speak(retrySpeech);
          this.startRecordingFor(seconds); // Retry listening
        } else {
          this.handleUserResponse();
        }
      }, seconds * 1000);
    }
  }

  startRecording() {
    if (!this.isListening) {
      console.log("d:: startRecording this.isListening", this.isListening)
      console.log("d:: this.isListening made true")   
      this.isListening = true;
      this.recognition.start();
    }
  }

  stopRecording() {
    if (this.isListening) {
      console.log("d:: startRecording this.isListening", this.isListening)
      console.log("d:: this.isListening made false")

      this.isListening = false;
      this.recognition.stop();
    }
  }

  showListeningIndicator() {
    // Add logic here to display your listening indicator (e.g., ripple effect)
    console.log('Listening indicator shown');
  }

  announceNextQuestion() {
    if (this.currentQuestionIndex < this.questions.length) {
      const question = this.questions[this.currentQuestionIndex];
      const questionText = `${question.text} Options are: ${question.options.join(', ')}`;
      const speech = new SpeechSynthesisUtterance(questionText);
      speech.onend = () => {
        this.showListeningIndicator();
        this.startRecordingFor(5); // Listen for 5 seconds after announcing the question
      };
      window.speechSynthesis.speak(speech);
    } else {
      console.log('All questions answered');
      this.stopRecording();
    }
  }

  handleUserResponse() {
    const userResponse = this.transcript.toLowerCase();
    const currentQuestion = this.questions[this.currentQuestionIndex];

    if (currentQuestion) {
      const matchedOptions = this.matchResponse(userResponse, currentQuestion.options);
      if (matchedOptions.length) {
        console.log(`Match found: ${matchedOptions.join(', ')}`);
        this.selectedOptions[this.currentQuestionIndex] = matchedOptions;
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
          this.announceNextQuestion();
        } else {
          console.log('All questions answered');
          this.stopRecording();
        }
      } else {
        console.log('No match found');
        this.stopRecording();
      }
    }
  }

  matchResponse(userResponse: string, options: string[]): string[] {
    return options.filter(option => userResponse.includes(option.toLowerCase()));
  }

  onOptionChange(event: Event, option: string) {
    const currentQuestionIndex = this.currentQuestionIndex;
    if (!this.selectedOptions[currentQuestionIndex]) {
      this.selectedOptions[currentQuestionIndex] = [];
    }

    const isSelected = (event.target as HTMLInputElement).checked;
    if (isSelected) {
      this.selectedOptions[currentQuestionIndex].push(option);
    } else {
      const index = this.selectedOptions[currentQuestionIndex].indexOf(option);
      if (index > -1) {
        this.selectedOptions[currentQuestionIndex].splice(index, 1);
      }
    }

    console.log('Selected options:', this.selectedOptions);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const width = (event.target as Window).innerWidth;
    console.log(width);
  }
}

interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
