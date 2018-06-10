<template>
  <div>
    <div class="leds">
      <div v-for="item in servs" :class="{'led-on': item.status, 'led-off': !item.status}"></div>
    </div>
    <chat
      v-if="user">
    </chat>
    <login v-else>
      <!--:onPress="onSignIn"-->
    </login>
    <modals-container/>
  </div>
</template>

<script>
  import Chat from './components/Chat';
  import Login from './components/Login';

  import Ws from './socket';

  import ss from 'sssa-js/sssa'
  import serv from '../static/trusted.txt'

  export default {
    name: 'App',
    components: {
      Login, Chat
    },
    data(){
      return {

        //ip: ['ws://192.168.0.102:49001',  'ws://192.168.0.102:49002',  'ws://192.168.0.102:49003'],
        //ip: servs.split(/\n/).filter(address => address.length > 0)
      }
    },
    computed:{
      user(){
        return this.$store.state.user.auth;
      },
      servs(){
        return this.$store.state.servers;
      },
      ip(){return serv.split(/\n/).filter(address => address.length > 0)}
    },
    created(){
      this.$store.state.servers = [];
      for (var i = 0; i < this.ip.length; i++){
        this.servs.push(new Ws(this.ip[i]));
      }

    }
  }
</script>

<style src="cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css"></style>
<style scoped>
  .leds {
    text-align: center;
    margin-top: 1%;
  }
  /*
    .led-red {
      margin: auto 10px;
      width: 12px;
      height: 12px;
      background-color: #f40;
      display: inline-block;
      border-radius: 50%;
      box-shadow: #000 0 -1px 7px 1px, inset #600 0 -1px 9px, #F00 0 2px 12px;
    }

      .led-green {
        margin: auto 10px;
        width: 12px;
        height: 12px;
        background-color: #4f0;
        display: inline-block;
        border-radius: 50%;
        box-shadow: #000 0 -1px 7px 1px, inset #460 0 -1px 9px, #7D0 0 2px 12px;
      }
    */

  .led-on {
    margin: auto 10px;
    width: 12px;
    height: 12px;
/*    background-color: #4AB;*/
    background-color: #00DBFF;
    display: inline-block;
    border-radius: 50%;
    box-shadow: #000 0 -1px 7px 1px, inset #006 0 -1px 9px, #06F 0 2px 14px;
  }

  .led-off {
    margin: auto 10px;
    width: 12px;
    height: 12px;
    background-color: #0A6675CC;
    display: inline-block;
    border-radius: 50%;
    box-shadow: #000 0 -1px 7px 1px, inset #006 0 -1px 9px, #06F 0 2px 14px;
  }

</style>

<style>
  .v--modal-overlay {
    background: #fff3;
  }
</style>
