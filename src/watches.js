import store, {actions} from './store'
import {socketAPI} from './store'
import App from './main'
import utils from './utils'

/*Observing the get response from server*/
store.watch(
  (state) => state.buffers.tmp,
  (val) => {
    console.log('All watch: ', val)
    if(val.length > 0) {

      let data = val.pop();
      console.log(data.callFunction)
      store.state.buffers.tmp.pop()
      switch (data.callFunction.toLowerCase()) {
        case socketAPI.Auth:
          store.state.buffers.auth.push(data)
          break;

        case socketAPI.Registration:
          store.state.buffers.reg.push(data)
          break;

        case socketAPI.GetMsg:
          store.state.buffers.msgs.push(data);
          break;

        case socketAPI.NewDialog:
          store.state.buffers.newdialog.push(data);
          break;

        case socketAPI.SetPrivateDialog:
          store.state.buffers.lock.push(data);
          break;

        case socketAPI.AddUserInDialog:
          store.state.buffers.userindialog.push(data);
          break;

        case socketAPI.SendMessage:
          store.state.buffers.newmsg.tmp.push(data);
          break;

        case socketAPI.GetUsersInfo:
          store.state.buffers.users.push(data);
          break;

        case socketAPI.ChangeUserInfo:
          store.state.buffers.changedInfo.push(data);
          break;

        default:
          App.$toast.warn({
            title: 'Unknown action',
            message: data.msgError
          })
          break;
      }
    }
  },
  {
    deep: false
  }
);

/*Event when get message 'Authorization'*/
store.watch(
  (state) => state.buffers.auth,
  (val) =>{
    console.log('change auth: ' + val.length);
    if(val.length >= App.countServ){
      actions.showSpinner(false);
      if(val.length < 1) {
        App.$toast.error({
          title: 'Connection error',
          message: 'Servers is not connected'
        });

        return;
      }

      var error = val.findIndex(el => el.success == false);
      if(error > -1){
        App.$toast.error({
          title: 'Authorization error',
          message: val[error].msgError
        });
        console.log('One or more servers return status="FALSE"');
        return;
      }
      let data = utils.unionArrayObj(val).data;
      console.log('DATA:', data)
      App.$toast.success({
        title: 'Authorization completed',
        message: 'Hello ' + data.nickName
      })
      store.state.user.name = data.nickName;
      store.state.user.auth = true;
      store.state.user.img = data.img.length > 0 ? data.img : '/static/img/defaultPic.jpg';
      store.state.user.login = data.login;
    }
  },
  {
    deep: true
  }
);

/*Event when get message 'Registration'*/
store.watch(
  (state) => state.buffers.reg,
  (val) =>{
    console.log('change req: ' + val.length);
    if(val.length >= App.countServ){
      actions.showSpinner(false);
      if(val.length < 1) {
        App.$toast.error({
          title: 'Connection error',
          message: 'Servers is not connected'
        });
        return;
      }

      var error = val.findIndex(el => el.success == false);
      if(error > -1){
        App.$toast.error({
          title: 'Registration error',
          message: val[error].msgError
        })
        return;
      }

      App.$toast.success({
        title: 'Registration completed',
        message: 'You can sign in'
      });
    }
  },
  {
    deep: true
  }
);

/*Event when get message 'GetUsersInfo'*/
store.watch(
  (state) => state.buffers.users,
  (val) =>{
    console.log('get users: ' + val.length);
    if(val.length >= App.countServ){
      if(val.length < 1) {
        return;
      }

      var error = val.findIndex(el => el.success == false);
      if(error > -1){
        return;
      }

      let data = utils.unionArrayObj(val).data;
      for(let i in data){
	    if(store.state.users.findIndex(it=>it.login === data[i].login) < 0){
		  let us = {
            login: data[i].login,
            name: data[i].nickName,
            img: data[i].photo.length === 0 ? '/static/img/defaultPic.jpg' : data[i].photo,
            online: data[i].online
          }
          store.state.users.push(us);
		}
      }
    }
  },
  {
    deep: true
  }
);

