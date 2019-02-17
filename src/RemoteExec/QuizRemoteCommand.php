<?php
/**
 * @file
 * Specification of a menu option and command sent to remote system.
 */

namespace CL\RemoteExec;

/**
 * Specification of a menu option and command sent to remote system.
 *
 * @cond
 * @property string success Regular expression
 * @property string fail Regular expression
 * @endcond
 *
 */
class QuizRemoteCommand {
	/**
	 * @var SshExec
	 */
	private $ssh;

	/**
	 * QuizRemoteCommand constructor.
	 * @param SshExec $ssh SSH definition object
	 * @param string $option Menu option (top level)
	 * @param string $command Command to send to remote system.
	 */
	public function __construct(SshExec $ssh, $option, $command) {
		$this->option = $option;

		$this->action = new RemoteQuizAction($ssh);

		$this->action->command = $command;
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
			case 'action':
				return $this->action;

			case 'option':
				return $this->option;

			default:
				$trace = debug_backtrace();
				trigger_error(
					'Undefined property ' . $property .
					' in ' . $trace[0]['file'] .
					' on line ' . $trace[0]['line'],
					E_USER_NOTICE);
				return null;
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
			// Regular expression used to find success value in result
			case 'success':
				$this->action->success = $value;
				break;

			// Regular expression that if matched represents a quiz failure
			case 'fail':
				$this->action->fail = $value;
				break;

			default:
				$trace = debug_backtrace();
				trigger_error(
					'Undefined property ' . $property .
					' in ' . $trace[0]['file'] .
					' on line ' . $trace[0]['line'],
					E_USER_NOTICE);
				break;
		}
	}


	private $action;        // RemoteQuizAction object: the Playground action object.
	private $option;        // Menu option for the command

}