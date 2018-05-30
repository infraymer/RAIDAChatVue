<template>
  <div class="main">
    <div class="header">
      <div>RAIDA<span>Chat</span></div>
    </div>

    <div class="footer">
      <div><span>Powered by</span> CloudCoin</div>
    </div>

    <div class="login-wrap">
      <div class="login-html">
        <input id="tab-1" type="radio" name="tab" class="sign-in" checked><label for="tab-1" class="tab">Sign In</label>
        <input id="tab-2" type="radio" name="tab" class="sign-up"><label for="tab-2" class="tab">Sign Up</label>

        <div class="login-form">

          <div class="sign-in-htm">
            <div class="group">
              <label for="user" class="label">Username (Login)</label>
              <input id="user" type="text" class="input" v-model="login">
            </div>
            <div class="group">
              <label for="pass" class="label">Password</label>
              <input id="pass" type="password" class="input" data-type="password" v-model="pass">
            </div>
            <div class="group">
              <input type="submit" class="button" value="Sign In" @click="onClickSignIn">
            </div>
          </div>

          <div class="sign-up-htm">
            <div class="group">
              <label for="user" class="label">Username (Login)</label>
              <input id="user" type="text" class="input" v-model="login">
            </div>
            <div class="group">
              <label for="userNick" class="label">Nickname</label>
              <input id="userNick" type="text" class="input" v-model="nickName">
            </div>
            <div class="group">
              <label for="pass" class="label">Password</label>
              <input id="pass" type="password" class="input" data-type="password" v-model="pass">
            </div>
            <div class="group">
              <label for="VeriPass" class="label">Repeat Password</label>
              <input id="VeriPass" type="password" class="input" data-type="password" v-model="verificatePass">
            </div>

            <div class="group">
              <input type="submit" class="button" value="Sign Up" @click="onClickSignUp">
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import {socketAPI} from '../store'
  import {actions} from '../store'
  import  util from '../utils'

  export default {
    name: 'Login',
    props: ['onPress'],
    data(){
      return {
        //user: this.$store.state.user,
        servs: this.$store.state.servers,
        login: '',
         pass: '',
         nickName: '',
         verificatePass: ''
      }
    },
    computed:{
      user(){
        return this.$store.state.user;
      }
    },
    methods: {
      onClickSignIn () {
        actions.showSpinner(true);
        var obj = {
          execFun: socketAPI.Auth,
          data: {
            login:this.login,
            password: this.pass
          }
        }
        this.$store.state.buffers.auth = [];
        actions.sendMessage(obj)
      },
      onClickSignUp () {

        if(!this.login || !this.nickName || !this.pass){
          this.$toast.error({
            title: 'Information is not correct',
            message:'Fields should not be empty'
          })
          return false;
        }

        if(this.pass !== this.verificatePass){
          this.$toast.error({
            title: 'Information is not correct',
            message:'Passwords is not equals'
          })
          return false;
        }

        actions.showSpinner(true);
        var obj = {
          execFun: socketAPI.Registration,
          data: {
            login: this.login,
            password: this.pass,
            nickName: this.nickName,
            transactionId: util.GUID()
          }
        }
        this.$store.state.buffers.reg = [];
        console.log(obj)
        actions.sendMessage(obj);
      }
    },
    created(){
      console.log('Login go');
    }
  };
</script>