/*Event when get message 'NewDialog'*/
store.watch(
  (state) => state.buffers.newdialog,
  (val) =>{
    console.log('new dialog watcher: ' + val.length);
    if(val.length >= App.countServ){
      actions.showSpinner(false);
      if(val.length < 1) {
        App.$toast.error({
          title: 'Connection error',
          message: 'Servers is not connected'
        });
        return;
      }

      var error = val.findIndex(el => el.success == false);
      if(error > -1){
        App.$toast.error({
          title: 'Dialog does not created',
          message: val[error].msgError
        })
        return;
      }

      let data = utils.unionArrayObj(val).data;

      App.$toast.success({
        title: 'Success',
        message: 'Dialog created successfully'
      });
      console.log(data);
      let session = {
        id: data.id,
        p2p: data.oneToOne,
        user: {
          name: data.name,
          img: '/static/img/dialog.png'
        },
        messages: [],
        locked: false,
        members: [store.state.user.login]
      }
      store.state.sessions.push(session);
      store.state.currentSessionId = data.id;
    }
  },
  {
    deep: true
  }
);

/*Event when get message 'SetDialogPrivate'*/
store.watch(
  (state) => state.buffers.lock,
  (val) =>{
    if(val.length >= App.countServ){
      actions.showSpinner(false);
      if(val.length < 1) {
        App.$toast.error({
          title: 'Connection error',
          message: 'Servers is not connected'
        });
        return;
      }

      var error = val.findIndex(el => el.success == false);
      if(error > -1){
        App.$toast.error({
          title: 'Error of change the status',
          message: val[error].msgError
        })
		store.state.buffers.lock = []
        return;
      }

      let data = utils.unionArrayObj(val).data;

      console.log(data.privated, data.privated===true)
      let text = "Dialog is " + (data.privated===true ? 'lock' : 'unlock');
      console.log(text)
      App.$toast.success({
        title: 'Success',
        message: text
      });

      store.state.sessions.find(session => session.id === data.dialogId).locked = data.privated;
	  store.state.buffers.lock = [];
    }
  },
  {
    deep: true
  }
);

/*Event when get message 'AddUserInDialog'*/
store.watch(
  (state) => state.buffers.userindialog,
  (val) =>{
    if(val.length >= App.countServ){
      actions.showSpinner(false);
      if(val.length < 1) {
        App.$toast.error({
          title: 'Connection error',
          message: 'Servers is not connected'
        });
        return;
      }

      var error = val.findIndex(el => el.success == false);
      if(error > -1){
        App.$toast.error({
          title: 'Error',
          message: val[error].msgError
        })
        return;
      }

      let data = utils.unionArrayObj(val).data;


      if(data.itself === true){
        App.$toast.success({
          title: 'Success',
          message: 'User added in dialog'
        });
        store.state.sessions.find(session => session.id === data.groupId).members.push(data.newUser.login);
      }else{
        if(store.state.sessions.find(session => session.id === data.id) === undefined){
          let obj = {
            execFun: socketAPI.GetUsersInfo,
            data: {}
          };
          store.state.buffers.users = [];
          store.state.users = [];
          actions.sendMessage(obj);
          let dialog = {
            id: data.id,
            user: {
              name: data.name,
              img: '/static/img/dialog.png'
            },
            p2p: data.oneToOne,
            newCountMsg: 0,
            locked: data.privated,
            messages: [],
            members: data.members
          };
          store.state.sessions.push(dialog);
          App.$toast.success({
            title: 'Success',
            message: 'You added in dialog: ' + dialog.user.name
          });
        }else{
          store.state.sessions.find(session => session.id === data.id).members.push(data.newUser.login);
          App.$toast.success({
            title: 'Success',
            message: data.newUser.login + ' added in dialog: ' + data.name
          });
        }
      }

      if(store.state.users.findIndex(it=>it.login === data.newUser.login) < 0){
        let user = {
          login: data.newUser.login,
          name: data.newUser.nickName,
          img: data.newUser.photo.length === 0 ? '/static/img/defaultPic.jpg' : data.newUser.photo,
          online: data.newUser.online
        }
        store.state.users.push(user);
      }

      store.state.buffers.userindialog = [];
    }
  },
  {
    deep: true
  }
);


