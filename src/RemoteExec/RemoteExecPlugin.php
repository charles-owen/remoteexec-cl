<?php
/**
 * @file
 * Plugin that adds the Playground IDE to the system.
 */

/// Classes in the RemoteExec subsystem
namespace CL\RemoteExec;

use CL\Site\Site;
use CL\Site\System\Server;
use CL\Site\Router;

/**
 * Plugin that adds server-side support for remote execution of code.
 */
class RemoteExecPlugin extends \CL\Site\Plugin {
	/**
	 * A tag that represents this plugin
	 * @return string A tag like 'course', 'users', etc.
	 */
	public function tag() {return 'remoteexec';}

	/**
	 * Return an array of tags indicating what plugins this one is dependent on.
	 * @return array of tags this plugin is dependent on
	 */
	public function depends() {return ['course', 'playground'];}

	/**
	 * Amend existing object
	 * The Router is amended with routes for the login page
	 * and for the user API.
	 * @param $object Object to amend.
	 */
	public function amend($object) {
		if($object instanceof Router) {
			$router = $object;

			$router->addRoute(['api', 'remoteexec', '*'], function(Site $site, Server $server, array $params, array $properties, $time) {
				$resource = new RemoteExecApi();
				return $resource->apiDispatch($site, $server, $params, $properties, $time);
			});

		}
	}

}