import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { SpeechComponent } from './speech/speech.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'ques', pathMatch: "full"
  }, {
    path: 'ques', component: QuestionnaireComponent,
  },{
    path: 'speech', component: SpeechComponent,
  },
  { path: '**', redirectTo: 'ques' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