/*Event when get message 'getMsg'*/
store.watch(
  (state) => state.buffers.msgs,
  (val) =>{
    console.log('Get Msgs: ' + val[0]);
    if(val.length >= App.countServ){
      actions.showSpinner(false);
      if(val.length < 1) {
        App.$toast.error({
          title: 'Connection error',
          message: 'Servers is not connected'
        });
        return;
      }

      var error = val.findIndex(el => el.success == false);
      if(error > -1){
        App.$toast.error({
          title: 'Information is not load',
          message: val[error].msgError
        })
        return;
      }

      let tmpSes = [];
      val.forEach(function(resp){
        let data = resp.data;
        data.forEach(function(info){

          if(tmpSes.filter(it => it.id == info.dialogId).length === 0){
            let dialog = {
              id: info.dialogId,
              user: {
                name: info.groupName,
                img: '/static/img/dialog.png'
              },
              p2p: info.oneToOne,
              newCountMsg: 0,
              locked: info.privated,
              messages: [],
              members: info.members
            };
            tmpSes.push(dialog);
          };


          let dial = tmpSes.find(it => it.id === info.dialogId);

          if(dial != undefined){
            let index = tmpSes.indexOf(dial);
            info.messages.forEach(function(msg){
              let msgIndex = dial.messages.findIndex(it=> it.tmpID === msg.guidMsg)
              if(msgIndex < 0) {
                dial.messages.push({tmpID: msg.guidMsg, totalFrg: msg.totalFrg, curFrg: [msg.curFrg], time: [msg.sendTime], name: [msg.senderName], login: [msg.senderLogin], text: [msg.textMsg]});
              }else{
                if(dial.messages[msgIndex].curFrg.findIndex(it => it === msg.curFrg) < 0) {
                  dial.messages[msgIndex].curFrg.push(msg.curFrg);
                  dial.messages[msgIndex].time.push(msg.sendTime);
                  dial.messages[msgIndex].name.push(msg.senderName);
                  dial.messages[msgIndex].text.push(msg.textMsg);
                  dial.messages[msgIndex].login.push(msg.senderLogin);
                }
              }
            });
            tmpSes[index] = dial;
          };
        });
      });

      for(let i = 0; i < tmpSes.length; i++){
        for(let j = tmpSes[i].messages.length-1; j >= 0 ; j--){
          if(tmpSes[i].messages[j].text.length === tmpSes[i].messages[j].totalFrg){
            let textMsg = utils.unionPartMsg(tmpSes[i].messages[j].text);
            if(textMsg !== undefined){
              let newObj = {
                name : utils.unionArrayObj(tmpSes[i].messages[j].name),
                date : utils.unionArrayObj(tmpSes[i].messages[j].time),//Найти среднее
                self : utils.unionArrayObj(tmpSes[i].messages[j].login) === store.state.user.login,
                content : textMsg,
                login: utils.unionArrayObj(tmpSes[i].messages[j].login)
              }

              tmpSes[i].messages[j] = newObj;
            }else{
              tmpSes[i].messages.splice(j, 1);
            }
          }else{
            tmpSes[i].messages.splice(j, 1);
          }
        }
      }
      store.state.sessions = tmpSes;
    }
  },
  {
    deep: true
  }
);


