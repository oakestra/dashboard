"use strict";(self.webpackChunkedgeIO_frontend=self.webpackChunkedgeIO_frontend||[]).push([[217],{3217:(N,u,s)=>{s.r(u),s.d(u,{LoginModule:()=>O});var c=s(6582),n=s(4006),l=s(3546),p=s(4859),g=s(7392),f=s(6895),v=s(266),P=s(9549),C=s(4144),y=s(7274),T=s(2340),m=s(4934),t=s(4650),U=s(4389),b=s(4865),h=s(4017),w=s(7775);function M(r,a){1&r&&(t.TgZ(0,"div",14),t._uU(1," Please enter the same password again to confirm. "),t.qZA())}const k=[{path:"",component:(()=>{class r{constructor(o,e,i,d,_,Z){this.router=o,this.userService=e,this.authService=i,this.notifyService=d,this.api=_,this.fb=Z,this.sm_ip=T.N.apiUrl,this.form=Z.group({username:["",[n.kI.required]],password:["",[n.kI.required]]})}submitLogin(){const o=this.form.get("username"),e=this.form.get("password");o?.valid&&e?.valid?this.userService.login({username:o.value,password:e.value}).subscribe({next:d=>{d&&this.authService.getAuthorization().subscribe(()=>{this.router.navigate(["/control"])})},error:d=>this.notifyService.notify(m.k.error,d)}):this.notifyService.notify(m.k.error,"Please provide valid inputs for login.")}forgotPassword(){const o=this.form.get("username");o?.valid?this.api.resetPassword(o.value).subscribe(()=>{this.notifyService.notify(m.k.success,"An email with a reset password link was sent")}):this.notifyService.notify(m.k.error,"Please provide a valid username")}registerForm(){this.router.navigate(["/register"]).then()}}return r.\u0275fac=function(o){return new(o||r)(t.Y36(c.F0),t.Y36(U.K),t.Y36(b.e),t.Y36(h.g),t.Y36(w.s),t.Y36(n.qu))},r.\u0275cmp=t.Xpm({type:r,selectors:[["app-login"]],decls:25,vars:2,consts:[[1,"login-form"],["alt","Oakestra Logo","mat-card-image","","src","../../../../assets/img/color-full.png"],[1,"connectingInfo",3,"matTooltip"],["accept-charset","UTF-8","role","form",3,"formGroup"],["formControlName","username","id","username","name","username","placeholder","Username","type","text",1,"form-control"],[1,"form-group"],[1,"pull-right","text-primary","link",3,"click"],[1,"cols-sm-10"],[1,"input-group-addon"],["aria-hidden","true",1,"fa","fa-lock","fa-lg"],["formControlName","password","id","password","name","password","placeholder","Password","type","password",1,"form-control",3,"keyup.enter"],[1,"centerButton"],["color","primary","mat-flat-button","",3,"click"],[1,"signUp"],["for","password",1,"cols-sm-2","control-label"]],template:function(o,e){1&o&&(t.TgZ(0,"mat-card",0),t._UZ(1,"img",1),t.TgZ(2,"mat-card-content")(3,"mat-icon",2),t._uU(4,"info"),t.qZA(),t.TgZ(5,"form",3)(6,"div")(7,"div"),t._UZ(8,"input",4),t.qZA(),t.TgZ(9,"div",5)(10,"span",6),t.NdJ("click",function(){return e.forgotPassword()}),t._uU(11,"Forgot password?"),t.qZA(),t.TgZ(12,"div",7)(13,"span",8),t._UZ(14,"i",9),t.qZA(),t.TgZ(15,"input",10),t.NdJ("keyup.enter",function(){return e.submitLogin()}),t.qZA()()(),t._UZ(16,"hr"),t.TgZ(17,"div",11)(18,"button",12),t.NdJ("click",function(){return e.submitLogin()}),t._uU(19,"Sign in"),t.qZA()(),t.TgZ(20,"div",13)(21,"label",14),t._uU(22,"Don't have an account?\u2002"),t.qZA(),t.TgZ(23,"span",6),t.NdJ("click",function(){return e.registerForm()}),t._uU(24,"Sign up now "),t.qZA()()()()()()),2&o&&(t.xp6(3),t.MGl("matTooltip","Connecting to: ",e.sm_ip,""),t.xp6(2),t.Q6J("formGroup",e.form))},dependencies:[n._Y,n.Fj,n.JJ,n.JL,l.a8,l.dn,l.G2,p.lW,g.Hw,n.sg,n.u,v.gM],styles:[".login-form[_ngcontent-%COMP%]{width:80%;height:-moz-fit-content;height:fit-content;position:absolute;inset:0;margin:auto}.connectingInfo[_ngcontent-%COMP%]{float:right;margin:8px}.signUp[_ngcontent-%COMP%]{display:flex;justify-content:center;margin-top:8px}.form-group[_ngcontent-%COMP%]{margin-top:8px}.loginButton[_ngcontent-%COMP%]{display:flex;justify-content:center}.centerButton[_ngcontent-%COMP%]{display:flex;justify-content:center;margin-top:8px}.link[_ngcontent-%COMP%]{cursor:pointer;float:right}@media only screen and (min-width: 801px){.login-form[_ngcontent-%COMP%]{width:70%}}@media only screen and (min-width: 1201px){.login-form[_ngcontent-%COMP%]{width:35%}}"]}),r})(),pathMatch:"full"},{path:"resetPassword/:resetPasswordToken",component:(()=>{class r{constructor(o,e,i,d){this.router=o,this.activatedRoute=e,this.api=i,this.notifyService=d,this.form=new n.cw({newPass:new n.NI("",n.kI.required),confirmPass:new n.NI("",n.kI.required)}),this.resetPasswordToken=""}ngOnInit(){this.activatedRoute.params.subscribe(o=>{const e=o.resetPasswordToken;e?this.resetPasswordToken=e:this.router.navigate(["/"])})}get samePasswords(){var o,e;return(null===(o=this.form.get("newPass"))||void 0===o?void 0:o.value)===(null===(e=this.form.get("confirmPass"))||void 0===e?void 0:e.value)}submitNewPassword(){var o;const e=null===(o=this.form.get("newPass"))||void 0===o?void 0:o.value;this.api.saveResetPassword(this.resetPasswordToken,e).subscribe(()=>{this.notifyService.notify(m.k.success,"New password saved!"),this.router.navigate(["/"])},i=>console.log(i))}}return r.\u0275fac=function(o){return new(o||r)(t.Y36(c.F0),t.Y36(c.gz),t.Y36(w.s),t.Y36(h.g))},r.\u0275cmp=t.Xpm({type:r,selectors:[["app-reset-password"]],decls:25,vars:3,consts:[[1,"resetForm"],["accept-charset","UTF-8",3,"formGroup"],[1,"form-group"],["for","newPassword",1,"cols-sm-2","control-label"],[1,"cols-sm-10"],[1,"input-group"],[1,"input-group-addon"],["aria-hidden","true",1,"fa","fa-lock","fa-lg"],["formControlName","newPass","id","newPassword","placeholder","New password","type","password",1,"form-control"],["for","confirmNewPassword",1,"cols-sm-2","control-label"],["formControlName","confirmPass","id","confirmNewPassword","placeholder","Confirm password","type","password",1,"form-control"],["class","alert alert-danger",4,"ngIf"],[1,"saveButton"],["mat-button","","mat-flat-button","","type","button",3,"disabled","click"],[1,"alert","alert-danger"]],template:function(o,e){1&o&&(t.TgZ(0,"mat-card",0)(1,"mat-card-title"),t._uU(2,"Change Password"),t.qZA(),t.TgZ(3,"mat-card-content")(4,"form",1)(5,"div",2)(6,"label",3),t._uU(7,"New Password"),t.qZA(),t.TgZ(8,"div",4)(9,"div",5)(10,"span",6),t._UZ(11,"i",7),t.qZA(),t._UZ(12,"input",8),t.qZA()()(),t.TgZ(13,"div",2)(14,"label",9),t._uU(15,"Confirm new password"),t.qZA(),t.TgZ(16,"div",4)(17,"div",5)(18,"span",6),t._UZ(19,"i",7),t.qZA(),t._UZ(20,"input",10),t.qZA(),t.YNc(21,M,2,0,"div",11),t.qZA()(),t.TgZ(22,"div",12)(23,"button",13),t.NdJ("click",function(){return e.submitNewPassword()}),t._uU(24," Save new password "),t.qZA()()()()()),2&o&&(t.xp6(4),t.Q6J("formGroup",e.form),t.xp6(17),t.Q6J("ngIf",e.form.get("confirmPass").touched&&!e.samePasswords),t.xp6(2),t.Q6J("disabled",!e.form.valid||!e.samePasswords))},dependencies:[n._Y,n.Fj,n.JJ,n.JL,l.a8,l.dn,l.n5,p.lW,n.sg,n.u,f.O5],styles:[".resetForm[_ngcontent-%COMP%]{position:fixed;top:50%;left:50%;width:25%;margin-left:-12.5%;margin-top:-40vh}input[_ngcontent-%COMP%]{margin-top:5px}label[_ngcontent-%COMP%]{margin-top:15px}fieldset[_ngcontent-%COMP%]{margin:0;border:none}.saveButton[_ngcontent-%COMP%]{width:100%;text-align:center;margin-top:30px}@media only screen and (max-width: 801px){.resetForm[_ngcontent-%COMP%]{width:40%}}@media only screen and (min-width: 1201px){.resetForm[_ngcontent-%COMP%]{width:35%}}"]}),r})()},{path:"register",component:(()=>{class r{constructor(o){this.router=o}submitRegister(){}loginForm(){this.router.navigate([""])}}return r.\u0275fac=function(o){return new(o||r)(t.Y36(c.F0))},r.\u0275cmp=t.Xpm({type:r,selectors:[["app-register"]],decls:49,vars:0,consts:[[1,"register-form"],[1,"title"],[1,"cols-sm-2","control-label"],["accept-charset","UTF-8","role","form",1,"form-signup"],[1,"form-group"],["for","username",1,"cols-sm-2","control-label"],[1,"cols-sm-10"],[1,"input-group"],["id","username","name","username","placeholder","Enter your Username","type","text","formControlName","name",1,"form-control"],["for","email",1,"cols-sm-2","control-label"],[1,"input-group-addon"],["aria-hidden","true",1,"fa","fa-lock","fa-lg"],["id","email","name","email","placeholder","Enter your Email",1,"form-control"],["for","password",1,"cols-sm-2","control-label"],["id","password","name","password","placeholder","Enter your Password","type","password",1,"form-control"],["name","password","placeholder","Confirm your Password","type","password",1,"form-control"],[1,"centerButton"],["mat-button","","mat-flat-button","","type","button",1,"form-group",3,"click"],[1,"pull-right","text-primary","link",3,"click"]],template:function(o,e){1&o&&(t.TgZ(0,"mat-card",0)(1,"div",1)(2,"label",2)(3,"strong"),t._uU(4,"REGISTRATION"),t.qZA()()(),t.TgZ(5,"form",3)(6,"div",4)(7,"label",5)(8,"strong"),t._uU(9,"Username"),t.qZA()(),t.TgZ(10,"div",6)(11,"div",7),t._UZ(12,"input",8),t.qZA()()(),t.TgZ(13,"div",4)(14,"label",9)(15,"strong"),t._uU(16,"Email address"),t.qZA()(),t.TgZ(17,"div",6)(18,"div",7)(19,"span",10),t._UZ(20,"i",11),t.qZA(),t._UZ(21,"input",12),t.qZA()()(),t.TgZ(22,"div",4)(23,"label",13)(24,"strong"),t._uU(25,"Password"),t.qZA()(),t.TgZ(26,"div",6)(27,"div",7)(28,"span",10),t._UZ(29,"i",11),t.qZA(),t._UZ(30,"input",14),t.qZA()()(),t.TgZ(31,"div",4)(32,"label",13)(33,"strong"),t._uU(34,"Confirm Password"),t.qZA()(),t.TgZ(35,"div",6)(36,"div",7)(37,"span",10),t._UZ(38,"i",11),t.qZA(),t._UZ(39,"input",15),t.qZA()()(),t.TgZ(40,"div")(41,"div",16)(42,"button",17),t.NdJ("click",function(){return e.submitRegister()}),t._uU(43," Sign up "),t.qZA()()(),t.TgZ(44,"div",16)(45,"label",13),t._uU(46,"Have already an account?\u2002"),t.qZA(),t.TgZ(47,"span",18),t.NdJ("click",function(){return e.loginForm()}),t._uU(48,"Login here"),t.qZA()()()())},dependencies:[n._Y,n.Fj,n.JJ,n.JL,n.F,l.a8,p.lW,n.u],styles:[".register-form[_ngcontent-%COMP%]{width:80%;height:-moz-fit-content;height:fit-content;position:absolute;inset:0;margin:auto}.form-group[_ngcontent-%COMP%]{margin-top:8px}button[_ngcontent-%COMP%]{background-color:#4a7083;color:#fff}.title[_ngcontent-%COMP%]{display:flex;justify-content:center;font-size:x-large}.centerButton[_ngcontent-%COMP%]{display:flex;justify-content:center;margin-top:8px}.link[_ngcontent-%COMP%]{cursor:pointer;float:right}@media only screen and (min-width: 801px){.register-form[_ngcontent-%COMP%]{width:40%}}@media only screen and (min-width: 1201px){.register-form[_ngcontent-%COMP%]{width:25%}}"]}),r})(),pathMatch:"full"}];let O=(()=>{class r{}return r.\u0275fac=function(o){return new(o||r)},r.\u0275mod=t.oAB({type:r}),r.\u0275inj=t.cJS({imports:[c.Bz.forChild(k),n.u5,l.QW,p.ot,g.Ps,n.UX,f.ez,v.AV,P.lN,C.c,y.Is,c.Bz]}),r})()}}]);