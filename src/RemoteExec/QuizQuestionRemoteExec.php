<?php
/**
 * @file
 * Quiz questions that have a text entry box and allow students to
 * send their result to a remove system for compilation and testing.
 */

namespace CL\RemoteExec;

use CL\Site\Site;
use CL\Users\User;
use CL\Playground\Tab\EditorTab;
use CL\Playground\Tab\OutputTab;
use CL\Playground\Action\Action;


/**
 * Quiz questions that have a text entry box and allow students to
 * send their result to a remove system for compilation and testing.
 *
 * @cond
 * @endcond
 */
class QuizQuestionRemoteExec extends \CL\Quiz\QuizQuestion {

	/** Constructor */
	public function __construct() {
		parent::__construct();

		$this->ssh = new SshExec();

		$this->defaultCommand = new QuizRemoteCommand($this->ssh, 'Test', 'make r={success} test');

		$this->mustProvideMessage = 'Must click Test before submitting quiz result';

		// This is the value that must be returned on a test success for this question.
		$this->successValue = mt_rand(1, mt_getrandmax());
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

			case 'answer':
				$this->answer = $value;
				break;

			case 'name':
				$this->name = $value;
				break;

			case 'appTag':
				$this->appTag = $value;
				break;

			//
			// The following options are deprecated and
			// included for backward compatibility only.
			//
			case 'testfile':
				$this->file('main', $value);
				break;

			case 'command':
				$this->defaultCommand->action->command = $value;
				break;

			case 'success':
				$this->defaultCommand->action->success = $value;
				break;

			case 'fail':
				$this->defaultCommand->action->fail = $value;
				break;

			default:
				parent::__set($property, $value);
				break;
		}
	}


	/**
	 * Present the question to the user
	 * @param Site $site The Site object
	 * @param User $user The current User object
	 * @return string HTML for the quiz question
	 */
	public function present(Site $site, User $user) {
		$html = parent::present($site, $user);

		/*
		 * The question
		 */
		$html .= $this->text;


		//
		// Place for the test result and circuit data
		//
		$html .= <<<HTML
<input type="hidden" class="cl-answer-required" name="cl-playground-answer">
<input type="hidden" name="cl-playground-code">
HTML;

		return $html;
	}


	/**
	 * Present content after the Quiz box. This is used to
	 * add in things like the Cirsim IDE or the Playground
	 * @param Site $site
	 * @param User $user
	 * @return string
	 */
	public function presentAfter(Site $site, User $user) {

		$name = $this->name !== null ? $this->name : $this->file;
		$appTag = $this->appTag !== null ? $this->appTag : $this->quiz->assignTag;

		if(count($this->commands) === 0) {
			$this->commands[] = $this->defaultCommand;
		}

		foreach($this->commands as $command) {
			$action = $command->action;
			$action->option('appTag', $appTag);
			$action->option('name', $name);
			$action->command = str_replace('{success}', $this->successValue, $action->command);
		}

		$remoteExec = new RemoteExecViewAux();

		$ssh = $this->ssh;
		foreach($this->files as $file) {
			$ssh->addFile($file['tag'], $file['name']);
		}

		// Get the playground
		$playground = $remoteExec->playground;
		$playground->height = '40em';
		$playground->display = 'window';

		//
		// File menu
		//
		$file = $playground->addMenu('File');

		//
		// Save menu option
		//
		$save = $file->addMenu('Save');
		$saveAction = new Action('save');
		$saveAction->option('appTag', $appTag);
		$saveAction->option('name', $name);
		$save->action = $saveAction;

		//
		// Test menu
		//
//		$test = $playground->addMenu('Test');
//		$test->action = $this->action;

		// Get the root pane
		$pane = $playground->pane;
		list($left, $right) = $pane->split(true, 50);

		if(count($this->files) === 0) {
			// Compatibility mode, file is indicated by 'testfile' only
			$editor = new EditorTab('main', 'source');
			$left->add($editor);
			$saveAction->source('main');

			foreach($this->commands as $command) {
				$command->action->source('main');
			}
		} else {
			// New mode, tabs specified by name
			foreach($this->files as $file) {
				$tag = $file['tag'];

				$editor = new EditorTab($tag, $file['name']);
				$left->add($editor);
				$saveAction->source($tag);

				foreach($this->commands as $command) {
					$command->action->source($tag);
				}
			}
		}

		// Create menu options
		foreach($this->commands as $command) {
			$option = $playground->addMenu($command->option);
			$option->action = $command->action;
		}

		$output = new OutputTab('output', 'result');
		$right->add($output);

		$playground->load($site, $user, $appTag, $name);

		return $remoteExec->playground->present($site, $user, null);
	}


	/**
	 * Handle a submit of the question answer from the POST page
	 * @param Site $site The site object
	 * @param User $user The current user
	 * @param $post
	 * @return string HTML for the question
	 */
	public function submit(Site $site, User $user, $post) {

		$answer = $post['cl-playground-answer'];
		$circuit = $post['cl-playground-code'];

		$html = $this->text;
		$good = is_numeric($answer) && (+$answer === $this->successValue);

		$this->correct = $good ? $this->points : 0;
		$this->studentanswer = $circuit;

		// Did they get it right?
		if($good) {
			$html .= '<p class="shoutout">Your solution was correct!</p>';
		} else {
			$html .= '<p class="shoutout">Your solution was incorrect!</p>';

			if($this->comment != null) {
				$html .= "<div class=\"centerbox primary\">$this->comment</div>";
			}
		}

		$this->rightanswer = "";
		return $html;
	}



	/**
	 * Return answers for the question when viewed in preview mode.
	 * @return array of answer options
	 */
	public function previewerAnswers(Site $site) {
		$html = \Toggle::begin("Problem answer (staff only)", "p");
		$html .= $this->answer;
		$html .= \Toggle::end();

		return [$html];
	}


	/**
	 * Add a tab to the Playground for testing.
	 * @param $tag Tag associated with the tab data
	 * @param $name File name for the tab
	 */
	public function file($tag, $name) {
		$this->files[] = [
			'tag'=>$tag,
			'name'=>$name
		];
	}

	/**
	 * Add a command and menu option.
	 * @param string $option Menu option (top level)
	 * @param string $command Command to send to remote system.
	 * @return QuizRemoteCommand object.
	 */
	public function command($option, $command) {
		$obj = new QuizRemoteCommand($this->ssh, $option, $command);
		$this->commands[] = $obj;
		return $obj;
	}

	private $ssh;           // SshExec object
	private $answer = null;

	// If a name is provided, that name is used for the single save name
	private $name = null;

	// If an appTag is provided, it is used as the appTag for single save mode
	private $appTag = null;
	private $successValue;

	// QuizRemoteCommand objects
	private $commands = [];

	private $files = [];

	// This command is used as a default to provide backwards compatibility
	// for quizzes. The use is deprecated.
	private $defaultCommand;
}