<style scoped>
  @import url(https://fonts.googleapis.com/css?family=Exo:100,200,400);
  .main{
    text-align: center;
  }

  .header div{
   /* float: left;*/
    color: #fff;
    font-family: 'Exo', sans-serif;
    font-size: 35px;
    font-weight: 200;
    margin-top: 5%;
    margin-bottom: 1%;
  }

  .header div span{
    color: #1161ee !important;
  }

  .footer div{
    color: #fff;
    font-family: 'Exo', sans-serif;
    font-size: 20px;
    font-weight: 200;
  }
  .footer div span{
    color: #1161ee !important;
  }


  *,:after,:before{box-sizing:border-box}
  .clearfix:after,.clearfix:before{content:'';display:table}
  .clearfix:after{clear:both;display:block}
  a{color:inherit;text-decoration:none}

  .login-wrap{
    width:100%;
    margin:auto;
    max-width:525px;
    /*min-height:670px;*/
    min-height:460px;
    position:relative;
    /*background:url(https://raw.githubusercontent.com/khadkamhn/day-01-login-form/master/img/bg.jpg) no-repeat center;
    box-shadow:0 12px 15px 0 rgba(0,0,0,.24),0 17px 50px 0 rgba(0,0,0,.19);*/
  }
  .login-html{
    width:100%;
    height:100%;
    margin-top: 0%;
    position:absolute;
    padding:90px 70px 50px 70px;
    /*background:rgba(40,57,101,.9);*/
  }
  .login-html .sign-in-htm,
  .login-html .sign-up-htm{
    top:0;
    left:0;
    right:0;
    bottom:0;
    position:absolute;
    -webkit-transform:rotateY(180deg);
    transform:rotateY(180deg);
    -webkit-backface-visibility:hidden;
    backface-visibility:hidden;
    transition:all .4s linear;
  }
  .login-html .sign-in,
  .login-html .sign-up,
  .login-form .group .check{
    display:none;
  }
  .login-html .tab,
  .login-form .group .label,
  .login-form .group .button{
    text-transform:uppercase;
  }
  .login-html .tab{
    font-size:22px;
    margin-right:15px;
    padding-bottom:5px;
    margin:0 15px 10px 0;
    display:inline-block;
    border-bottom:2px solid transparent;
  }
  .login-html .sign-in:checked + .tab,
  .login-html .sign-up:checked + .tab{
    color:#eaeaea;
    border-color:#1161ee;
  }
  .login-form{
    min-height:345px;
    position:relative;
    -webkit-perspective:1000px;
    perspective:1000px;
    -webkit-transform-style:preserve-3d;
    transform-style:preserve-3d;
  }
  .login-form .group{
    margin-bottom:15px;
  }
  .login-form .group .label,
  .login-form .group .input,
  .login-form .group .button{
    width:100%;
    color:#fff;
    display:block;
  }
  .login-form .group .input,
  .login-form .group .button{
    border:none;
    padding:15px 20px;
    border-radius:25px;
    background:rgba(255,255,255,.1);
  }
  .login-form .group input[data-type="password"]{
    text-security:circle;
    -webkit-text-security:circle;
  }
  .login-form .group .label{
    color:#fff;
    font-size:12px;
  }
  .login-form .group .button{
    background:#1161ee;
  }

  .button:hover{
    cursor: pointer;
    opacity: 0.9;
  }

  .login-form .group label .icon{
    width:15px;
    height:15px;
    border-radius:2px;
    position:relative;
    display:inline-block;
    background:rgba(255,255,255,.1);
  }
  .login-form .group label .icon:before,
  .login-form .group label .icon:after{
    content:'';
    width:10px;
    height:2px;
    background:#fff;
    position:absolute;
    transition:all .2s ease-in-out 0s;
  }
  .login-form .group label .icon:before{
    left:3px;
    width:5px;
    bottom:6px;
    -webkit-transform:scale(0) rotate(0);
    transform:scale(0) rotate(0);
  }
  .login-form .group label .icon:after{
    top:6px;
    right:0;
    -webkit-transform:scale(0) rotate(0);
    transform:scale(0) rotate(0);
  }
  /*.login-form .group .check:checked + label{
    color:#fff;
  }
  .login-form .group .check:checked + label .icon{
    background:#1161ee;
  }
  .login-form .group .check:checked + label .icon:before{
    -webkit-transform:scale(1) rotate(45deg);
    transform:scale(1) rotate(45deg);
  }
  .login-form .group .check:checked + label .icon:after{
    -webkit-transform:scale(1) rotate(-45deg);
    transform:scale(1) rotate(-45deg);
  }*/
  .login-html .sign-in:checked + .tab + .sign-up + .tab + .login-form .sign-in-htm{
    -webkit-transform:rotate(0);
    transform:rotate(0);
  }
  .login-html .sign-up:checked + .tab + .login-form .sign-up-htm{
    -webkit-transform:rotate(0);
    transform:rotate(0);
  }

  .hr{
    height:2px;
    margin:60px 0 50px 0;
    background:rgba(255,255,255,.2);
  }
  .foot-lnk{
    text-align:center;
  }

</style>
