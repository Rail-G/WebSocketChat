import Chat from './chat';
const obj = new Chat();
import WSConnection from './wsConnect';
const ws = new WSConnection(obj);
obj.init(ws);
import Registration from './register';
const reg = new Registration(ws);

reg.init();
