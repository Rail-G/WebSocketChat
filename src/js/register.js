export default class Registration {
  constructor(ws, chat) {
    this.nickName;
    this.registerBlock = document.querySelector('.register-mask');
    this.btn = this.registerBlock.querySelector('button');
    this.ws = ws;
    this.chat = chat;
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
    const bool = await this.addRegisteration(text);
    if (bool) {
      this.registerBlock.remove();
      this.chat.init(this.ws)
    }
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
      this.ws.showError();
      return false;
    }
    this.ws.connect(nickName);
    return true;
  }
}
