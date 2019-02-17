<?php
/**
 * @file
 * Playground action that executes code on a remote system.
 */

namespace CL\RemoteExec;

use CL\Playground\Action\Action;
use CL\Site\Site;
use CL\Site\Util\EncryptException;

/**
 * Playground action that executes code on a remote system.
 */
class RemoteExecAction extends Action {

	/**
	 * RemoteExecAction constructor.
	 */
	public function __construct(SshExec $ssh, $tag=null) {
		parent::__construct($tag === null ? 'remoteexec' : $tag);

		$this->ssh = $ssh;
	}

	/**
	 * Property get magic method
	 *
	 * <b>Properties</b>
	 * Property | Type | Description
	 * -------- | ---- | -----------
	 *
	 * @param string $property Property name
	 * @return mixed
	 */
	public function __get($property) {
		switch($property) {
			case 'command':
				return $this->command;

			case 'ssh':
				return $this->ssh;

			default:
				return parent::__get($property);
		}
	}

	/**
	 * Property set magic method
	 *
	 * <b>Properties</b>
	 * Property | Type | Description
	 * -------- | ---- | -----------
	 *
	 * @param string $property Property name
	 * @param mixed $value Value to set
	 */
	public function __set($property, $value) {
		switch($property) {
			case 'command':
				$this->command = $value;
				break;

			default:
				parent::__set($property, $value);
				break;
		}
	}


	/**
	 * Create data describing the action suitable for sending to client
	 * @param Site $site The site object
	 * @return array of data
	 * @throws EncryptException
	 */
	public function data(Site $site) {
		$data = parent::data($site);

		$data['ssh'] = $this->ssh->data($site);
		$data['command'] = $this->command;
		return $data;
	}

	private $ssh;
	private $command;       // Command to send

}