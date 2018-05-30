<template>
    <div class="pane">
      <new-dialog v-if="ftype.id === 0" :onHideDialogPane="onHideInfoPane" ></new-dialog>
      <add-user v-else-if="ftype.id === 1" :onHideDialogPane="onHideInfoPane" :item="ftype.info" ></add-user>
      <img src="/static/img/close.png" class="pane-close" @click="onHideInfoPane" title="close"/>
      <!--<img src="/static/img/wclose.png" class="pane-close" @click="onHideInfoPane" title="close"/>-->
    </div>
</template>

<script>
  import NewDialog from './NewDialogPane.vue'
  import AddUser from './AddUserPane.vue'

  export default {
    name: 'InfoPane',
    components: { NewDialog, AddUser },
    props:['onHideInfoPane', 'type'],
    data(){
      return{
        ftype: this.type
      }
    },
    created(){
     // console.log('go')
    }
  }

</script>

<style lang="less">
  .pane{
    background: #2e3238;
    color: #ccc;
    position: absolute;
    width: 100%;
    z-index: 100;
  }
  .inputPane {
    padding: 0 10px;
    margin: 5px;
    /*margin-left: 20px;*/
    width: 60%;
    font-size: 12px;
    color: #fff;
    height: 30px;
    line-height: 30px;
    border: solid 1px #929296;
    /*border: solid 1px #3a3a3a;*/
    border-radius: 4px;
    outline: none;
    /*background-color: #26292E;*/
    /*background-color: #52627E;*/
    background-color: #43474C;

  }

  .pane-close {
    /*float: right;*/
    margin: 5px;
    height: 10px;
    position: absolute;
    top: 0;
    right: 0;
    background-color: #ccc;
    padding: 2px;
    border-radius: 5px;
    &:hover{
      cursor: pointer;
      height: 12px;
    }
  }

  .button{
    background:#416081;
    /*margin-left: 13px;*/
    color:#fff;
    border:none;
    padding: 2px 10px;
    border-radius:4px;
    float: right;
    margin: 9px 30px 0px 0px;
    &:hover{
      cursor: pointer;
      opacity: 0.9;
     }
  }

  .check{
    display: none;
  }
  .check:checked + label{
    color:#fff;
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
    width:15px;
    height:15px;
    border-radius:2px;
    position:relative;
    display:inline-block;
    background:rgba(255,255,255,.1);
    margin-right: 5px;
    margin-bottom: -2px;
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
</style>
