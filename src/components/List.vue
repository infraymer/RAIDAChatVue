<template>
  <div class="list">
    <ul>
      <li v-for="item in sessions" :class="{ active: item.id === currentId }" @click="selectSession(item.id)">
        <img src="/static/img/addUser.png" height="10" class="addUser" title="Add user in dialog" @click="onAddUser($event, item)" v-if="!item.p2p && !item.locked"/>

        <img v-if="!item.locked && !item.p2p" src="/static/img/unlock.png" height="10" class="locker" title="Lock the dialog" @click="setPrivate($event, item, true)" />
        <img  src="/static/img/lock.png" height="10" class="locker" title="Unlock the dialog" v-else-if="!item.p2p" @click="setPrivate($event, item, false)" />

        <span class="badge" v-if="item.newCountMsg > 0" :data-badge="item.newCountMsg"></span>
        <img class="avatar"  width="30" height="30" :alt="item.user.name" :src="item.user.img" @click="showMembers($event, item)">
        <span class="name" :title="item.user.name">{{displayName(item)}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import {actions} from '../store'
  import {typePane} from '../store'
  import {socketAPI} from '../store'
  import usersList from './Modal/ModalListUser.vue'

  export default {
    props: ['onShowInfoPane'],
    data(){
      return {
      }
    },
    computed:{
      sessions(){
        return this.$store.state.sessions.filter(session => session.user.name.toLowerCase().includes(this.$store.state.filterKey))
                                          .sort(function (a, b) {
                                            if (a.user.name.toLowerCase() > b.user.name.toLowerCase()) {
                                              return 1;
                                            }
                                            if (a.user.name.toLowerCase() < b.user.name.toLowerCase()) {
                                              return -1;
                                            }
                                            return 0;
                                          })
      },
      currentId(){
        return this.$store.state.currentSessionId;
      },
    },
    methods:{
      selectSession(id){
        actions.selectSession(id);
      },
      onAddUser(event, item){
        event.stopPropagation();
        let ftype = typePane.AddUser;
        ftype.info = item;
        this.onShowInfoPane(ftype);
      },
      displayName(item){
        return item.user.name.length > 30 ? item.user.name.substring(0, 30) + '...' : item.user.name;
      },
      setPrivate(event, item, val){
        event.stopPropagation();
        actions.showSpinner(true);
        var obj = {
          execFun: socketAPI.SetPrivateDialog,
          data: {
            publicId: item.id,
            privated: val
          }
        }
        this.$store.state.buffers.lock = [];
        console.log(obj)
        actions.sendMessage(obj)
      },
      showMembers(event, item){
        event.stopPropagation();
        //if(!item.p2p){
          this.$modal.show(usersList, {
            users: this.$store.state.users.filter(it => item.members.includes(it.login)),
            dialogName: item.user.name
          }, {
            width: 300,
            height: 'auto'
          })
        //}
      }
    }
  };
</script>

<style scoped lang="less">
  .list {
    ul{
      height: 595px;
      overflow-y: auto;
    }

    li {
      position: relative;
      padding: 12px 15px;
      border-bottom: 1px solid #292C33;
      cursor: pointer;
      transition: background-color .1s;
      &:hover {
        background-color: rgba(255, 255, 255, 0.03);
      }
      &.active {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .addUser{
        float: right;
        opacity: 0.6;
        &:hover{
          opacity: 1;
          transform: scale(1.5);
        }
      }
      .locker{
        float: right;
        opacity: 0.6;
        position: absolute;
        right: 16px;
        top: 28px;
        &:hover{
          opacity: 1;
          transform: scale(1.5);
        }
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
      display: inline-block;
      margin: -5px 0 0 5px;
      width: 135px;
      word-wrap: break-word;
    }

    .badge {
      position:relative;
      float: left;
    }
    .badge[data-badge]:after {
      content:attr(data-badge);
      position:absolute;
      top:-10px;
      right:-10px;
      font-size:.7em;
      background:green;
      color:white;
      width:18px;height:18px;
      text-align:center;
      line-height:18px;
      border-radius:50%;
      box-shadow:0 0 1px #333;
    }
  }
</style>
