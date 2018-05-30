import Vue from 'vue';
import Vuex from 'vuex';
import Spinner from './components/Modal/ModalSpinner.vue'
import App from './main'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {

    user: {
      name: 'coffce1',
      login: 'login',
      img: '/static/img/defaultPic.jpg',
      auth: true
    },

    sessions: [
      {
        id: 1,
        user: {
          name: 'Name1',
          img: '/static/img/logo.png'
        },
        p2p: false,
        newCountMsg: 2,
        locked: true,
        messages: [
          {
            content: 'Hello，这是一个基于Vue + Vuex + Webpack构建的简单chat示例，聊天记录保存在localStorge, 有什么问题可以通过Github Issue问我。',
            date: 1585178427
          }, {
            content: '项目地址: https://github.com/coffcer/vue-chat',
            date: 0
          }
        ],
        members: []
      },
      {
        id: 2,
        user: {
          name: 'webpack',
          img: 'dist/images/3.jpg'
        },
        messages: []
      }
    ],
    currentSessionId: undefined,
    filterKey: '',
    servers: [],
    users: [
      {
        login: '',
        name: '',
        img: '',
        online: false
      }],
    buffers: {
      tmp: [],
      auth: [],
      reg: [],
      msgs: [],
      newdialog: [],
      userindialog: [],
      newmsg: {tmp:[], parts:[]},
      lock: [],
      users: [],
      changedInfo: []
    }
  },
  mutations: {
    SEND_MESSAGE ({ servers }, content) {
      servers.filter(serv => serv.status === true).forEach(function(ws){
        ws.socket.sendmessage(content);
      });
    },

    SEND_DIF_MESSAGE({servers}, content){
      let servs = servers.filter(serv => serv.status === true);

      if(servs.length < content.length){
        console.log('Error send_dif_message')
        return;
      };
      console.log(content)
      for(var i=0; i < content.length; i++){
        servs[i].socket.sendmessage(content[i])
      }
    },

    SELECT_SESSION (state, id) {
      state.currentSessionId = id;
      state.sessions.find(it => it.id === id).newCountMsg = 0;
    },

    ADD_UNREAD_MESSAGE({sessions}, id){
      sessions.find(it => it.id === id).newCountMsg += 1;
      new Audio("/static/misc/msg.wav").play()
    },

    SET_FILTER_KEY (state, value) {
      state.filterKey = value.toLowerCase();
    },
  }
});

export default store;
export const socketAPI = {
  Registration : 'registration',
  Auth: 'authorization',
  GetDialogs: 'getdialogs',
  GetMsg: 'getmsg',
  NewDialog: 'createdialog',
  AddUserInDialog: 'addmemberingroup',
  SendMessage: 'sendmsg',
  SetPrivateDialog: 'setdialogprivate',
  GetUsersInfo: 'getusersinfo',
  ChangeUserInfo: 'changeuserinfo'
}
export const actions = {
  sendMessage (content) { store.commit('SEND_MESSAGE', content) },
  sendDifMessage (content) { store.commit('SEND_DIF_MESSAGE', content) },
  selectSession (id) { store.commit('SELECT_SESSION', id)},
  search (value) { store.commit('SET_FILTER_KEY', value)},
  addunreadmsg(id){store.commit('ADD_UNREAD_MESSAGE', id)},
  showSpinner(show){
    console.log(App.countServ)
    if(show && App.countServ > 0){
      console.log('show modal')
      App.$modal.show(Spinner, null, {
        classes: '',
        name: 'modalspinner',
        clickToClose: false
      })
    }else{
      console.log('hide modal')
      App.$modal.hide('modalspinner')
    }
  }
}

export const typePane = {
  NewDialog: {
    id: 0,
    info: {}
  },
  AddUser: {
    id: 1,
    info:{ }
  }
}
