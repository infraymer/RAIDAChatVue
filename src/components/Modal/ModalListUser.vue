<template>
  <div class="back">
    <div class="list">
      <div class="header">
        {{dialogName}}
      </div>
      <ul>
        <li v-for="item in users" @click="copyLogin(item.login)" title="Click to copy user login">
          <div class="led" :class="{'led-red': !item.online, 'led-green': item.online}"></div>
          <img class="avatar"  width="30" height="30" :src="item.img" >
          <span class="name" >{{item.name | len}}<br>
            <span class="login" >{{item.login | len}}</span>
          </span>
        </li>
      </ul>
    </div>
    <input type="hidden" id="testing-code">
  </div>
</template>

<script>
  import utils from '../../utils'

  export default{
    props: ['users', 'dialogName'],
    methods:{
      copyLogin(login){
        let textToCopy = document.querySelector('#testing-code')
        textToCopy.value = login;
        textToCopy.setAttribute('type', 'text');
        textToCopy.select();

        try {
          var successful = document.execCommand('copy');
          var msg = successful ? 'successful' : 'unsuccessful';
          this.$toast.success({
            title: 'Copying to clipboard',
            message: 'Login was copied ' + msg
          })
        } catch (err) {
        }

        /* unselect the range */
        textToCopy.setAttribute('type', 'hidden')
        window.getSelection().removeAllRanges()
      }
    },
    filters: {
      len(name){
        return name.length > 30 ? name.substring(0, 30) + '...' : name;
      }
    }
  }
</script>

<style scoped lang="less">
  .header{
    text-align: center;
    color: #fff;
    font-family: 'Exo', sans-serif;
    font-size: 15px;
    font-weight: 400;
    padding-top: 1%;
    margin-bottom: 2%;
  }

  .back {
    width: 100%;
    height: 100%;
    background: rgb(37, 40, 45) none repeat scroll 0% 0% !important;
    color: rgb(195, 195, 195) !important;
  }

  .list {
    ul {
      /* height: 595px;*/
      /* overflow-y: auto;*/
    }

    li {
      position: relative;
      padding: 12px 15px;
      border-bottom: 1px solid #292C33;
      cursor: pointer;
      transition: background-color .1s;
      line-height: 1;
      &:hover {
        background-color: rgba(255, 255, 255, 0.03);
      }
    }
    .avatar, .name {
      vertical-align: middle;

    }
    .avatar {
      border-radius: 2px;
      float: left;
      background-color: #fff;
    }
    .name {
      margin: 0 0 0 5px;
      .login {
        margin: 0 0 0 5px;
        font-size: 10px;
      }
    }

    .led {
     /* margin: auto 10px;*/
      position: absolute;
      top: 13px;
      left: 16px;
      width: 6px;
      height: 6px;
      display: inline-block;
      border-radius: 50%;
    }
    .led-red {
      background-color: #f40;
      box-shadow: #000 0 -1px 7px 1px, inset #600 0 -1px 9px, #F00 0 2px 12px;
    }

    .led-green {
      background-color: #4f0;
      box-shadow: #000 0 -1px 7px 1px, inset #460 0 -1px 9px, #7D0 0 2px 12px;
    }
  }
</style>
