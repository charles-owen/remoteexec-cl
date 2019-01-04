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
use CL\Course\Members;
use CL\Course\Member;

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
		switch($params[0]) {
			case 'exec':
				return $this->exec($site, $server, $params, $time);
		}

		throw new APIException("Invalid API Path", APIException::INVALID_API_PATH);
	}

	private function exec(Site $site, Server $server, array $params, $time) {
		$post = $server->post;
		$this->ensure($post, ['sources', 'ssh']);

		$sources = $post['sources'];

		$ssh = new SshExec($site);
		$ssh->load($site, $post['ssh']);

		// Ensure no possible includes in any source file
		foreach($sources as $source) {
			$regex = '/(.include)|(.incbin)/i';
			if(preg_match($regex, $source) === 1) {
				throw new APIException(".include and .incbin are not allowed!");
			}
		}

		if($site->sandbox) {
			$data = "Remote execution not available when\nrunning in the sandbox.";
			$json = new JsonAPI();
			$json->addData('remoteexec-result', 0, $data);
			return $json;
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