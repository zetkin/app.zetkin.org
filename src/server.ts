import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000');

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

type HTTPServerWithIO = HTTPServer & {
  io?: SocketIOServer;
};

app.prepare().then(() => {
  const httpServer = createServer(handle) as HTTPServerWithIO;

  const io = new SocketIOServer(httpServer);
  io.on('connection', (socket) => {
    socket.on('personview.addrow', (args) => {
      socket.broadcast.emit('personview.addrow', args);
    });
    socket.on('personview.deleterow', (args) => {
      socket.broadcast.emit('personview.deleterow', args);
    });
  });

  httpServer.io = io;

  httpServer.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on http://${hostname}:${port}`);
  });
});
