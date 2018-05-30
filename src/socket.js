import Vue from './main'

function ws (addr) {
    this.status = false,

    this.socket = new WebSocket(addr);

    this.socket.onopen = () => {
      console.log('connected');
      this.status = true
    }

    this.socket.onclose = () =>{
      console.log('disconnected');
      this.status = false
    }

    this.socket.onmessage = (msg) =>{
      console.log('Получено: ' + msg.data);
      var data = JSON.parse(msg.data);
      Vue.$store.state.buffers.tmp.push(data)
    }

    this.socket.sendmessage = (msg) => {
      console.log('send: ' + JSON.stringify(msg));
      this.socket.send(JSON.stringify(msg));
    }
}

export default ws
