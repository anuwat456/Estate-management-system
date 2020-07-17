// Angular
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
// RxJS
import { BehaviorSubject, fromEvent } from 'rxjs';
// NGRX
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
// Auth
import { House, AuthService } from '../../../../../../core/auth';

@Component({
  selector: 'kt-house',
  templateUrl: './house.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HouseComponent implements OnInit {
  // Public properties
  // Incoming data
  @Input() houseSubject: BehaviorSubject<House>;
  hasFormErrors: boolean = false;
  houseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
  ) { }

	/**
	 * On init
	 */
	ngOnInit() {
		if (!this.houseSubject.value) {
				const newAddress = new House();
				newAddress.clear();
				this.houseSubject.next(newAddress);
			}

			this.createForm();
			this.houseForm.valueChanges
				.pipe(
					// tslint:disable-next-line:max-line-length
					debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
					distinctUntilChanged(), // This operator will eliminate duplicate values
					tap(() => {
						this.updateHouse();
					})
				)
				.subscribe();
	}

	/**
		 * Init form
		 */
	createForm() {
		this.houseForm = this.fb.group({
			idHouse: [this.houseSubject.value.idHouse, Validators.required],
			laneHouse: [this.houseSubject.value.laneHouse, Validators.required],
			colorHouse: [this.houseSubject.value.colorHouse, Validators.required],
			areaHouse: [this.houseSubject.value.areaHouse, Validators.required]
		});
	}
  
  	/**
	 * Update house
	 */
	updateHouse() {
		this.hasFormErrors = false;
		const controls = this.houseForm.controls;
		/** check form */
		if (this.houseForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;

			return;
		}

		const newHouse = new House();
		newHouse.clear();
		newHouse.idHouse = controls['idHouse'].value;
		newHouse.laneHouse = controls['laneHouse'].value;
		newHouse.colorHouse = controls['colorHouse'].value;
		newHouse.areaHouse = controls['areaHouse'].value;
		this.houseSubject.next(newHouse);
	}

  	/**
	 * Close alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

}
