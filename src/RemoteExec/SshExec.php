<?php
/**
 * @file
 * This class manages execution of test programs on a remote
 * system via SSH.
 */

namespace CL\RemoteExec;

use CL\Site\Site;

use ssh2_connect;
use ssh2_auth_pubkey_file;


/**
 * This class manages execution of test programs on a remote
 * system via SSH.
 */
class SshExec {
	/**
	 * SshExec constructor.
	 * @param Site $site The site object
	 */
	public function __construct(Site $site) {
		$this->site = $site;
	}

	/**
	 * Magic function to specify properties
	 *
	 * remote - Adds a remote system to use
	 *
	 * @param $name
	 * @param $value
	 */
	public function __set($name, $value) {
		switch($name) {
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
		}
	}

	/**
	 * Attempt to connect to the remote system.
	 * @return bool true if connected
	 */
	public function connect() {
		$remote = $this->remotes[0];

		$this->connection = ssh2_connect($remote, $this->port);
		if($this->connection === false) {
			$this->connection = null;
			return false;
		}

		$rootdir = $this->site->rootDir;
		$publickey = $rootdir . $this->publickey;
		$privatekey = $rootdir . $this->privatekey;

		if(!ssh2_auth_pubkey_file($this->connection, $this->keyuser,
			$publickey, $privatekey, null)) {
			$this->connection->disconnect();
			$this->connection = null;
			return false;
		}

		return true;
	}

	public function disconnect() {
		$this->connection = null;
		return true;
	}

	/**
	 * Execute a command on the remote system.
	 * @param $cmd Command to execute
	 * @return string Response to the command
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

	public function exec_workspace($cmd) {
		return $this->exec("cd $this->workspace; $cmd");
	}

	/**
	 * Create a workspace on the remote system and optionally copy in
	 * some source data.
	 * @param string $loading Path on remote system to data to load
	 * @return string Command result
	 */
	public function create_workspace($loading = null) {
		$this->workspace = "/tmp/t" . bin2hex(openssl_random_pseudo_bytes(8));
		if($loading !== null) {
			return $this->exec("mkdir $this->workspace; cp -rf $loading $this->workspace");
		} else {
			return $this->exec("mkdir $this->workspace");
		}
	}

	public function destroy_workspace() {
		return $this->exec("rm -rf $this->workspace");
	}

	public function ls() {
		return $this->exec("ls -al $this->workspace");
	}

	public function write($data, $filename) {
		if(!($sftp = ssh2_sftp($this->connection))) {
			throw new \Exception('SSH FTP command failed');
		}

		$remote_file = "$this->workspace/$filename";
		$stream = @fopen("ssh2.sftp://$sftp$remote_file", 'w');
		if (! $stream)
			throw new Exception("Could not open file: $remote_file");

		if (fwrite($stream, $data) === false)
			throw new Exception("Could not send data");

		fclose($stream);
	}

	public function read($filename) {
		return $this->exec("cat $this->workspace/$filename");
	}

	private $site;

	private $remotes = array();	///< Remote systems to use
	private $publickey = null;
	private $privatekey = null;
	private $keyuser = null;
	private $port = 22;

	private $connection = false;

	private $workspace = null;
}