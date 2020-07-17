export class UsersTable {
	public static users: any = [
		/**
		 * Estate Data
		 */
		{
			//id: 4,
			idNumber: 1409800382214,
			password: 'demo',
			fullname: 'Admin Demo',
			email: 'admin@demo.com',
			birthdate: '2017-06-30',
			addressLine: '132/323 Srijun Khonkaen',
			phone: '1234567890',
			photo: './assets/media/users/default.jpg',
			accessToken: 'access-token-8f3ae836da744329a6f93bf20594b5cc',
			refreshToken: 'access-token-f8c137a2c98743f48b643e71161d90aa',
			roles: [1],
			house: {
				idHouse: '132/323',
				laneHouse: 'SriSawad',
				colorHouse: 'Red',
				areaHouse: '150*200'
			}
		},
		{
			//id: 5,
			idNumber: 1409800382215,
			password: 'demo',
			fullname: 'User Demo',
			email: 'user@demo.com',
			birthdate: '2017-06-30',
			addressLine: '132/323 Srijun Krorat',
			phone: '1234567890',
			photo: './assets/media/users/default.jpg',
			accessToken: 'access-token-6829bba69dd3421d8762-991e9e806dbf',
			refreshToken: 'access-token-f8e4c61a318e4d618b6c199ef96b9e55',
			roles: [2],
			house: {
				idHouse: '132/324',
				laneHouse: 'SriSawad',
				colorHouse: 'Green',
				areaHouse: '150*200'
			}
		},
		{
			//id: 6,
			idNumber: 1409800382216,
			password: 'demo',
			fullname: 'Guest Demo',
			email: 'guest@demo.com',
			birthdate: '2017-06-30',
			addressLine: '132/323 Srijun Khonkaen',
			phone: '1234567890',
			photo: './assets/media/users/default.jpg',
			accessToken: 'access-token-d2dff7b82f784de584b60964abbe45b9',
			refreshToken: 'access-token-c999ccfe74aa40d0aa1a64c5e620c1a5',
			roles: [3],
			house: {
				idHouse: '132/325',
				laneHouse: 'SriSawad',
				colorHouse: 'Blue',
				areaHouse: '150*200'
			}
		},
	];

	public static tokens: any = [
		{
			id: 1,
			accessToken: 'access-token-' + Math.random(),
			refreshToken: 'access-token-' + Math.random()
		}
	];
}
