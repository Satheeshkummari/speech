import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-speech',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit, OnDestroy {

  recognition: any;
  isListening = false;
  transcript = '';
  currentQuestionIndex = -1;
  isQuestionnaireStarted = false;
  questions = [
    { text: 'What is your favorite color?', options: ['Red', 'Blue', 'Green', 'Yellow'] },
    { text: 'What is your favorite animal?', options: ['Dog', 'Cat', 'Bird', 'Fish'] },
    { text: 'What is your favorite food?', options: ['Pizza', 'Burger', 'Sushi', 'Pasta'] },
    { text: 'What is your favorite sport?', options: ['Football', 'Basketball', 'Tennis', 'Swimming'] }
  ];
  selectedOptions: { [questionIndex: number]: string[] } = {};

  private timeoutId: any;
  private noSpeechTimeout: any;

  constructor(private cdr: ChangeDetectorRef) {
    const { webkitSpeechRecognition }: IWindow = window as any;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onresult = (event: any) => {
      clearTimeout(this.noSpeechTimeout); // Clear the no speech timeout

      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }

      this.transcript = finalTranscript.toLowerCase().trim();
      console.log('Transcript updated:', this.transcript);

      if (event.results[event.results.length - 1].isFinal) {
        this.handleUserResponse();
      }

      this.cdr.detectChanges(); // Force change detection
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        this.stopRecording();
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
    if (!this.isListening) {
      this.startRecording();
      this.timeoutId = setTimeout(() => {
        if (!this.transcript) {
          const retrySpeech = new SpeechSynthesisUtterance('I did not hear a response. Please try again.');
          retrySpeech.onend = () => {
            if (this.currentQuestionIndex === -1) {
              this.announceConfirmation(); // Re-announce the confirmation if no valid response
            } else {
              this.announceCurrentQuestion(); // Re-announce the current question
            }
          };
          window.speechSynthesis.speak(retrySpeech);
          this.startRecordingFor(seconds); // Retry listening
        } else {
          this.handleUserResponse();
        }
      }, seconds * 1000);

      this.noSpeechTimeout = setTimeout(() => {
        if (this.isListening) {
          console.log('No speech detected. Stopping recognition.');
          this.stopRecording();
        }
      }, seconds * 1000);
    }
  }

  startRecording() {
    if (!this.isListening) {
      this.isListening = true;
      this.recognition.start();
      this.cdr.detectChanges(); // Force change detection
    }
  }

  stopRecording() {
    if (this.isListening) {
      this.isListening = false;
      this.recognition.stop();
      clearTimeout(this.timeoutId); // Clear the timeout
      clearTimeout(this.noSpeechTimeout); // Clear the no speech timeout
      this.cdr.detectChanges(); // Force change detection
    }
  }

  showListeningIndicator() {
    console.log('Listening indicator shown');
    this.cdr.detectChanges(); // Force change detection
  }

  announceCurrentQuestion() {
    if (this.currentQuestionIndex >= 0 && this.currentQuestionIndex < this.questions.length) {
      const question = this.questions[this.currentQuestionIndex];
      const questionText = `${question.text} Options are: ${question.options.join(', ')}`;
      const speech = new SpeechSynthesisUtterance(questionText);
      speech.onend = () => {
        this.showListeningIndicator();
        this.startRecordingFor(5); // Listen for 5 seconds after announcing the question
      };
      window.speechSynthesis.speak(speech);
    }
  }

  announceNextQuestion() {
    if (this.currentQuestionIndex < this.questions.length) {
      this.announceCurrentQuestion();
    } else {
      console.log('All questions answered');
      this.stopRecording();
    }
  }

  handleUserResponse() {
    const userResponse = this.transcript.toLowerCase();
    if (this.currentQuestionIndex === -1) {
      if (userResponse.includes('yes')) {
        this.transcript = ''; // Clear the transcript
        this.currentQuestionIndex = 0;
        this.announceNextQuestion();
      } else if (userResponse.includes('no')) {
        console.log('User chose not to answer the questions.');
        this.stopRecording();
      } else {
        this.announceConfirmation(); // Re-announce the confirmation if the response is unclear
      }
    } else {
      const currentQuestion = this.questions[this.currentQuestionIndex];
      const matchedOptions = this.matchResponse(userResponse, currentQuestion.options);
      if (matchedOptions.length) {
        console.log(`Match found: ${matchedOptions.join(', ')}`);
        this.selectedOptions[this.currentQuestionIndex] = matchedOptions;
        this.transcript = ''; // Clear the transcript
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
          this.announceNextQuestion();
        } else {
          console.log('All questions answered');
          this.stopRecording();
        }
      } else {
        console.log('No match found');
        const retrySpeech = new SpeechSynthesisUtterance('No match found. Please try again.');
        retrySpeech.onend = () => {
          this.transcript = ''; // Clear the transcript
          this.announceCurrentQuestion(); // Re-announce the current question
        };
        window.speechSynthesis.speak(retrySpeech);
        this.startRecordingFor(5); // Retry listening for 5 seconds
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
}

interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
