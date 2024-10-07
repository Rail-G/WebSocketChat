export default class Registration {
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
