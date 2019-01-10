<?php
/**
 * @file
 * Playground action that executes a quiz problem on a remote system.
 */

namespace CL\RemoteExec;

use CL\Site\Site;

/**
 * Playground action that executes a quiz problem on a remote system.
 */
class RemoteQuizAction extends RemoteExecAction {

	public function __construct() {
		parent::__construct('remotequiz');
	}
}