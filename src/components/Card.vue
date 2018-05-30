<template>
  <div class="card">
    <header>
      <img height="10" class="logout" title="LogOut" @click="onLogOut" src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzIwMCcgd2lkdGg9JzIwMCcgIGZpbGw9IiNmZmZmZmYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjQgMjQiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwb2x5Z29uIHBvaW50cz0iMjQsMTIgMTUuOTk5LDQuMDAxIDE1Ljk5OSw4IDcuOTk5LDggNy45OTksMTYgMTUuOTk5LDE2IDE1Ljk5OSwyMCAgIj48L3BvbHlnb24+PHBhdGggZD0iTTYsMjJoNWMwLjU1MiwwLDEtMC40NDgsMS0xYzAtMC41NTMtMC40NDgtMS0xLTFINmMtMS4xMDMsMC0yLTAuODk3LTItMlY2YzAtMS4xMDMsMC44OTctMiwyLTJoNWMwLjU1MiwwLDEtMC40NDcsMS0xICAgcy0wLjQ0OC0xLTEtMUg2QzMuOCwyLDIsMy44LDIsNnYxMkMyLDIwLjIsMy44LDIyLDYsMjJ6Ij48L3BhdGg+PC9nPjwvc3ZnPg==">
      <img class="avatar" width="40" height="40" :alt="user.name" v-bind:src="user.img" @click="onMyInfo" title="About me">
      <p class="name">{{user.name | len}}</p>
    </header>
    <footer>
      <input class="search" type="text" placeholder="search dialog..." @keyup="onKeyup">
      <img src="/static/img/addDialog.png" class="newDialog" title="New dialog" @click="onShowPane" >
    </footer>
  </div>
</template>

<script>
  import {actions} from '../store'
  import {typePane} from '../store'
  import userInfo from './Modal/ModalMyInfo.vue'

  export default {
    name:'Card',
    props: ['onShowInfoPane'],
    data(){
      return{
        user: this.$store.state.user,
        filterKey: this.$store.state.filterKey,
        pane: this.paneInfo
      }
    },
    methods: {
      onKeyup (e) {
        actions.search(e.target.value);
      },

      onShowPane(){

        this.onShowInfoPane(typePane.NewDialog);
      },

      onLogOut(){
        location.reload(true);
      },
      onMyInfo(){
        this.$modal.show(userInfo, {
          /*users: this.$store.state.users.filter(it => item.members.includes(it.login)),
          dialogName: item.user.name*/
        }, {
          width: 500,
          height: 470,
          draggable: true,
          clickToClose: false
        })
      }
    },
    filters: {
      len(val){
        return val.length > 32 ? val.substring(0, 32) + '...' : val;
      }
    }
  };
</script>

<style scoped lang="less">
  .card {
    padding: 12px;
    border-bottom: solid 1px #24272C;
    footer {
      margin-top: 10px;
    }
    .avatar, .name {
      vertical-align: middle;
    }
    .avatar {
      border-radius: 2px;
      background-color: #fff;
      &:hover{
        cursor: pointer;
      }
    }
    .name {
      display: inline-block;
      margin: 0 0 0 5px;
      font-size: 16px;
      word-wrap: break-word;
      width: 140px;
    }
    .search {
      padding: 0 10px;
      width: 82%;
      font-size: 12px;
      color: #fff;
      height: 30px;
      line-height: 30px;
      border: solid 1px #3a3a3a;
      border-radius: 4px;
      outline: none;
      background-color: #26292E;
    }
    .newDialog{
      width: 15%;
      height: 24px;
      margin-bottom: -6px;
      &:hover{
        cursor: pointer;
      }
    }

    header{
      position: relative;
      .logout{
        position: absolute;
        right: 0px;
        opacity: 0.7;
        &:hover{
          cursor: pointer;
          opacity: 1 !important;
          transform: scale(1.5);
        }
      }
    }
  }
</style>
