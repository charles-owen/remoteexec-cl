import {RemoteExecAction} from './RemoteExecAction';

/**
 * Playground action that executes code for a quiz on a remote system and displays result
 * @param site The site object
 * @param options Options as passed to the client
 * @constructor
 */
export const RemoteQuizAction = function(site, options) {
	RemoteExecAction.call(this, site, options);

	this.additional = function(params) {
		params.appTag = options.appTag;
		params.name = options.name;
	}

	this.process = function(data) {
		const answer = document.querySelector('input[name="cl-playground-answer"]');
		const code = document.querySelector('input[name="cl-playground-code"]');
		if(answer === null || code === null) {
			return;
		}

		// Does it have a failure match
		if(options.fail !== null) {
			const fail = RegExp(options.fail);
			const result = data.match(fail);
			if(result !== null) {
				answer.value = 'fail';
				code.value = data;
				return;
			}
		}

		// Does it have the success string in it?
		const re = new RegExp(options.success);
		const result = data.match(re);
		if(result !== null) {
			// Success
			answer.value = result[1];
		} else {
			// Failure!
			answer.value = 'fail';
		}

		code.value = data;
	}

}

RemoteQuizAction.prototype = Object.create(RemoteExecAction.prototype);
RemoteQuizAction.prototype.constructor = RemoteQuizAction;

RemoteQuizAction.tag = 'remotequiz';