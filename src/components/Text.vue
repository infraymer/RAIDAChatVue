<template>
  <div class="text">
    <img src="/static/img/sendMsg.png" height="25" title="Send Message" @click="msgToSend()" />
    <textarea placeholder="Press Ctrl + Enter or click image to send message" v-model="content" @keyup="onKeyup"></textarea>
  </div>
</template>

<script>
  import shamir from 'sssa-js/sssa'
  import App from '../main'
  import {actions, socketAPI} from '../store'
  import util from '../utils'

  export default {
    data () {
      return {
        content: ''
      };
    },
    methods: {
      onKeyup (e) {
        if (e.ctrlKey && e.keyCode === 13 && this.content.trim().length) {
          this.msgToSend();
        }
      },
      msgToSend(){
        let serv = App.countServ;
        var parts = shamir.create(serv, serv, this.content.trim());

        let objs = [];
        let msgId = util.GUID();
        let transId = util.GUID();
        for(var i = 0; i < serv; i++){
          objs.push({
            execFun: socketAPI.SendMessage,
            data: {
              dialogId: this.$store.state.currentSessionId,
              textMsg: parts[i],
              msgId: msgId,
              curFrg: i+1,
              totalFrg: serv,
              transactionId: transId,
              deathDate: 0
            }
          })
        }
        actions.sendDifMessage(objs)
        this.content = '';
      }
    }
  };
</script>

<style lang="less" scoped>
  .text {
    height: 160px;
    border-top: solid 1px #ddd;
    img{
      position: absolute;
      right: 1%;
      top: 2%;
      opacity: 0.7;
      &:hover{
        cursor: pointer;
        opacity: 1 !important;
      }
    }
    textarea {
      padding: 10px;
      height: 100%;
      width: 100%;
      border: none;
      outline: none;
      font-family: "Micrsofot Yahei";
      resize: none;
      font-size: 16px;
      padding-right: 4%;
    }
  }
</style>
