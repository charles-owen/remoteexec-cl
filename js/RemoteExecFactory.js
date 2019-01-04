import {RemoteExecAction} from './Actions/RemoteExecAction';

export const RemoteExecFactory = function() {}

RemoteExecFactory.create = function(site) {

	const Playground = site.Playground;
	Playground.addAction(RemoteExecAction);
}