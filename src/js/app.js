import Chat from './chat';
const chat = new Chat();
import WSConnection from './wsConnect';
const ws = new WSConnection(chat);
import Registration from './register';
const reg = new Registration(ws, chat);

reg.init();
