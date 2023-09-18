import { Injectable } from '@angular/core';
import { io } from "socket.io-client";
import { Message } from './mesage';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SocketIoService {
    private readonly url = 'http://localhost:4444';
    private socket = io(this.url);
    private subjectMessages: Subject<Message> = new Subject<Message>();

    constructor() {
        this.socket.on('message', (m: Message) => {
            this.subjectMessages.next(m);
        });
    }

    send(msg: Message) {
        this.socket.emit('message', msg);
    }

    messages() {
        return this.subjectMessages.asObservable();
    }
}
