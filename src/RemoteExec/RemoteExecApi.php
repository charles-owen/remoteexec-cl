<?php
/**
 * @file
 * API Resource for /api/remoteexec
 */
namespace CL\RemoteExec;

use CL\Site\Site;
use CL\Site\System\Server;
use CL\Site\Api\JsonAPI;
use CL\Site\Api\APIException;
use CL\Users\User;
use CL\Course\Member;
use CL\FileSystem\FileSystem;


/**
 * API Resource for /api/remoteexec
 */
class RemoteExecApi extends \CL\Users\Api\Resource {

	/**
	 * QuizApi constructor.
	 */
	public function __construct() {
		parent::__construct();
	}

	/**
	 * Dispatch API calls.
	 * @param Site $site Site object
	 * @param Server $server Server object
	 * @param array $params Parameters passed by the router (after /api/quiz)
	 * @param array $properties Properties passed by the router (:id values)
	 * @param int $time Current time
	 * @return JsonAPI with response filled in
	 * @throws APIException
	 */
	public function dispatch(Site $site, Server $server, array $params, array $properties, $time) {
		$user = $this->isUser($site, Member::STUDENT);

		switch($params[0]) {
			case 'exec':
				return $this->exec($site, $user, $server, $params, $time);
		}

		throw new APIException("Invalid API Path", APIException::INVALID_API_PATH);
	}

	private function exec(Site $site, User $user, Server $server, array $params, $time) {
		$post = $server->post;
		$this->ensure($post, ['sources', 'ssh']);

		$sources = $post['sources'];

		if(isset($post['appTag']) && isset($post['name'])) {
			$appTag = $post['appTag'];
			$name = $post['name'];
			$open = true;

			if(!$user->staff && $site->installed('course')) {
				// When the course system is installed, we check to see if
				// the $appTag is an application tag. If so, we ensure we
				// do not write that tag if the assignment is not open
				$course = $site->course;
				$section = $course->get_section_for($user);
				if($section !== null) {
					$assignment = $section->get_assignment($appTag);
					if($assignment !== null && !$assignment->is_open($user, $time)) {
						// Assignment is not open for submission!
						$open = false;
					}
				}
			}

			if($open) {
				$fs = new FileSystem($site->db);
				$data = json_encode($sources);
				if(!$fs->fileExists($user->id, $user->member->id, $appTag, $name)) {
					$ret = $fs->writeText($user->id, $user->member->id, $appTag, $name, $data, 'application/json', FileSystem::PERMISSION_PRIVATE, $time);
				} else {
					$ret = $fs->updateText($user->id, $user->member->id, $appTag, $name, $data, 'application/json', FileSystem::PERMISSION_PRIVATE, $time);
				}
			}
		}

		$ssh = new SshExec($site);
		$ssh->load($site, $post['ssh']);


		// Perform any SSH filtering required
		$msg = $ssh->filter($sources);
		if($msg !== null) {
			throw new APIException($msg);
		}

		if($user->staff) {
			$ssh->verbose = true;
		}

		if($site->sandbox) {
			sleep(1);
			$result = <<<TEXT
gcc  -Wall -I/home/cse320/files/include   -c -o test.o test.c
gcc  -Wall -I/home/cse320/files/include   -c -o catto.o catto.c
gcc -o stringcatter test.o catto.o  -L/home/cse320/files/lib -l320
*** Tests Started 1.03 ***
Testing concatenation of 'abcd' and 'efgh'
Testing concatenation of '' and '012345678'
Testing concatenation of 'Now we have something ' and ''
Testing concatenation of 'Ay ' and 'caramba'
Testing concatenation of '1377572551' and '289170052'
*** Tests Successful 376164041 ***

TEXT;

			$json = new JsonAPI();
			$json->addData('remoteexec-result', 0, $result);
			return $json;


//			$data = "Remote execution not available when\nrunning in the sandbox.";
//			$json = new JsonAPI();
//			$json->addData('remoteexec-result', 0, $data);
//			return $json;
		}

		$result = $ssh->sequence($sources);
		if(!$result['ok']) {
			throw new APIException($result['msg']);
		}

		$json = new JsonAPI();
		$json->addData('remoteexec-result', 0, $result['result']);
		return $json;
	}
}