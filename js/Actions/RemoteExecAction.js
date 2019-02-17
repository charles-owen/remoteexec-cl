const Action = Site.Playground.Action;

/**
 * Playground action that executes code on a remote system and displays result
 * @param site The site object
 * @param options Options as passed to the client
 * @constructor
 */
export const RemoteExecAction = function(site, options) {
	Action.call(this, site, options);

	this.do = function(main) {
		Action.prototype.do.call(this, main);

		// Get the requisite tab contents
		const sources = this.getSources();

		const params = {
			sources: sources,
			command: options.command,
			ssh: options.ssh
		};

		// Anything added by a derived class?
		this.additional(params);


		main.modal(true);
		const output = main.getTab('output');
		if(output !== null) {
			output.set('');
		}

		site.api.post('/api/remoteexec/exec', params)
			.then((response) => {
				main.modal(false);
				if (!response.hasError()) {
					const data = response.getData('remoteexec-result').attributes;
					if(output !== null) {
						output.set(data);
					}

					this.process(data);
				} else {
					site.toast(this, response);
				}

			})
			.catch((error) => {
				main.modal(false);

				site.toast(this, error);
			});
	}

	this.additional = function(params) {}
	this.process = function(output) {}

}

RemoteExecAction.prototype = Object.create(Action.prototype);
RemoteExecAction.prototype.constructor = RemoteExecAction;

RemoteExecAction.tag = 'remoteexec';