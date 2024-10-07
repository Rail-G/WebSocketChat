/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/js/chat.js
class Chat {
  constructor() {
    this.input = document.querySelector('#message');
    this.messagesBlock = document.querySelector('.messages');
    this.usersBlock = document.querySelector('.chat-users');
    this.registerMask = document.querySelector('.register-mask');
    this.usersCount = document.querySelector('.user-count p span');
  }
  init(ws) {
    this.input.addEventListener('keyup', e => {
      if (e.code == 'Enter' && this.input.value != '') {
        const message = this.input.value;
        this.input.value = '';
        ws.sendToServer(message);
      }
    });
  }
  static htmlAddMessage(autor, data, msg, myMsg = false) {
    let text = '';
    if (myMsg) {
      text = 'my-message';
    }
    console.log(myMsg);
    return `
        <div class="message ${text}">
            <div class="send-user-info">${autor} ${data}</div>
            <div class="message-text">${msg}</div>
        </div>
        `;
  }
  static htmlAddInfoMessage(message) {
    return `
        <div class="info-message">
            <span>${message}</span>
        </div>
        `;
  }
  static htmlAddClient(nickName) {
    return `
        <div class="user">
            <div class="user-profile-photo"></div>
            <div class="user-nickname">${nickName}</div>
        </div>
        `;
  }
  addNewMessage(nickName, data, message, myMsg) {
    const result = Chat.htmlAddMessage(nickName, data, message, myMsg);
    this.messagesBlock.insertAdjacentHTML('beforeend', result);
    document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight;
  }
  addInfoMessage(message) {
    const result = Chat.htmlAddInfoMessage(message);
    this.messagesBlock.insertAdjacentHTML('beforeend', result);
    document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight;
  }
  addNewUser(nickname, count = 0) {
    if (count) {
      this.usersCount.textContent = count;
    }
    const result = Chat.htmlAddClient(nickname);
    this.usersBlock.insertAdjacentHTML('beforeend', result);
    document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight;
  }
  deleteUser(nickname, count = 0) {
    if (count) {
      this.usersCount.textContent = count;
    }
    const allUser = this.usersBlock.querySelectorAll('.user-nickname');
    const user = [...allUser].find(elem => elem.textContent === nickname);
    user.closest('div.user').remove();
  }
  addRegisteration(nickName) {
    this.nickName = nickName;
  }
}
;// ./src/js/wsConnect.js
class WSConnection {
  constructor(obj) {
    this.ws;
    this.messages = [];
    this.nickName;
    this.chat = obj;
  }
  connect() {
    this.ws = new WebSocket('wss://websocketserver-n1ek.onrender.com');
    this.ws.addEventListener('open', () => {
      this.ws.send(JSON.stringify({
        userName: this.nickName,
        roomId: 1,
        roomName: 'Мафиози',
        event: 'login'
      }));
    });
    this.getMessage();
  }
  async addRegisteration(nickName) {
    const data = await fetch('https://websocketserver-n1ek.onrender.com/registration', {
      method: 'POST',
      body: JSON.stringify({
        nickName: nickName
      })
    }).then(result => result.json());
    if (data.status != 'OK') {
      this.showError();
      return false;
    }
    this.nickName = nickName;
    this.connect();
    return true;
  }
  getMessage() {
    this.ws.addEventListener('message', message => {
      const msg = JSON.parse(message.data);
      if (msg.users) {
        msg.users.forEach(user => this.chat.addNewUser(user));
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
    this.ws.send(JSON.stringify({
      userName: this.nickName,
      date: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
      content: msg
    }));
  }
  showError() {
    const input = document.querySelector('.register-mask').querySelector('input');
    input.classList.add('error');
  }
}
;// ./src/js/register.js
class Registration {
  constructor(ws) {
    this.nickName;
    this.registerBlock = document.querySelector('.register-mask');
    this.btn = this.registerBlock.querySelector('button');
    this.ws = ws;
  }
  init() {
    this.btn.addEventListener('click', this.createNewUser.bind(this));
  }
  async createNewUser(e) {
    e.preventDefault();
    const chatBlock = document.querySelector('.chat-window');
    const text = chatBlock.querySelector('.nickname-input input').value;
    if (!text) {
      return;
    }
    const bool = await this.ws.addRegisteration(text);
    if (bool) {
      this.registerBlock.remove();
    }
  }
}
;// ./src/js/app.js

const obj = new Chat();

const ws = new WSConnection(obj);
obj.init(ws);

const reg = new Registration(ws);
reg.init();
;// ./src/index.js


/******/ })()
;