import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { SpeechComponent } from './speech/speech.component';
import { SpeechrecoComponent } from './speechreco/speechreco.component';
import { Speech1Component } from './speech1/speech1.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'ques', pathMatch: "full"
  }, {
    path: 'ques', component: QuestionnaireComponent,
  },{
    path: 'speech', component: SpeechComponent,
  },
  {
    path: 'speech1', component: Speech1Component,
  },{
    path: 'speechreco', component: SpeechrecoComponent,
  },
  { path: '**', redirectTo: 'ques' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
