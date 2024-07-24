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
  isAnnouncement = false;
  questions = [
    { text: 'What is your favorite color?', options: ['Red', 'Blue', 'Green', 'Yellow'] },
    { text: 'What is your favorite animal?', options: ['Dog', 'Cat', 'Bird', 'Fish'] },
    { text: 'What is your favorite food?', options: ['Pizza', 'Burger', 'Sushi', 'Pasta'] },
    { text: 'What is your favorite sport?', options: ['Football', 'Basketball', 'Tennis', 'Swimming'] }
  ];
  selectedOptions: { [questionIndex: number]: string[] } = {};

  private silenceTimeoutId: any;
  private responseTimeoutId: any;

  constructor(private cdr: ChangeDetectorRef) {
    const { webkitSpeechRecognition }: IWindow = window as any;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onresult = (event: any) => {
      console.log('Speech recognition result event:', event);
      this.handleResult(event);
    };

    this.recognition.onend = () => {
      console.log('Speech recognition ended.');
      if (this.isListening) {
        this.stopRecording(); // Ensure recording stops
      }
    };
  }

  ngOnInit() {
    console.log('Component initialized.');
  }

  ngOnDestroy() {
    if (this.recognition) {
      console.log('Stopping recognition on destroy.');
      this.recognition.stop();
    }
  }

  startQuestionnaire() {
    console.log('Starting questionnaire.');
    this.isQuestionnaireStarted = true;
    this.currentQuestionIndex = 0; // Start with the first question
    this.announceCurrentQuestion(); // Ensure the first question is announced
  }

  announceConfirmation() {
    if (this.isAnnouncement) {
      console.log('Confirmation announcement already in progress.');
      return;
    }

    this.isAnnouncement = true;
    console.log('Announcing confirmation: "Would you like to answer the questions?"');
    const speech = new SpeechSynthesisUtterance('Would you like to answer the questions?');
    speech.onend = () => {
      console.log('Confirmation announcement ended.');
      this.isAnnouncement = false;
      this.showListeningIndicator();
      this.startRecordingFor(5); // Listen for 5 seconds for response
    };
    window.speechSynthesis.speak(speech);
  }

  startRecordingFor(seconds: number) {
    if (!this.isListening) {
      console.log('Starting recording for', seconds, 'seconds.');
      this.startRecording();
      this.responseTimeoutId = setTimeout(() => {
        console.log('Response timeout reached.');
        if (!this.transcript.trim()) {
          console.log('No transcript detected. Retrying.');
          this.retryAnnouncement();
        }
      }, seconds * 1000);

      this.silenceTimeoutId = setTimeout(() => {
        if (this.isListening) {
          console.log('Silence timeout reached. No speech detected.');
          this.stopRecording();
        }
      }, seconds * 1000);
    }
  }

  startRecording() {
    if (!this.isListening) {
      this.isListening = true;
      console.log('Starting recording.');
      this.recognition.start();
      this.cdr.detectChanges();
    }
  }

  stopRecording() {
    if (this.isListening) {
      this.isListening = false;
      console.log('Stopping recording.');
      this.recognition.stop();
      clearTimeout(this.responseTimeoutId);
      clearTimeout(this.silenceTimeoutId);
      this.cdr.detectChanges();
    }
  }

  showListeningIndicator() {
    if (!this.isAnnouncement) {
      console.log('Listening indicator shown.');
      this.cdr.detectChanges();
    }
  }

  announceCurrentQuestion() {
    if (this.isAnnouncement) {
      console.log('Question announcement already in progress.');
      return;
    }

    if (this.currentQuestionIndex >= 0 && this.currentQuestionIndex < this.questions.length) {
      this.isAnnouncement = true;
      const question = this.questions[this.currentQuestionIndex];
      const questionText = `${question.text} Options are: ${question.options.join(', ')}`;
      console.log('Announcing question:', questionText);
      const speech = new SpeechSynthesisUtterance(questionText);
      speech.onend = () => {
        console.log('Question announcement ended.');
        this.isAnnouncement = false;
        this.showListeningIndicator();
        this.startRecordingFor(5); // Listen for 5 seconds after announcing the question
      };
      window.speechSynthesis.speak(speech);
    } else {
      console.log('No more questions.');
      this.stopRecording();
    }
  }

  announceNextQuestion() {
    console.log(`Moving to next question. Current index: ${this.currentQuestionIndex}`);
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.announceCurrentQuestion();
    } else {
      console.log('All questions answered. Ending questionnaire.');
      this.stopRecording();
    }
  }

  handleResult(event: any) {
    console.log('Processing results...');
    clearTimeout(this.silenceTimeoutId);

    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      }
    }

    this.transcript = finalTranscript.toLowerCase().trim();
    console.log('Transcript updated:', this.transcript);

    if (this.transcript) {
      console.log('User response detected:', this.transcript);
      this.stopRecording(); // Stop recording to process the response
      this.handleUserResponse();
    } else {
      console.log('Transcript is empty. Continuing to listen.');
    }
  }

  handleUserResponse() {
    const userResponse = this.transcript.toLowerCase();
    console.log('Handling user response:', userResponse);
    
    if (this.currentQuestionIndex === -1) {
      if (userResponse.includes('yes')) {
        console.log('User responded "yes". Moving to next question.');
        this.transcript = '';
        this.currentQuestionIndex = 0; // Start with the first question
        this.announceCurrentQuestion(); // Ensure the first question is announced
      } else if (userResponse.includes('no')) {
        console.log('User chose not to answer the questions.');
        this.stopRecording();
      } else {
        console.log('Confirmation unclear. Re-announcing.');
        this.retryAnnouncement();
      }
    } else {
      const currentQuestion = this.questions[this.currentQuestionIndex];
      const matchedOptions = this.matchResponse(userResponse, currentQuestion.options);
      if (matchedOptions.length) {
        console.log('Match found:', matchedOptions.join(', '));
        this.selectedOptions[this.currentQuestionIndex] = matchedOptions;
        this.transcript = '';
        this.announceNextQuestion(); // Move to the next question after processing response
      } else {
        console.log('No match found.');
        this.retryAnnouncement();
      }
    }
  }

  matchResponse(userResponse: string, options: string[]): string[] {
    return options.filter(option => userResponse.includes(option.toLowerCase()));
  }

  retryAnnouncement() {
    console.log('Retrying announcement.');
    if (this.currentQuestionIndex === -1) {
      this.announceConfirmation();
    } else {
      this.announceCurrentQuestion();
    }
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
