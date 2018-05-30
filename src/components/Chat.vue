<template>
  <div class="app">
    <div class="sidebar">
      <card :onShowInfoPane="showPane"></card>
      <list :onShowInfoPane="showPane"></list>
    </div>
    <div class="main">
      <transition name="slide">
        <panel v-if="paneInfo" :type="typePane" :onHideInfoPane="HidePane" ></panel>
      </transition>
       <message></message>
       <TextField></TextField>
     </div>
  </div>
</template>

<script>
  import Card from './Card';
  import List from './List';
  import TextField from './Text';
  import Message from './Message';
  import Panel from './Panels/InfoPane'

  import {socketAPI} from '../store'
  import {actions} from '../store'

  export default {
    name: 'Chat',
    components: { Card, List, TextField, Message, Panel },
    methods: {
      GetUsersInfo(){
        let obj = {
          execFun: socketAPI.GetUsersInfo,
          data: {}
        };
        this.$store.state.buffers.users = [];
        this.$store.state.users = [];
        actions.sendMessage(obj);
      },
      GetDialogs(){
        actions.showSpinner(true);
        let obj = {
          execFun: socketAPI.GetDialogs,
          data: {
            msgCount: 100
          }
        };
        this.$store.state.buffers.auth = [];
        this.$store.state.sessions = [];
        actions.sendMessage(obj);
      },
      showPane(typePane){
        this.typePane = typePane;
        this.paneInfo = true;
      },
      HidePane(){
        this.paneInfo = false;
      }
    },
    data(){
      return {
        paneInfo: false,
        typePane: null
      }
    },
    created () {
      this.GetUsersInfo();
      this.GetDialogs();
    }
  }
</script>

<style scoped lang="less">
  .app {
    margin: 20px auto;
    width: 1000px;
    height: 700px;
    overflow: hidden;
    border-radius: 3px;
    background-color: #eee;
    .sidebar, .main {
      height: 100%;
    }
    .sidebar {
      float: left;
      width: 220px;
      color: #f4f4f4;
      background-color: #2e3238;
    }
    .main {
      position: relative;
      overflow: hidden;
      background-color: #eee;
    }
    .text {
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
    }
    .message {
      height: ~'calc(100% - 160px)';
    }

    .slide-enter-active, .slide-leave-active {
      transition: all 600ms cubic-bezier(0.455, 0.03, 0.515, 0.955);
    }
    .slide-enter, .slide-leave-to {
      transform: translateX(-780px);
    }

  }
</style>
