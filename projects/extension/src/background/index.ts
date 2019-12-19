const trySendMessage = (
	id: string,
	msg: any,
	attemptNum: number,
	maxAttempts: number = 5
) => {
	window.setTimeout(() => {
		browser.tabs.sendMessage(id, msg).catch(e => {
			if (attemptNum < maxAttempts) {
				trySendMessage(id, msg, attemptNum + 1, maxAttempts);
			} else {
				console.error(
					`Failed to send message to tab after ${attemptNum} attempts`,
					e
				);
			}
		});
	}, 500);
};

browser.runtime.onMessage.addListener(msg => {
	if (msg.type === 'scrape::facebook') {
		browser.windows
			.create({
				type: 'panel',
				width: 1900,
				height: 1080,
				url: msg.url,
			})
			.then(newWindow => {
				const id = newWindow.tabs[0].id;
				// Probably a smarter way of doing this.
				trySendMessage(id, msg, 0);
			});
	}
});
