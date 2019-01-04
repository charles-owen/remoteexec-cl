<?php
/**
 * @file
 * Playground action that executes code on a remote system.
 */

namespace CL\RemoteExec;

use CL\Playground\Action\Action;

use CL\Site\Site;

/**
 * Playground action that executes code on a remote system.
 */
class RemoteExecAction extends Action {

	/**
	 * RemoteExecAction constructor.
	 */
	public function __construct() {
		parent::__construct('remoteexec');

		$this->ssh = new SshExec();
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
			case 'ssh':
				return $this->ssh;

			default:
				return parent::__get($property);
		}
	}

	/**
	 * Add a source we send to remote execution.
	 * @param string $tag Tag for the tab we get the data from
	 */
	public function source($tag) {
		$this->sources[] = $tag;
	}


	public function data(Site $site) {
		$data = parent::data($site);

		$data['sources'] = $this->sources;
		$data['ssh'] = $this->ssh->data($site);
		return $data;
	}

	private $sources = [];
	private $ssh;
}