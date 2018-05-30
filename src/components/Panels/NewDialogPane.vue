<template>
  <div>
    <input id="check" type="checkbox" class="check" v-model="tmpCheck">
    <label for="check"><span class="icon"></span>Private</label>

    <input v-if="p2p" type="text" class="inputPane" placeholder="Login of user" v-model="dialogLogin" key="input-user"/>
    <input v-else type="text" class="inputPane" placeholder="Name of dialog" v-model="dialogName" key="input-dialog"/>


    <input type="button" class="button" value="Create" @click="createDialog"/>

  </div>
</template>

<script>
  import util from '../../utils'
  import { actions } from '../../store'
  import { socketAPI } from '../../store'

  export default {
    name: 'NewDialog',
    props: ['onHideDialogPane'],
    data(){
      return{
        dialogName: '',
        dialogLogin: '',
        tmpCheck: false
      }
    },
    computed:{
      p2p(){
        return this.tmpCheck;
      }
    },
    methods:{
      createDialog(){
        let obj = {
          execFun: socketAPI.NewDialog,
          data: {
            name: this.p2p ? this.dialogLogin : this.dialogName,
            publicId: util.GUID(),
            oneToOne: this.p2p,
            transactionId: util.GUID()
          }
        }
        console.log(obj);
        if(obj.data.name.length < 1){
          this.$toast.error({
            title: 'Information is not correct',
            message:'Name of dialog or user login should not be empty'
          });
          return;
        }
        actions.showSpinner(true);
        this.$store.state.buffers.newdialog = [];
        actions.sendMessage(obj);
        this.onHideDialogPane();
      }
    }
  }
</script>

<style>

</style>
