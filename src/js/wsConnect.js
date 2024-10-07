export default class WSConnection {
  constructor(obj) {
    this.ws;
    this.messages = [];
    this.nickName;
    this.chat = obj;
  }

  connect() {
    this.ws = new WebSocket('wss://websocketserver-n1ek.onrender.com');
    this.ws.addEventListener('open', () => {
      this.ws.send(
        JSON.stringify({
          userName: this.nickName,
          roomId: 1,
          roomName: 'Мафиози',
          event: 'login',
        }),
      );
    });
    this.getMessage();
  }

  async addRegisteration(nickName) {
    const data = await fetch(
      'https://websocketserver-n1ek.onrender.com/registration',
      {
        method: 'POST',
        body: JSON.stringify({nickName: nickName}),
      },
    ).then((result) => result.json());
    if (data.status != 'OK') {
      this.showError();
      return false;
    }
    this.nickName = nickName;
    this.connect();
    return true;
  }

  getMessage() {
    this.ws.addEventListener('message', (message) => {
      const msg = JSON.parse(message.data);
      if (msg.users) {
        msg.users.forEach((user) => this.chat.addNewUser(user));
      }
      if (msg.event == 'login') {
        this.chat.addInfoMessage(`${msg.userName} зашел в чат ${msg.roomName}`);
        this.chat.addNewUser(msg.userName, msg.count);
      } else if (msg.event == 'close') {
        this.chat.addInfoMessage(`${msg.userName} покинул чат.`);
        this.chat.deleteUser(msg.userName, msg.count);
      } else {
        this.chat.addNewMessage(msg.userName, msg.date, msg.content, msg.myMsg);
      }
    });
  }

  sendToServer(msg) {
    const date = new Date();
    this.ws.send(
      JSON.stringify({
        userName: this.nickName,
        date: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
        content: msg,
      }),
    );
  }

  showError() {
    const input = document
      .querySelector('.register-mask')
      .querySelector('input');
    input.classList.add('error');
  }
}
