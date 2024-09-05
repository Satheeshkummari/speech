import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
// import { PollyService } from '../services/polly.service';
import { Polly1Service } from '../services/polly1.service';
import { AwsVoiceIDService } from '../services/awsvoiceID.service';


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
  // questions = [
  //   { text: 'What is your favorite color?', options: ['Red', 'Blue', 'Green', 'Yellow'] },
  //   { text: 'What is your favorite animal?', options: ['Dog', 'Cat', 'Bird', 'Fish'] },
  //   { text: 'What is your favorite food?', options: ['Pizza', 'Burger', 'Sushi', 'Pasta'] },
  //   { text: 'What is your favorite sport?', options: ['Football', 'Basketball', 'Tennis', 'Swimming'] }
  // ];
  questions = [
    { text: '¿Cuál es tu color favorito?', options: ['Rojo', 'Azul', 'Verde', 'Amarillo'] },
    { text: '¿Cuál es tu animal favorito?', options: ['Perro', 'Gato', 'Pájaro', 'Pez'] },
    { text: '¿Cuál es tu comida favorita?', options: ['Pizza', 'Hamburguesa', 'Sushi', 'Pasta'] },
    { text: '¿Cuál es tu deporte favorito?', options: ['Fútbol', 'Baloncesto', 'Tenis', 'Natación'] }
  ];

  selectedOptions: { [questionIndex: number]: string[] } = {};

  private silenceTimeoutId: any;
  private responseTimeoutId: any;

  constructor(private cdr: ChangeDetectorRef, private pollyService: Polly1Service, private awsVoiceService: AwsVoiceIDService) {
    const { webkitSpeechRecognition }: IWindow = window as any;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onresult = (event: any) => {
      this.handleResult(event);
    };

    this.recognition.onend = () => {
      console.log('Speech recognition ended.');
      if (this.isListening) {
        this.stopRecording();
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
    this.currentQuestionIndex = 0;
    this.announceCurrentQuestion();
  }

  announceConfirmation() {
    if (this.isAnnouncement) {
      console.log('Confirmation announcement already in progress.');
      return;
    }

    this.isAnnouncement = true;
    console.log('Announcing confirmation.');
    /* const speech = new SpeechSynthesisUtterance('Would you like to answer the questions?');
    speech.onend = () => {
      console.log('Confirmation announcement ended.');
      this.isAnnouncement = false;
      this.showListeningIndicator();
      this.startRecordingFor(5);
    };
    window.speechSynthesis.speak(speech); */

    // this.pollyService.playSpeechWithCallback('Would you like to answer the questions?', 'Joanna', 'en-US', () => {
    let lang_code = "es-ES";
    // let voiceId = this.awsVoiceService.getAvailableVoice(lang_code);
    this.pollyService.getBestVoiceForLanguage(lang_code, 'Female').then(bestVoice => {
      if (bestVoice) {
        // this.pollyService.playSpeechWithCallback(bestVoice.Id, bestVoice.SupportedEngines[0]);  // Use the best voiceId and engine
        this.pollyService.playSpeechWithCallback('Would you like to answer the questions?', bestVoice.Id, lang_code, () => {
          console.log('Confirmation announcement ended.');
          this.isAnnouncement = false;
          this.showListeningIndicator();
          this.startRecordingFor(5);
        });
      }
    });
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
        } else {
          // If there is a transcript but no match, retry
          console.log('Transcript detected but no match. Retrying.');
          this.retryAnnouncement();
        }
      }, seconds * 1000);

      this.silenceTimeoutId = setTimeout(() => {
        if (this.isListening) {
          console.log('Silence timeout reached. Stopping recording.');
          this.stopRecording();
        }
      }, (seconds + 2) * 1000); // Buffer time
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
      console.log('Announcing question.');
      // const speech = new SpeechSynthesisUtterance(questionText);
      // speech.onend = () => {
      //   console.log('Question announcement ended.');
      //   this.isAnnouncement = false;
      //   this.showListeningIndicator();
      //   this.startRecordingFor(5);
      // };
      // window.speechSynthesis.speak(speech);
      // this.pollyService.playSpeechWithCallback(questionText, 'Joanna', 'en-US', () => {

      let lang_code = "es-ES";
      // let voiceId = this.awsVoiceService.getAvailableVoice(lang_code);
      this.pollyService.getBestVoiceForLanguage(lang_code, 'Female').then(bestVoice => {
        if (bestVoice) {
          this.pollyService.playSpeechWithCallback(questionText, bestVoice.Id, lang_code, () => {
            console.log('Question announcement ended.');
            this.isAnnouncement = false;
            this.showListeningIndicator();
            this.startRecordingFor(5);
          });
        }
      });
    } else {
      console.log('No more questions.');
      this.stopRecording();
    }
  }

  announceNextQuestion() {
    console.log('Moving to next question.');
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.announceCurrentQuestion();
    } else {
      console.log('All questions answered.');
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
      this.stopRecording();
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
        this.currentQuestionIndex = 0;
        this.announceCurrentQuestion();
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
        this.updateCheckboxes();
        this.announceNextQuestion();
      } else {
        console.log('No match found.');
        this.retryAnnouncement();
      }
    }
  }

  updateCheckboxes() {
    // Get the options for the current question
    const currentQuestionIndex = this.currentQuestionIndex;
    if (currentQuestionIndex === undefined) return; // Exit if no question is available

    // Query checkboxes only for the current question
    const checkboxes = document.querySelectorAll(`input[type="checkbox"][data-question-index="${currentQuestionIndex}"]`);

    checkboxes.forEach(checkbox => {
      const label = checkbox.nextElementSibling as HTMLLabelElement;
      const optionText = label.textContent?.trim().toLowerCase(); // Convert label text to lowercase

      const isSelected = this.selectedOptions[currentQuestionIndex]?.some(
        option => option.toLowerCase() === optionText // Compare in lowercase
      );

      (checkbox as HTMLInputElement).checked = isSelected;
    });
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
}

interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
