<?php
/**
 * @file
 * Playground action that executes a quiz problem on a remote system.
 */

namespace CL\RemoteExec;

use CL\Site\Site;
use CL\Site\Util\EncryptException;


/**
 * Playground action that executes a quiz problem on a remote system.
 */
class RemoteQuizAction extends RemoteExecAction {

	public function __construct(SshExec $ssh) {
		parent::__construct($ssh,'remotequiz');
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
			// Regular expression used to find success value in result
			case 'success':
				$this->success = $value;
				break;

			// Regular expression that if matched represents a quiz failure
			case 'fail':
				$this->fail = $value;
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

		$data['success'] = $this->success;
		$data['fail'] = $this->fail;
		return $data;
	}


	private $success = null;
	private $fail = null;
}