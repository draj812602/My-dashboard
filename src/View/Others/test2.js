import React from 'react';

const test2 = () => {
	// function walk(amount) {
	// 	return new Promise((resolve, reject) => {
	// 		if (amount > 500) {
	// 			reject('the value is too big');
	// 		}

	// 		setTimeout(() => resolve(`you walked for ${amount}ms`), amount);
	// 	});
	// }

	// const go = async () => {
	// 	const res = await walk(500);
	// 	console.log(res);

	// 	const res2 = await walk(300);

	// 	console.log(res2);

	// 	const res3 = await walk(200);

	// 	console.log(res3);

	// 	const res4 = await walk(700);

	// 	console.log(res4);

	// 	const res5 = await walk(400);

	// 	console.log(res5);

	// 	console.log('finished');
	// };

	// go();
	let langs = ['Ruby', 'ES6', 'Scala'];

	return (
		<div>
			{langs.map((it) => (
				<p>{it}</p>
			))}
		</div>
	);
};

export default test2;
