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
 * @property string source
 * @property string testfile
 * @property string command
 * @property string success
 * @property string fail Regular expression
 * @endcond
 */
class QuizQuestionRemoteExec extends \CL\Quiz\QuizQuestion {

	/** Constructor */
	public function __construct() {
		parent::__construct();

		$this->action = new RemoteQuizAction();

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
			case 'source':
				return $this->source;

			case 'testfile':
				return $this->testfile;

			case 'ssh':
				return $this->action->ssh;

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
			case 'source':
				$this->source = $value;
				break;

			case 'testfile':
				$this->testfile = $value;
				break;

			case 'answer':
				$this->answer = $value;
				break;

			case 'name':
				$this->name = $value;
				break;

			case 'appTag':
				$this->appTag = $value;
				break;

			case 'command':
				$this->command = $value;
				break;

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

		$this->action->option('appTag', $appTag);
		$this->action->option('name', $name);
		$this->action->option('success', $this->success);
		$this->action->option('fail', $this->fail);


		$remoteExec = new RemoteExecViewAux();

		$ssh = $this->action->ssh;
		if($this->testfile !== null) {
			$ssh->addFile('main', $this->testfile);
		}

		$ssh->command = str_replace('{success}', $this->successValue, $this->command);

		// Get the playground
		$playground = $remoteExec->playground;
		$playground->height = '40em';
		$playground->display = 'window';

		// Get the root pane
		$pane = $playground->pane;
		list($left, $right) = $pane->split(true, 50);

		$editor = new EditorTab('main', 'source');
		$left->add($editor);

		$output = new OutputTab('output', 'result');
		$right->add($output);

		// Menus
		$file = $playground->addMenu('File');
		$save = $file->addMenu('Save');
		$saveAction = new Action('save');
		$saveAction->option('appTag', $appTag);
		$saveAction->option('name', $name);
		$saveAction->source('main');
		$save->action = $saveAction;

		$test = $playground->addMenu('Test');
		$this->action->source('main');
		$test->action = $this->action;

		$playground->load($site, $user, $appTag, $name);

		return $remoteExec->playground->present($site, $user, null);
	}


	/**
	 * Handle a submit of the question answer from the POST page
	 * @return string HTML for the question
	 */
	public function submit(Site $site, User $user, $post) {

		$answer = $post['cl-playground-answer'];
		$circuit = $post['cl-playground-code'];

		$html = $this->text;
		$good = +$answer === $this->successValue;

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


	private $action;

	private $ssh;
	private $source = null;
	private $testfile = null;
	private $answer = null;

	// If a name is provided, that name is used for the single save name
	private $name = null;

	// If an appTag is provided, it is used as the appTag for single save mode
	private $appTag = null;
	private $successValue;
	private $command = 'make test';
	private $success = ' ([0-9]*) ';
	private $fail = null;
}