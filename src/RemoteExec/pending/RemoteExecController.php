<?php
/**
 * @file
 */

namespace Extern;


class RemoteExecController extends \Controller {
	public function __construct(\Course $course, \User $user=null, &$session, $time=null) {
		parent::__construct($course, $user);

		$this->session = &$session;

		if($time === null) {
			$time = time();
		}

		$this->time = $time;
	}

	public function post($post) {
		$cmd = $post['cmd'];
		switch($cmd) {
			case 'save':
				return $this->save($post);

			case 'quiz-test':
				return $this->quiztest($post);
		}

		return json_encode(array('ok' => false, 'msg' => 'Invalid command'));
	}

	private function save($post) {
		$assignTag = strip_tags($post['assign']);
		$tag = strip_tags($post['tag']);
		$name = strip_tags($post['name']);
		$type = strip_tags($post['type']);
		$data = $post['data'];

		$filesystem = new \FileSystem\FileSystem($this->course);
		if(!$filesystem->save_text($this->user, $assignTag, $tag, $name, $data, $type)) {
			return json_encode(array('ok' => false, 'msg' => 'Unable to write file'));
		}

		return json_encode(array('ok' => true));
	}

	private function quiztest($post) {
		$assignTag = strip_tags($post['assign']);
		$tag = strip_tags($post['tag']);
		$name = strip_tags($post['name']);
		$type = strip_tags($post['type']);
		$data = $post['data'];

		$sessionname = strip_tags($post['session']);

		/*
		 * Get the quiz
		 */
		if( !isset($this->session[$sessionname]) ) {
			return json_encode(array('ok' => false, 'msg' => 'Quiz access has failed. It is possible the PHP session has timed out.'));
		}

		$quizSession = $this->session[$sessionname];
		$question = $quizSession->get_question();
		$exec = $question->get_sshexec();
		$exec->set_course($this->course);

		$filesystem = new \FileSystem\FileSystem($this->course);
		if(!$filesystem->save_text($this->user, $assignTag, $tag, $name, $data, $type)) {
			return json_encode(array('ok' => false, 'msg' => 'Unable to write file'));
		}

		if($exec->connect()) {
			$exec->create_workspace($question->source);
			$exec->write($data, $question->testfile);

			$rand = rand(1, 1000000);
			$result = $exec->exec_workspace("make r=$rand test");

			if (preg_match('/make: .*Error/', $result) !== 1 &&
				preg_match('/\*\*\* Tests Successful ' . $rand . ' \*\*\*/', $result) === 1
			) {
				$success = true;
			} else {
				$success = false;
			}

			$exec->destroy_workspace();
			$exec->disconnect();

			return json_encode(array('ok' => true,
				'success' => $success, 'result' => $result));
		} else {
			return json_encode(array('ok' => false, 'msg' => 'Unable to connect to testing system'));
		}

		return json_encode(array('ok' => true));
	}


	private $time;
	private $session = array(1, 3);
}