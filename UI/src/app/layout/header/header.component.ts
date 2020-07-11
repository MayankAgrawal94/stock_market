import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebsiteService } from '../../shared/service/website.service'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	nav = 1
  constructor(
    private router: Router,
    private webService:WebsiteService,
  ) { }

  ngOnInit() {
    let tokenSave = this.webService.getHttpOptions();
    this._sessionCheck();
    let href = this.router.url;
    if(href == '/home/about'){
      this.nav = 1
    }else if(href == '/home/dashboard'){
      this.nav = 2
    }
  }

  _sessionCheck(){
    this.webService._checkSession()
    .subscribe(res=>{
      if(res.error == true){
        this.webService.openSnackBar(res.message, 'Error!', 2000); 
      }
    },err=>{
      console.log(err)
    })
  }

  navClick(type){
  	this.nav = type
  }

  onLogout(){
    this.webService.onLogout();
  }

}
