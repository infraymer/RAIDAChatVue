<template>
  <div>
    <input type="text" class="inputPane" placeholder="User login" v-model="userLogin" />
     add in {{displayName(item)}}
    <input type="button" class="button" value="Add user" @click="AddUserInDialog"/>
  </div>
</template>


<script>
  import util from '../../utils'
  import { actions } from '../../store'
  import { socketAPI } from '../../store'

  export default {
    name: 'AddUser',
    props: ['onHideDialogPane', 'item'],
    data(){
      return{
        userLogin: '',
      }
    },
    methods:{
      AddUserInDialog(){
        let obj = {
          execFun: socketAPI.AddUserInDialog,
          data: {
            memberLogin: this.userLogin,
            groupId: this.item.id,
            transactionId: util.GUID()
          }
        }
        if(obj.data.memberLogin.length < 1){
          this.$toast.error({
            title: 'Information is not correct',
            message:'User login should not be empty'
          });
          return;
        }
        actions.showSpinner(true);
        this.$store.state.buffers.userindialog = [];
        actions.sendMessage(obj);
        this.onHideDialogPane();
      },
      displayName(item){
        console.log(item)
        return item.user.name.length > 36 ? item.user.name.substring(0, 36) + '...' : item.user.name;
      }
    }
  }
</script>

<style lang="less" scoped>
  .inputPane{
    width: 25% !important;
  }
</style>
