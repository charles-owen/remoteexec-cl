<?php
/**
 * @file
 * This class manages execution of test programs on a remote
 * system via SSH.
 */

namespace CL\RemoteExec;

use CL\Site\Site;
use CL\Site\Util\Encrypt;
use CL\Site\Util\EncryptException;
use Exception;

/**
 * This class manages execution of test programs on a remote
 * system via SSH.
 *
 * @cond
 * @property string keyuser
 * @property string privatekey
 * @property string publickey
 * @property string remote
 * @endcond
 */
class SshExec {
	/**
	 * SshExec constructor.
	 *
	 * If site is not passed, it must be specified
	 * as a property before connect is called.
	 *
	 * @param Site $site The site object
	 */
	public function __construct(Site $site=null) {
		$this->site = $site;
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
			case 'remote':
				$this->remotes[] = $value;
				break;

			case 'publickey':
				$this->publickey = $value;
				break;

			case 'privatekey':
				$this->privatekey = $value;
				break;

			case 'keyuser':
				$this->keyuser = $value;
				break;

			case 'port':
				$this->port = $value;
				break;

			case 'site':
				$this->site = $value;
				break;

			case 'workspaceSource':
				$this->workspaceSource = $value;
				break;

			case 'command':
				$this->command = $value;
				break;

			case 'verbose':
				$this->verbose = $value;
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


	/**
	 * Attempt to connect to the remote system.
	 * @return bool true if connected
	 */
	public function connect() {
		$remote = $this->remotes[0];

		$this->connection = \ssh2_connect($remote, $this->port);
		if($this->connection === false) {
			$this->connection = null;
			return false;
		}

		$rootdir = $this->site->rootDir;
		$publickey = $rootdir . $this->publickey;
		$privatekey = $rootdir . $this->privatekey;

		if(!\ssh2_auth_pubkey_file($this->connection, $this->keyuser,
			$publickey, $privatekey, null)) {
			$this->connection->disconnect();
			$this->connection = null;
			return false;
		}

		return true;
	}

	/**
	 * Disconnect from remote system.
	 * @return bool True if successful
	 */
	public function disconnect() {
		$this->connection = null;
		return true;
	}

	/**
	 * Execute a command on the remote system.
	 * @param string $cmd Command to execute
	 * @return string Response to the command
	 * @throws Exception on failure
	 */
	public function exec($cmd) {
		if($this->connection === null) {
			return '';
		}

		if (!($stream = \ssh2_exec($this->connection, $cmd))) {
			throw new \Exception('SSH command failed');
		}

		$errorStream = \ssh2_fetch_stream($stream, SSH2_STREAM_STDERR);

		stream_set_blocking($stream, true);
		$data = "";
		while ($buf = fread($stream, 4096)) {
			$data .= $buf;
		}
		stream_set_blocking($errorStream, true);

		while ($buf = fread($errorStream, 4096)) {
			$data .= $buf;
		}

		fclose($stream);
		fclose($errorStream);

		return $data;
	}

	/**
	 * Execute a command in the temporary workspace.
	 * @param string $cmd Command to execute (like 'make')
	 * @return string Result from command
	 * @throws Exception
	 */
	public function exec_workspace($cmd) {
		return $this->exec("cd $this->workspace; $cmd");
	}

	/**
	 * Create a workspace on the remote system and optionally copy in
	 * some source data.
	 * @param string $loading Path on remote system to data to load
	 * @return string Command result
	 * @throws Exception on failure
	 */
	public function create_workspace($loading = null) {
		$this->workspace = "/tmp/t" . bin2hex(openssl_random_pseudo_bytes(8));
		$result = '';
		if($loading !== null) {
			$result = $this->exec("mkdir $this->workspace; cp -rf $loading $this->workspace");
		} else {
			$result = $this->exec("mkdir $this->workspace");
		}

		if($this->verbose) {
			return $result;
		} else {
			return '';
		}
	}

	/**
	 * Destroy the temporary workspace
	 * @return string result of the command execution
	 * @throws Exception
	 */
	public function destroy_workspace() {
		return $this->exec("rm -rf $this->workspace");
	}

	/**
	 * List files in the temporary workspace
	 * @return string result of the command execution
	 * @throws Exception
	 */
	public function ls() {
		return $this->exec("ls -al $this->workspace");
	}

	/**
	 * Write data as a file in the temporary workspace
	 * @param string $data Data to write
	 * @param string $filename Filename to save the data as
	 * @throws Exception
	 */
	public function write($data, $filename) {
		if(!($sftp = ssh2_sftp($this->connection))) {
			throw new \Exception('SSH FTP command failed');
		}

		$remote_file = "$this->workspace/$filename";
		$stream = @fopen("ssh2.sftp://$sftp$remote_file", 'w');
		if (! $stream) {
			throw new \Exception("Could not open file: $remote_file");
		}

		if (fwrite($stream, $data) === false) {
			throw new \Exception("Could not send data");
		}

		fclose($stream);
	}

	/**
	 * Read a file in the temporary worksapce
	 * @param string $filename File to read
	 * @return string File contents
	 * @throws Exception
	 */
	public function read($filename) {
		return $this->exec("cat $this->workspace/$filename");
	}

	/**
	 * The typical processing sequence:
	 *
	 * Connect to the remote system
	 * Create a workspace
	 * Execute some command in that workspace
	 * Destroy the workspace
	 * Disconnect
	 *
	 * @param array $sources Data to save on remote system as files
	 * @return array with keys 'ok', 'msg' (on fail), and 'result' (on success)
	 * @throws Exception
	 */
	public function sequence($sources) {
		if($this->connect()) {
			$result = $this->create_workspace($this->workspaceSource);
			foreach($this->files as $file) {
				$this->write($sources[$file['post']], $file['file']);
			}

			$result .= $this->exec_workspace($this->command);

			$this->destroy_workspace();
			$this->disconnect();

			$result = htmlentities($result, ENT_COMPAT|ENT_SUBSTITUTE|ENT_HTML5);
			$result = str_replace("&ast;", "*", $result);
			return ['ok'=>true, 'result'=>$result];
		}

		return ['ok'=>false, 'msg'=>'Unable to connect to remote system'];
	}

	/**
	 * Get data for execution suitable for sending to a client.
	 *
	 * Data is json-encoded and then encrypted using Encrypt
	 * using the users private and public keys. The avoids client manipulation
	 * of the contents.
	 *
	 * @param Site $site
	 * @return array
	 * @throws EncryptException
	 */
	public function data(Site $site) {
		$data = [
			'remotes'=>$this->remotes,
			'publickey'=>$this->publickey,
			'privatekey'=>$this->privatekey,
			'keyuser'=>$this->keyuser,
			'port'=>$this->port,
			'files'=>$this->files,
			'workspaceSource'=>$this->workspaceSource,
			'command'=>$this->command
		];

		if(count($this->filters) > 0) {
			$data['filters'] = $this->filters;
		}

		$json = json_encode($data);

		$encrypt = new Encrypt();
		$encrypt->privateKey = $site->users->privateKey;
		$encrypt->publicKey = $site->users->publicKey;

		return $encrypt->encrypt_large($json, true);
	}

	/**
	 * Loads data back in from client.
	 *
	 * Decrypts the data that was previously encrypted.
	 *
	 * @param Site $site
	 * @param $data
	 * @throws EncryptException
	 */
	public function load(Site $site, $data) {
		$encrypt = new Encrypt();
		$encrypt->privateKey = $site->users->privateKey;
		$encrypt->publicKey = $site->users->publicKey;

		$msg = $encrypt->decrypt_large($data, false);
		$data = json_decode($msg, true);

		$this->remotes = $data['remotes'];
		$this->publickey = $data['publickey'];
		$this->privatekey = $data['privatekey'];
		$this->keyuser = $data['keyuser'];
		$this->port = $data['port'];
		$this->files = $data['files'];
		$this->workspaceSource = $data['workspaceSource'];
		$this->command = $data['command'];

		if(isset($data['filters'])) {
			$this->filters = $data['filters'];
		} else {
			$this->filters = [];
		}
	}

	/**
	 * Add a filter that will be applied to the data that is
	 * being sent to the
	 * @param $regex
	 * @param $message
	 */
	public function addFilter($regex, $message) {
		$this->filters[] = ['filter'=>$regex, 'message'=>$message];
	}

	/**
	 * Filter an array of text content sources against any regular expression filters
	 * @param array $sources Array of source objects
	 * @return string message if failed filter tests
	 */
	public function filter($sources) {
		foreach($this->filters as $filter) {
			$regex = $filter['filter'];
			foreach($sources as $source) {
				if(preg_match($regex, $source) === 1) {
					return $filter['message'];
				}
			}
		}

		return null;
	}

	/**
	 * Add a file to be uploaded to remote system.
	 * @param string $postName Key name in the sources passed to sequence()
	 * @param string $fileName Filename to use on remote system
	 */
	public function addFile($postName, $fileName) {
		$this->files[] = ['post'=>$postName, 'file'=>$fileName];
	}

	private $site;

	private $remotes = array();	///< Remote systems to use
	private $publickey = null;
	private $privatekey = null;
	private $keyuser = null;
	private $port = 22;
	private $files = [];
	private $workspaceSource = null;
	private $command = null;
	private $filters = [];

	private $connection = false;

	private $workspace = null;
	private $verbose = false;
}