/*Event when get message 'sendMsg'*/
store.watch(
  (state) => state.buffers.newmsg.tmp,
  (val) =>{
    console.log('Send Msgs: ', val);
    while(val.length > 0){
      let msg = val.pop();
      if(msg.success === true){
        let info = msg.data;
        let msgInfo = info.messages[0];

        if(store.state.buffers.newmsg.parts.findIndex(it => it.id === info.dialogId) < 0){
          let dialog = {
            id: info.dialogId,
            user: {
              name: info.groupName,
              img: '/static/img/dialog.png'
            },
            p2p: info.oneToOne,
            newCountMsg: 0,
            locked: info.privated,
            messages: []
          };
          store.state.buffers.newmsg.parts.push(dialog);
        }

        let dialog = store.state.buffers.newmsg.parts.find(it => it.id === info.dialogId);

        let index = store.state.buffers.newmsg.parts.indexOf(dialog);

        let msgIndex = dialog.messages.findIndex(it=> it.tmpID === msgInfo.guidMsg)
        if(msgIndex < 0) {
          dialog.messages.push({tmpID: msgInfo.guidMsg, totalFrg: msgInfo.totalFrg, curFrg: [msgInfo.curFrg], time: [msgInfo.sendTime], name: [msgInfo.senderName], login: [msgInfo.senderLogin], text: [msgInfo.textMsg]});
        }else{
          if(dialog.messages[msgIndex].curFrg.findIndex(it => it === info.curFrg) < 0) {
            dialog.messages[msgIndex].curFrg.push(msgInfo.curFrg);
            dialog.messages[msgIndex].time.push(msgInfo.sendTime);
            dialog.messages[msgIndex].name.push(msgInfo.senderName);
            dialog.messages[msgIndex].text.push(msgInfo.textMsg);
            dialog.messages[msgIndex].login.push(msgInfo.senderLogin);
          }
        }

        let ind = dialog.messages.findIndex(it => it.totalFrg === it.text.length);
        if( ind > -1){
          let textMsg = utils.unionPartMsg(dialog.messages[ind].text);
          if(textMsg !== undefined){
            let newObj = {
              name : utils.unionArrayObj(dialog.messages[ind].name),
              date : utils.unionArrayObj(dialog.messages[ind].time),
              self : utils.unionArrayObj(dialog.messages[ind].login) === store.state.user.login,
              content : textMsg,
              login: utils.unionArrayObj(dialog.messages[ind].login)
            }
            if(store.state.users.findIndex(it => it === newObj.login) < 0){
              let obj = {
                execFun: socketAPI.GetUsersInfo,
                data: {}
              };
              store.state.buffers.users = [];
              store.state.users = [];
              actions.sendMessage(obj);
            }

            dialog.messages[ind] = newObj;

            let sessionIndex = store.state.sessions.findIndex(it => it.id === dialog.id);
            if(sessionIndex < 0){
              store.state.sessions.push(JSON.parse(JSON.stringify(dialog)));
            }else{
              store.state.sessions[sessionIndex].messages.push(newObj)
            }

            if(dialog.id !== store.state.currentSessionId){
              actions.addunreadmsg(dialog.id);
            }

          }
          dialog.messages.splice(ind, 1);
        }
        store.state.buffers.newmsg.parts[index] = dialog;
      }
    }
  },
  {
    deep: true
  }
);

/*Event when get message 'ChangedUserInfo'*/
store.watch(
  (state) => state.buffers.changedInfo,
  (val) =>{
    if(val.length >= App.countServ){
      actions.showSpinner(false);
      if(val.length < 1) {
        return;
      }

      let data = utils.unionArrayObj(val);

      let itself = data.data.itself;


      if(itself === true){
        if(data.success === false){
          App.$toast.error({
            title: 'Password not changed',
            message: data.msgError
          });
        }else{
          App.$toast.success({
            title: 'Information changing',
            message: 'Successfully'
          });
        }
        store.state.user.name = data.data.user.nickName;
        store.state.user.img = data.data.user.photo.length === 0 ? '/static/img/defaultPic.jpg' : data.data.user.photo;
      }

      data = data.data.user;
      let user = store.state.users.find(user => user.login === data.login);
      if(user === undefined){
        let newUser = {
          login: data.login,
          name: data.nickName,
          img: data.photo.length === 0 ? '/static/img/defaultPic.jpg' : data.photo,
          online: data.online
        }
        store.state.users.push(newUser);
      }else{
        user.name = data.nickName;
        user.img = data.photo.length === 0 ? '/static/img/defaultPic.jpg' : data.photo;
        user.online = data.online
      }

      store.state.buffers.changedInfo = [];
    }
  },
  {
    deep: true
  }
);

export default this
