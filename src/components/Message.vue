<template>
  <div class="message" v-scroll_bottom="session.messages">
    <ul v-if="session">
      <li v-for="item in session.messages">
        <div class="main" :class="{ self: item.self }">
          <p class="time">
            <!--<span v-if="!item.self">{{ item.name }}</span>-->
            <span v-if="!item.self">{{name(item)}}</span>
            <span>{{ item.date | time }}</span>
          </p>
          <!--<img class="avatar" width="30" height="30" :src="item.self ? $store.state.user.img : session.user.img" />-->
          <img class="avatar" width="30" height="30" :src="photo(item)" />
          <div class="text">
            {{ item.content }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    computed:{
      session(){
        let ses = this.$store.state.sessions.find(session => session.id === this.$store.state.currentSessionId);
        return ses != undefined ? ses : -1;
      }
    },
    filters: {
      time (date) {
        if(date.toString().length === 10) {
          var date = new Date(date * 1000);
          let day = "0" + date.getDate();
          let mon = "0" + (date.getMonth()+1);
          let year = "0" + date.getFullYear();

          var hours = "0" + date.getHours();
          var minutes = "0" + date.getMinutes();
          var seconds = "0" + date.getSeconds();

          var formattedTime = day.substr(-2) + '.' + mon.substr(-2) + '.' + year.substr(-2) + ' ' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
          return formattedTime;
        }
      }
    },
    methods:{
      name(item){
        console.log(item)
        return this.$store.state.users.find(user => user.login === item.login).name;
      },
      photo(item){
        return this.$store.state.users.find(user => user.login === item.login).img;
      }
    },
    directives: {
      scroll_bottom: {
        componentUpdated: function(el) {
            el.scrollTop = el.scrollHeight - el.clientHeight;
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .message {
    padding: 10px 15px;
    overflow-y: scroll;
    li {
      margin-bottom: 15px;
    }
    .time {
      margin: 7px 0;
     /* text-align: center;*/
      > span {
        display: inline-block;
        padding: 0 5px;
        font-size: 12px;
        color: #416081;
        border-radius: 2px;
        background-color: #ddd;
      }
    }
    .avatar {
      float: left;
      margin: 0 10px 0 0;
      border-radius: 3px;
      background-color: #fff;
    }
    .text {
      display: inline-block;
      position: relative;
      padding: 0 10px;
      max-width: ~'calc(100% - 40px)';
      min-height: 30px;
      line-height: 2.5;
      font-size: 12px;
      text-align: left;
      word-break: break-all;
      background-color: #fafafa;
      border-radius: 4px;
      &:before {
        content: " ";
        position: absolute;
        top: 9px;
        right: 100%;
        border: 6px solid transparent;
        border-right-color: #fafafa;
      }
    }
    .self {
      text-align: right;
      .avatar {
        float: right;
        margin: 0 0 0 10px;
      }
      .text {
        background-color: #b2e281;
        &:before {
          right: inherit;
          left: 100%;
          border-right-color: transparent;
          border-left-color: #b2e281;
        }
      }
    }
  }
</style>
