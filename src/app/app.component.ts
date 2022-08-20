// Actual business layer

import { Component } from '@angular/core'; //AG
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

export class User{
  username: string | undefined;
  password: string | undefined;
  constructor(username:string,password:string)
  {
    this.username=username;
    this.password=password;
  }
}

@Component({
  selector: 'app-root',  // index.html is mapped here (DATA BINDING)
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pension-app';
  jwtToken = '';


  showFlag=1;                //pg1

  pensionDetails:any;
  pensionProcess: any;
  aadharNumber: any;

  onClickSubmit(result: { username: string; password: string}) {   //print on the console section of the browser 
    console.log("You have entered : " + result.username); 
    console.log("You have entered : " + result.password);

    this.getJwtToken(new User(result.username, result.password))  //token will be passed by using subscribe that acts like a glue between getJwtToken and result
   .subscribe
   (
       data=>
       {
         console.log(data.jwt);         //token will be visible on browser
         this.jwtToken=data.jwt;        //token (data) 

         this.showFlag=2;              //pg2

       }
   );
 }



 onClickSubmit2(result: { aadharNumber: string}) {
  console.log("You have entered : " + result.aadharNumber); 
  this.aadharNumber=result.aadharNumber;
  this.getcomments()                    //this.getcomments() will give all the all the pensioner details, subscribe will act as a glue between getmethods() and result
         .subscribe
         (
             data=>
             {
               
               this.pensionDetails=data;
               console.log(this.pensionDetails);
               this.postcomments()      //this.postcomments() will give all the all the pensioner details, subscribe will act as a glue between postmethods() and result
    .subscribe
    (
        data=>
        {
          console.log(data);
          this.pensionProcess=data.pension_amount;

          this.showFlag=3;             //pg3
        }
    );

            }
         )

 }



 constructor(private httpclient:HttpClient)
    {

    }
 getJwtToken(user:User): Observable<any>
 {
     const headers = new HttpHeaders().set(
       'Content-Type', 'application/json')
       
     return this.httpclient.post("http://localhost:8080/authenticate", JSON.stringify(user), {headers})
 }


 getcomments(): Observable<any>
 {
     const headers = new HttpHeaders().set(
         'Authorization',
         'Bearer ' + this.jwtToken);
     return this.httpclient.get("http://localhost:8081/thepension/" +this.aadharNumber, {headers})
 }

 
 postcomments(): Observable<any>
 {
     return this.httpclient.post("http://localhost:8082/ProcessPension/" +this.aadharNumber,{});
 }
 
}
