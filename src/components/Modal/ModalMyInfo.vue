<template>
  <div class="back">
        <img class="close" width="10" height="10" src="/static/img/wclose.png" @click="$emit('close')" >
    <div class="login">
      {{user.login}}
    </div>

    <div class="content">
      <div class="group">
        <span>NickName</span>
        <input class="inp" type="text" v-model="user.name">
      </div>

      <div class="group">
        <span class="avatar-text">Avatar</span>
        <img class="avatar" width="40" height="40" :alt="user.name" v-bind:src="user.img" @click="selectAvatar" title="Click to change image">
        <span class="error" v-if="error">Support only image with size <= 1Mb</span>
      </div>

      <div class="group">
        <span>About me</span>
        <input class="inp" type="text" v-model="user.about">
      </div>

      <div class="newpass">
        <div class="overlap" v-if="!user.changepass"></div>
        <div class="check-div">
          <input type="checkbox" id="cb_new_pass" v-model="user.changepass" class="check"/>
          <label for="cb_new_pass" ><span class="icon"></span>Change password</label>
        </div>
        <div class="group">
          <span>Current password</span>
          <input class="inp" type="password" v-model="user.oldpass">
        </div>
        <div class="group">
          <span>New password</span>
          <input class="inp" type="password" v-model="user.newpass">
        </div>
        <div class="group">
          <span>Repeat Password</span>
          <input class="inp" type="password" v-model="user.verifpass">
        </div>
      </div>
    </div>

    <input type="button" class="button-update" value="Update" @click="updateInfo" />

    <input type="file" style="display:none" ref="changeAvatar" accept="image/*" @change="uploadFile($event, user)"/>
   <!-- <canvas v-compressImg="user.img" style="display: none"></canvas>-->
  </div>
</template>

<script>
  import store from '../../store'
  import App from '../../main'
  import {socketAPI} from '../../store'
  import {actions} from '../../store'
  import utils from '../../utils'

  export default {
    data(){
      return{
        user : JSON.parse(JSON.stringify(store.state.user)),
        error: false
      }
    },
    methods:{
      selectAvatar(){
        this.$refs.changeAvatar.click()
      },
      uploadFile(event, user){
        let file = event.target.files[0];
        if(file != undefined){
          //  this.compressImg(file)
          if((file.size < (1024*1024)) && (file.type.match('image/*'))){
            this.$data.error = false;
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
              user.img = reader.result;
            };
          }else{
            this.$data.error = true;
          }

        }
      },
      updateInfo(){
        if(this.user.changepass === true){
          if(this.user.newpass === undefined || this.user.newpass.length < 6){
            this.$toast.error({
              title: 'New password is not match length',
              message:'Minimum length of password is 6 chars'
            })
            return false;
          }
          if(this.user.newpass !== this.user.verifpass){
            this.$toast.error({
              title: 'Information is incorrect',
              message:'Passwords is not equals'
            })
            return false;
          }
        }
        actions.showSpinner(true);
        let obj = {
          execFun: socketAPI.ChangeUserInfo,
          data: {
            name: this.user.name,
            photo: this.user.img,
            about: this.user.about,
            changepass: this.user.changepass,
            oldpass: this.user.oldpass,
            newpass: this.user.newpass
          }
        };
        actions.sendMessage(obj);
        console.log(obj)
      }
    },
    /*directives: {
      compressImg: function(canvas, file, vnode){
        console.log('sizing', file);
        console.log('sizing', file.value);
        var img = document.createElement("img");
        img.src = file.value;

        /!*var reader = new FileReader();
        reader.onload = function(e) {img.src = e.target.result}
        reader.readAsDataURL(file.value);*!/


        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var MAX_WIDTH = 100;
        var MAX_HEIGHT = 100;
        var width = img.width;
        var height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        var dataurl = canvas.toDataURL("image/png");
        console.log(img)
        vnode.context.$set(vnode.context.user, 'newimg',  dataurl);
        console.log(vnode.context.user.img)
        console.log(dataurl)
      },
    },*/
    create(){
      App.$set(this.user, 'oldpass', '');
      App.$set(this.user, 'newpass', '');
      App.$set(this.user, 'verifpass', '');
      App.$set(this.user, 'changepass', false);
      App.$set(this.user, 'about', '');
    }
  }
