// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
// RxJS
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../../core/reducers';
// Layout
import { SubheaderService, } from '../../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';

// Services and Models
import {
	User,
	House,
	UserUpdated,
	SocialNetworks,
	selectUserById,
	UserOnServerCreated,
	selectLastCreatedUserId,
	selectUsersActionLoading
} from '../../../../../core/auth';

@Component({
	selector: 'kt-user-edit',
	templateUrl: './user-edit.component.html',
})
export class UserEditComponent implements OnInit {

	// Public properties
	user: User;
	oldUser: User;
	selectedTab: number = 0;
	loading$: Observable<boolean>;
	rolesSubject = new BehaviorSubject<number[]>([]);
	houseSubject = new BehaviorSubject<House>(new House());
	userForm: FormGroup;
	hasFormErrors: boolean = false;
	
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param userFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private userFB: FormBuilder,
		private subheaderService: SubheaderService,
		private store: Store<AppState>,
		private layoutUtilsService: LayoutUtilsService,
	) { }

	/**
	 * On init
	 */
	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectUsersActionLoading));

		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const idNumber = params['idNumber'];
			if (idNumber && idNumber > 0) {
				this.store.pipe(select(selectUserById(idNumber))).subscribe(res => {
					if (res) {
						this.user = res;
						this.houseSubject.next(this.user.house);
						this.rolesSubject.next(this.user.roles);
						this.oldUser = Object.assign({}, this.user);
						this.initUser();
					}
				});
			} else {
				this.user = new User();
				this.user.clear();
				this.houseSubject.next(this.user.house);
				this.rolesSubject.next(this.user.roles);
				this.oldUser = Object.assign({}, this.user);
				this.initUser();
			}
		});
		this.subscriptions.push(routeSubscription);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	/**
	 * Init user
	 */
	initUser() {
		this.createForm();
		if (!this.user.idNumber) {
			this.subheaderService.setTitle('Create user');
			this.subheaderService.setBreadcrumbs([
				{ title: 'User Management', page: `users` },
				{ title: 'Users',  page: `users/users` },
				{ title: 'Create user', page: `users/users/add` }
			]);
			return;
		}
		this.subheaderService.setTitle('Edit user');
		this.subheaderService.setBreadcrumbs([
			{ title: 'User Management', page: `users` },
			{ title: 'Users',  page: `users/users` },
			{ title: 'Edit user', page: `users/users/edit`, queryParams: { idNumber: this.user.idNumber } }
		]);
	}

	/**
	 * Create form
	 */
	createForm() {
		this.userForm = this.userFB.group({
			idNumber: [this.user.idNumber, Validators.required],
			fullname: [this.user.fullname, Validators.required],
			email: [this.user.email, Validators.email],
			phone: [this.user.phone, Validators.required],
			bithdate: [this.user.birthdate, Validators.required],
			addressLine: [this.user.addressLine],
		});
 	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/user-management/users`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param idNumber: number
	 */
	refreshUser(isNew: boolean = false, idNumber = 0) {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/user-management/users/edit/${idNumber}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Reset
	 */
	reset() {
		this.user = Object.assign({}, this.oldUser);
		this.createForm();
		this.hasFormErrors = false;
		this.userForm.markAsPristine();
        this.userForm.markAsUntouched();
        this.userForm.updateValueAndValidity();
  	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.userForm.controls;
		/** check form */
		if (this.userForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const editedUser = this.prepareUser();

		if (editedUser.idNumber > 0) {
			this.updateUser(editedUser, withBack);
			return;
		}

		this.addUser(editedUser, withBack);
  	}

	/**
	 * Returns prepared data for save
	 */
	prepareUser(): User {
		const controls = this.userForm.controls;
		const _user = new User();
		_user.clear();
		_user.house = this.houseSubject.value;
		_user.roles = this.rolesSubject.value;
		_user.accessToken = this.user.accessToken;
		_user.refreshToken = this.user.refreshToken;
		_user.photo = this.user.photo;
		_user.idNumber = controls['idNumber'].value;
		_user.fullname = controls['fullname'].value;
		_user.email = controls['email'].value;
		_user.phone = controls['phone'].value;
		_user.birthdate = controls['bithdate'].value;
		_user.addressLine = controls['addressLine'].value;
		_user.password = this.user.password;
		return _user;
	}

	/**
	 * Add User
	 *
	 * @param _user: User
	 * @param withBack: boolean
	 */
	addUser(_user: User, withBack: boolean = false) {
		this.store.dispatch(new UserOnServerCreated({ user: _user }));
		const addSubscription = this.store.pipe(select(selectLastCreatedUserId)).subscribe(newId => {
			const message = `New user successfully has been added.`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
			if (newId) {
				if (withBack) {
					this.goBackWithId();
				} else {
					this.refreshUser(true, newId);
				}
			}
		});
		this.subscriptions.push(addSubscription);
	}

	/**
	 * Update user
	 *
	 * @param _user: User
	 * @param withBack: boolean
	 */
	updateUser(_user: User, withBack: boolean = false) {
		// Update User
		// tslint:disable-next-line:prefer-const

		const updatedUser: Update<User> = {
			id: _user.idNumber,
			changes: _user
		};
		this.store.dispatch(new UserUpdated( { partialUser: updatedUser, user: _user }));
		const message = `User successfully has been saved.`;
		this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
		if (withBack) {
			this.goBackWithId();
		} else {
			this.refreshUser(false);
		}
	}

	/**
	 * Returns component title
	 */
	getComponentTitle() {
		let result = 'Create user';
		if (!this.user || !this.user.idNumber) {
			return result;
		}

		result = `Edit user - ${this.user.fullname}`;
		return result;
	}

	/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
}
