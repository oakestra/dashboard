import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, takeWhile, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import * as L from 'leaflet';
import { selectCurrentServices } from '../../../../root/store/selectors/service.selector';
import { IService } from '../../../../root/interfaces/service';
import { appReducer, getSingleService } from '../../../../root/store';

@Component({
    selector: 'app-instance-detail',
    templateUrl: './instance-detail.component.html',
    styleUrls: ['./instance-detail.component.scss'],
})
export class InstanceDetailComponent implements OnInit, AfterViewInit {
    @ViewChild('map', { static: false }) mapContainer: ElementRef;
    serviceId: string;
    instanceId: string;

    textLocation: string = null;
    private latitude = 48.1624064;
    private longitude = 11.5977288;
    private radius = 9;

    services$: Observable<IService[]> = this.store.pipe(select(selectCurrentServices));
    service: IService;

    private alive = true;
    private timerSubscription: Subscription;

    instance = this.store.select(selectCurrentServices).pipe(
        map((services: IService[]) => {
            const myService: IService = services.find((service) => service._id.$oid === this.service._id.$oid);
            if (myService && myService.instance_list.length > 0) {
                return myService.instance_list.find(
                    (instance) => instance.instance_number.toString() === this.instanceId,
                );
            }
            return null;
        }),
    );

    constructor(private route: ActivatedRoute, private router: Router, private store: Store<appReducer.AppState>) {}

    ngOnInit() {
        this.setLocation('48.1624064,11.5977288');

        this.serviceId = this.route.snapshot.paramMap.get('service-id');
        this.instanceId = this.route.snapshot.paramMap.get('instance-id');

        this.services$.subscribe({
            next: (services: IService[]) => {
                const s = services.filter((s: IService) => s._id?.$oid === this.serviceId);
                this.service = s.length === 0 ? null : s[0];
            },
        });
        console.log(this.instance);

        this.refreshData();
        this.timerSubscription = timer(15000, 15000)
            .pipe(takeWhile(() => this.alive))
            .subscribe(() => this.refreshData());

        this.instance.subscribe((i) => {
            const location = i.cluster_location.length > 0 ? i.cluster_location : '48.1624064,11.5977288,12';
            this.setLocation(location);
            console.log(i);
        });
    }

    ngAfterViewInit() {
        const map = L.map('map').setView([this.longitude, this.latitude], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        const circle = L.circle([this.longitude, this.latitude], {
            color: 'blue',
            fillColor: 'lightblue',
            fillOpacity: 0.5,
            radius: this.radius,
        }).addTo(map);

        circle.bindPopup('A Circle on the Map.');
    }

    private setLocation(locationString: string): void {
        if (!locationString) {
            this.textLocation = 'No location found';
            return;
        }
        const regex =
            /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?),\s*([-+]?(?:\d+)(?:\.\d+)?)$/;

        if (regex.test(locationString)) {
            console.log('Test');
            const array = locationString.split(',');
            this.longitude = parseFloat(array[0]);
            this.latitude = parseFloat(array[1]);
            this.radius = parseFloat(array[2]);
            console.log(this.radius);
        } else {
            this.textLocation = locationString;
        }
    }

    ngOnDestroy() {
        this.alive = false;
        this.timerSubscription.unsubscribe();
    }

    refreshData() {
        this.store.dispatch(getSingleService({ serviceId: this.service._id.$oid }));
        console.log('Update');
    }
}
