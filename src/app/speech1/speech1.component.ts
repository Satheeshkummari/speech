import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { SpeechRecognitionService } from './speech-recognition.service';
import { SpeechSynthesisService } from './speech-synthesis.service';

@Component({
  selector: 'app-speech1',
  templateUrl: './speech1.component.html',
  styleUrls: ['./speech1.component.scss']
})
export class Speech1Component implements OnInit {
  @ViewChild('ripple', { static: true }) ripple: ElementRef;
  questions = [
    { question: 'What is your favorite color?', options: ['Red', 'Blue', 'Green', 'Yellow'], answer: '' },
    { question: 'What is your favorite animal?', options: ['Cat', 'Dog', 'Bird', 'Fish'], answer: '' },
    { question: 'What is your favorite food?', options: ['Pizza', 'Burger', 'Pasta', 'Salad'], answer: '' },
  ];
  currentQuestionIndex = 0;
  listening = false;
  confirmed = false;
  recognizedText = '';

  constructor(
    private speechRecognitionService: SpeechRecognitionService,
    private speechSynthesisService: SpeechSynthesisService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.speechRecognitionService.init();
  }

  start() {
    this.confirmed = false;
    this.startListening('Would you like to answer the questionnaire?');
  }

  async startListening(prompt: string) {
    await this.speechSynthesisService.speak(prompt);
    this.cdr.detectChanges();

    this.listening = true;
    this.showRippleEffect();
    const result = await this.speechRecognitionService.listenFor(5);
    this.listening = false;
    this.hideRippleEffect();
    this.recognizedText = result;
    if (result.toLowerCase() === 'yes') {
      this.confirmed = true;
      this.askNextQuestion();
    } else {
      console.log('User declined to answer the questionnaire.');
    }
  }

  async askNextQuestion() {
    if (this.currentQuestionIndex < this.questions.length) {
      const question = this.questions[this.currentQuestionIndex];
      await this.speechSynthesisService.speak(`${question.question} Options are: ${question.options.join(', ')}`);
      this.listening = true;
      this.showRippleEffect();
      const result = await this.speechRecognitionService.listenFor(5);
      this.listening = false;
      this.hideRippleEffect();
      this.recognizedText = result;
      question.answer = this.getBestMatch(result, question.options);
      this.currentQuestionIndex++;
      this.cdr.detectChanges();
      this.askNextQuestion();
    } else {
      console.log('All questions answered.');
    }
  }

  getBestMatch(response: string, options: string[]): string {
    return options.find(option => response.toLowerCase().includes(option.toLowerCase())) || '';
  }

  showRippleEffect() {
    this.ripple.nativeElement.classList.add('ripple-visible');
  }

  hideRippleEffect() {
    this.ripple.nativeElement.classList.remove('ripple-visible');
  }
}
