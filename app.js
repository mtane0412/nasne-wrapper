require('dotenv').config();
const request = require('request-promise');
const cronJob = require('cron').CronJob;
const moment = require('moment');

const nasneUrl = 'http://" + process.env.NASNE_ADDRESS + ":64220/recorded/titleListGet?searchCriteria=0&filter=0&startingIndex=0&requestedCount=0&sortCriteria=0&withDescriptionLong=0&withUserData=0';

const nasneOptions = {
	url: nasneUrl,
	method: 'GET',
	json: true
}

const result = {
	type: "nasne",
	token: process.env.TOKEN,
	item: []
};

let newVideo = false; // 新着録画フラグ

function nasnePost(nasneOptions){
		/*
		 * nasneから録画番組一覧を取得
		 * 新着録画がある場合はGASにpost
		 */

		request(nasneOptions).then(function (body) {
				body.item.forEach(function(key){
						if(moment().diff(moment(key.startDateTime), 'hours') < 2) newVideo = true;
						let program = {
								id: key.id,
								title: key.title
								.replace(/\ue195/g, '[終]')
								.replace(/\ue193/g, '[新]')
								.replace(/\ue0fe/g, '[字]')
								.replace(/\uE184/g, '[解]')
								.replace(/\uE183/g, '[多]')
								.replace(/\uE180/g, '[デ]'),
								description: key.description,
								startDateTime: key.startDateTime,
								duration: key.duration
						};
						result.item.push(program);
				}); 
				if (newVideo) {
						const options = {
								uri: process.env.GAS_URL,
								method: 'POST',
								headers: {
										"Content-Type": "application/json",
								},
								body: JSON.stringify(result)
						};
						request(options, function(error, response, body){});
						console.log('Update has been sent.', new Date());
				} else {
						console.log('No Update', new Date());
				}
		}).catch(function (err) {
				console.log(err);
		});
}

// 毎時10分に番組チェック
const cronTime = "10 * * * *";

const job = new cronJob({
		cronTime: cronTime,
		onTick: nasnePost(nasneOptions),
		start: false,
		timezone: "Japan/Tokyo"
})

job.start();
