import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SocketIoService } from './socket-io.service';
import { Message } from './mesage';
import { Subscription } from 'rxjs';
import { MatList, MatListItem } from '@angular/material/list';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
    title = 'client';

    nickname: string = '';
    message: string = '';
    messages: Message[] = [];
    private subscriptionMessages!: Subscription;
    private subscriptionList!: Subscription;
    @ViewChild(MatList, { read: ElementRef, static: true }) list!: ElementRef;
    @ViewChildren(MatListItem) listItems!: QueryList<MatListItem>;
    constructor(
        private socketIoService: SocketIoService
    ) {

    }

    ngOnInit(): void {
        this.subscriptionMessages = this.socketIoService.messages()
            .subscribe({
                next: (r: Message) => {
                    console.log(r);
                    this.messages.push(r);
                }
            });
    }

    ngAfterViewInit(): void {
        this.subscriptionList = this.listItems.changes.subscribe({
            next: (e) => {
                this.list.nativeElement.scrollTop = this.list.nativeElement.scrollHeight;
            }
        });
    }

    send(): void {
        this.socketIoService.send({ from: this.nickname, message: this.message });
        this.message = '';
    }

    ngOnDestroy(): void {
        this.subscriptionMessages.unsubscribe();
        this.subscriptionList.unsubscribe();
    }
}
