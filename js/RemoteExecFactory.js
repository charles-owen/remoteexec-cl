import {RemoteExecAction} from './Actions/RemoteExecAction';
import {RemoteQuizAction} from './Actions/RemoteQuizAction';

export const RemoteExecFactory = function() {}

RemoteExecFactory.create = function(site) {

	const Playground = site.Playground;

	Playground.addAction(RemoteExecAction);
	Playground.addAction(RemoteQuizAction);
}