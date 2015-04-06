var data = {
	houses: [
		{
			name: "collins St",
			created: null,
			users: [
				{
					_id: "udididid",
					name: "Michael"
				},
				{
					_id: "udididid",
					name: "Tom"
				}
			],
			transactions: [{
				name: "",
				created: "",
				amount: "",
				user: {
					_id: "udididid"
				},
				split: 0.5
			}
			]
		}

	]
}

var transactions = [
	{
		_id : 123,
		desc : "Shoping",
		amount: 44,
		split: 0.5,
		date: 1428284341561,
		payer: {
			_id: 12345,
			name: "Michael",
			email: "p88@me.com"
		}
	},
	{
		_id : 456,
		desc : "Beer",
		amount: 23,
		split: 0.5,
		date: 1288323623006,
		payer: {
			_id: 67890,
			name: "Tom",
			email: "tom@me.com"
		}
	},
	{
		_id : 789,
		desc : "Birthday dinner and drinks",
		amount: 34.80,
		split: 0.33,
		date: 1428283610653,
		payer: {
			_id: 12345,
			name: "Michael",
			email: "p88@me.com"
		}
	}
]

var transaction = {
	_id : Number,
	desc : String,
	amount: Number,
	split: Number,
	payer: Object
}