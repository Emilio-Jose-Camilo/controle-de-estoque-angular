import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { AuthResquest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginCard = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  signupForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]

  })

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router
  ) {}

  onSubmitLoginForm(): void {
    if(this.loginForm.value && this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthResquest)
        .subscribe({
          next: (response) => {
            if(response) {
              this.cookieService.set('User_INFO', response?.token);

              this.loginForm.reset();
              this.router.navigate(['/dashboard']);

              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Bem vindo de volta ${response?.name}!`,
                life: 2000,
              })
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'erro',
              detail: `Erro ao fazer login`,
              life: 2000,
            });
            console.log(err)
          }
        })
    }

  //console.log('Dados do formulário de login', this.loginForm.value)
  }

  onSubmitsignupForm(): void {
    if(this.signupForm.value && this.signupForm.valid) {
      this.userService
        .signupUser(this.signupForm.value as SignupUserRequest)
        .subscribe({
          next: (response) => {
            if(response) {
              this.signupForm.reset();
              this.loginCard = true;
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Usuário criado com sucesso!',
                life: 2000,
              });
            }
          },
          error: (err) =>{
            this.messageService.add({
              severity: 'error',
              summary: 'erro',
              detail: 'Erro ao criar usuário',
              life: 2000,
            });

            console.log(err)
          }
        })
    }
 // console.log('Dados do formulário de Criação de conta', this.signupForm.value)
  }
}
