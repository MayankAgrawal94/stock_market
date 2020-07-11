import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { WebsiteService } from '../shared/service/website.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  LoginForm : FormGroup;

  public noWhitespaceValidator(control: FormControl) {
      let isWhitespace = (control.value || '').trim().length === 0;
      let isValid = !isWhitespace;
      if(control.value == '' || control.value == null){
        isValid = isWhitespace;
        return isValid ? null : { 'whitespace': true }
      }else{
        return isValid ? null : { 'whitespace': true }
      }
  }

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private webService:WebsiteService,
  ) { 

    if(localStorage.getItem('isLoggedin')){
    	this.router.navigate(['/home/about']);
    }

    this.LoginForm = formBuilder.group({
      'email': [null,  Validators.compose([Validators.required, this.noWhitespaceValidator,
            Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')])],
      'password' : [null, Validators.compose([Validators.required])],
    })

  }

  ngOnInit() {
  }

  onSuccess(token){
    localStorage.setItem('isLoggedin', 'true');
    localStorage.setItem('_stk_LO', token);
    let tokenSave = this.webService.getHttpOptions();
    this.router.navigate(['/home/about']);
  }

  onSubmit(){
    if(this.LoginForm.valid){
      this.webService._onLogin(this.LoginForm.value)
      .subscribe(res=>{
        // console.log(res)
        if(res.error == false){
          this.webService.openSnackBar(res.message, '', 3000);
          this.onSuccess(res.body.token)
        }else{
          this.webService.openSnackBar(res.message, 'Oops!', 3000);
        }
      },err=>{
        console.log(err)
        this.webService.openSnackBar('Server encountered with some error, please try after some time.', 'Error!', 2000);
      })
    }else{
      this.webService.openSnackBar('Please fill all fields.', 'Oops!', 2000);
    }
  }

}
