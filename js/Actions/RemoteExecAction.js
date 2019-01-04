const Action = Site.Playground.Action;

export const RemoteExecAction = function(site, options) {
	Action.call(this, site, options);

	this.click = function(main) {
		// Get the requisite tab contents
		const sources = {};

		for(const source of options.sources) {
			const tab = main.getTab(source);
			if(tab !== null) {
				sources[source] = tab.get();
			}
		}

		const params = {
			sources: sources,
			ssh: options.ssh
		};

		site.api.post('/api/remoteexec/exec', params)
			.then((response) => {
				console.log(response);
				if (!response.hasError()) {
					const data = response.getData('remoteexec-result').attributes;
					const output = main.getTab('output');
					if(output !== null) {
						output.set(data);
					}
				} else {
					site.toast(this, response);
				}

			})
			.catch((error) => {
				site.toast(this, error);
			});
	}
}

RemoteExecAction.prototype = Object.create(Action.prototype);
RemoteExecAction.prototype.constructor = RemoteExecAction;

RemoteExecAction.tag = 'remoteexec';