require('dotenv').config({ path: '.env' });
const request = require('request-promise');
const moment = require('moment');

const nasneOptions = {
	url: `http://${process.env.NASNE_IP}:64220/recorded/titleListGet`,
	qs: {
		searchCriteria: '0',
		filter: '0',
		startingIndex: '0',
		requestedCount: '0',
		sortCriteria: '0',
		withDescriptionLong: '0',
		withUserData: '0'
	},
	method: "GET",
	json: true
}

const result = {
	type: "nasne",
	token: process.env.TOKEN,
	newVideo: false,
	item: []
};

function nasnePost(nasneOptions) {
	/*
	 * nasneから録画番組一覧を取得
	 * 新着録画がある場合はGASにpost
	 */

	request(nasneOptions)
		.then(function (body) {
			body.item.forEach(function (key) {
				if (moment().diff(moment(key.startDateTime), 'hours') < 2) result.newVideo = true;
				let program = {
					id: key.id,
					title: key.title // 特殊文字を置き換え
						.replace(/\ue195/g, "[終]")
						.replace(/\ue193/g, "[新]")
						.replace(/\ue0fe/g, "[字]")
						.replace(/\uE184/g, "[解]")
						.replace(/\uE183/g, "[多]")
						.replace(/\uE180/g, "[デ]"),
					description: key.description,
					startDateTime: key.startDateTime,
					duration: key.duration
				};
				result.item.push(program);
			});
			if (result.newVideo) {
				const options = {
					uri: process.env.GAS_URL,
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(result)
				};
				request(options, function (error, response, body) {
					if (error) { console.log(error) };
					console.log(`${new Date()} Update has been sent.`);
				});
			} else {
				console.log(`${new Date()} No Update`);
			}
		}).catch(function (err) {
			console.log(err);
		});
}

nasnePost(nasneOptions);