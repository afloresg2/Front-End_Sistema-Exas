import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginData= {
    "username":'',
    "password":''
  }
  constructor(private snack:MatSnackBar,private loginService:LoginService,private router:Router){

  }
  ngOnInit(): void {
    
  }
  formSubmit(){
    if(this.loginData.username.trim()==''||this.loginData.username.trim()==null){
      this.snack.open("El nombre de usuario es requerido",'Aceptar',{
        duration:3000
      })
      return;
    }
    if(this.loginData.password.trim()==''||this.loginData.password.trim()==null){
      this.snack.open("La contraseña de usuario es requerido",'Aceptar',{
        duration:3000
      })
      return;
    }

    this.loginService.generateToken(this.loginData).subscribe(
      (data:any) => {
        console.log(data);
        this.loginService.loginUser(data.token);
        this.loginService.getCurrentUser().subscribe((user:any) =>{
          this.loginService.setUser(user);
          console.log(user);

          if(this.loginService.getUserRole()=='ADMIN'){
            //dashboard admin
            //window.location.href='/admin'
            this.router.navigate(['admin']);
            this.loginService.loginStatusSubject.next(true);
          }else if(this.loginService.getUserRole()=='NORMAL'){
            //window.location.href='/user-dashboard'
            this.router.navigate(['user-dashboard']);
            this.loginService.loginStatusSubject.next(true);
          }else{
            this.loginService.logOut();
          }
        })
      },(error)=>{
        console.log(error);
        this.snack.open('Detalles Invalidos, vuelva a intentar','Aceptar',{
          duration:3000
        });
      }
    )
  }
}
