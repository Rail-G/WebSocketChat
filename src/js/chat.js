export default class Chat {
  constructor() {
    this.inputForm = document.querySelector('.message-input form');
    this.input = document.querySelector('#message');
    this.messagesBlock = document.querySelector('.messages');
    this.usersBlock = document.querySelector('.chat-users');
    this.registerMask = document.querySelector('.register-mask');
    this.usersCount = document.querySelector('.user-count p span');
  }

  init(ws) {
    this.inputForm.addEventListener('submit', (e) => {
      e.preventDefault()
      if (this.input.value != '') {
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
      autor = 'You'
    }
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
    document.querySelector('.messages').scrollTop =
      document.querySelector('.messages').scrollHeight;
  }

  addInfoMessage(message) {
    const result = Chat.htmlAddInfoMessage(message);
    this.messagesBlock.insertAdjacentHTML('beforeend', result);
    document.querySelector('.messages').scrollTop =
      document.querySelector('.messages').scrollHeight;
  }

  addNewUser(nickname, count = 0) {
    if (count) {
      this.usersCount.textContent = count;
    }
    const result = Chat.htmlAddClient(nickname);
    this.usersBlock.insertAdjacentHTML('beforeend', result);
    document.querySelector('.messages').scrollTop =
      document.querySelector('.messages').scrollHeight;
  }

  deleteUser(nickname, count = 0) {
    if (count) {
      this.usersCount.textContent = count;
    }
    const allUser = this.usersBlock.querySelectorAll('.user-nickname');
    const user = [...allUser].find((elem) => elem.textContent === nickname);
    user.closest('div.user').remove();
  }

  addRegisteration(nickName) {
    this.nickName = nickName;
  }
}