</script>

<style lang="less" scoped>
  .back{
    background: #25282d;
    height: 100%;
    .close{
      float: right;
      margin: 2% 2% 0 0;
      opacity: 0.6;
      &:hover{
        cursor: pointer;
        opacity: 1;
      }
    }
  }
  .login{
    text-align: center;
    color: #c3c3c3;
    /*color: #416081;*/
    font-family: 'Exo', sans-serif;
    font-size: 30px;
    font-weight: 400;
    padding-top: 3%;
    margin-bottom: 4%;
  }

  .avatar, .name {
    vertical-align: middle;
  }
  .avatar {
    border-radius: 2px;
    background: #fff;
    &:hover{
      cursor: pointer;
    }
  }
  .name {
    display: inline-block;
    margin: 0 0 0 5px;
    font-size: 16px;
  }

  .content {
    padding: 2% 2% 0 2%;
    .group{
      padding: 2%;
      span {
        vertical-align: middle !important;
        /*min-width: 50px;*/
        /* color: #1161ee;*/
        color: #c3c3c3;
        /*color: #416081;*/
        font-family: 'Exo', sans-serif;
        font-size: 15px;
        font-weight: 800;
        float: left;
        width: 90px;
        margin-top: 1%;

        &.error{
          float: none !important;
          width: 200px;
          color: #c0ad97;
          margin-left: 5px;
        }

        &.avatar-text{
          margin-top: 2% !important;
        }
      }

      .inp {
        padding: 0 10px;
        width: 80%;
        font-size: 12px;
        color: #fff;
        height: 30px;
        line-height: 30px;
        border: solid 1px #234162;
        border-radius: 4px;
        outline: none;
        /*background-color: #26292E;*/
        /*background-color: #43628466;*/
        background-color: rgba(67, 71, 76, 0.4);
      }
    }
    .newpass {
      border: solid 1px #234162;
      height: 170px;
      margin-top: 5%;
      margin-bottom: 3%;

      .overlap{
        z-index: 9;
        position: absolute;
        width: 478px;
        height: 168px;
        background-color: rgba(52, 56, 61, 0.5);
        /*background-color: #f5f5f580;*/
      }
      .check-div{
        position: relative;
        top: -11px;
        z-index: 10;
        background: #25282d;
        /*background: #fff;*/
        width: 140px;
        left: 8px;
        padding-left: 2px;
        display: block;
      }

      span{
        width: 150px !important;
      }
      .inp{
        width: 67%;
      }

    }

    .check{
      display: none;
    }
    .check + label{
      color: #c3c3c3;
    }
    .check:checked + label .icon{
      background:#1161ee;
    }
    .check:checked + label .icon:before{
      -webkit-transform:scale(1) rotate(45deg);
      transform:scale(1) rotate(45deg);
    }
    .check:checked + label .icon:after{
      -webkit-transform:scale(1) rotate(-45deg);
      transform:scale(1) rotate(-45deg);
    }
    label:hover{
      cursor: pointer;
    }
    label .icon{
      width:17px !important;
      height:17px;
      border-radius:2px;
      position:relative;
      display:inline-block;
      background:rgba(255,255,255,.1);
      margin-right: 5px;
      border: solid 1px #000;
      vertical-align: sub;
    }
    label .icon:before,
    label .icon:after{
      content:'';
      width:10px;
      height:2px;
      background:#fff;
      position:absolute;
      transition:all .2s ease-in-out 0s;
    }
    label .icon:before{
      left:3px;
      width:5px;
      bottom:6px;
      -webkit-transform:scale(0) rotate(0);
      transform:scale(0) rotate(0);
    }
    label .icon:after{
      top:6px;
      right:0;
      -webkit-transform:scale(0) rotate(0);
      transform:scale(0) rotate(0);
    }

  }

  .button-update{
    background:#416081;

    color:#fff;
    border:none;
    border-radius:4px;
    display: block;
    margin-right: auto;
    margin-left: auto;

    width: 25%;
    height: 30px;
    &:hover{
      cursor: pointer;
      opacity: 0.9;
    }
  }
</style>
