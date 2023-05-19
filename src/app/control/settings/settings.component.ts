import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { appReducer, getSettings, setSettings } from '../../root/store';
import { selectSettings } from '../../root/store/selectors/settings.selector';
import { take } from 'rxjs';
import { ConfigurationType, ISettings } from '../../root/interfaces/settings';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
    protected readonly ConfigurationType = ConfigurationType;
    selectedOption: ConfigurationType;
    options: ConfigurationType[] = [ConfigurationType.NONE, ConfigurationType.CUSTOME, ConfigurationType.OAKESTRA];
    form: FormGroup;

    constructor(private fb: FormBuilder, private store: Store<appReducer.AppState>) {}

    ngOnInit(): void {
        this.store.dispatch(getSettings());

        this.store
            .select(selectSettings)
            .pipe(take(1))
            .subscribe((settings) => {
                console.log(settings);

                this.selectedOption = settings.type;

                this.form = this.fb.group({
                    address: settings.address ?? [''],
                    port: settings.port ?? [''],
                    username: settings.username ?? [''],
                    password: settings.ssl ?? [''],
                    ssl: settings.ssl ?? [false],
                });
            });
    }

    public save() {
        let settings: ISettings = {
            type: this.selectedOption,
        };

        if (this.selectedOption === ConfigurationType.CUSTOME) {
            settings = { ...settings, ...this.form.getRawValue() };
        }

        this.store.dispatch(setSettings({ settings }));
    }
}
