<?php
/**
 * @file
 * Quiz questions that have a text entry box and allow students to
 * send their result to a remove system for compilation and testing.
 */

namespace Quiz;

/**
 * Quiz questions that have a text entry box and allow students to
 * send their result to a remove system for compilation and testing.
 */
class QuizQuestionRemoteExec extends \Quiz\QuizQuestion {

	/** Constructor */
	public function __construct() {
		parent::__construct();

		$this->sshexec = new \Extern\SshExec();
	}

	/** Magic method to set parameters for the question
	 *
	 * source - Path that is the source for the files to copy in
	 *
	 * @param $name Name of private member to set
	 * @param $value Value to set */
	public function __set($name, $value) {
		switch($name) {
			case 'source':
				$this->source = $value;
				break;

			case 'testfile':
				$this->testfile = $value;
				break;

			case 'answer':
				$this->answer = $value;
				break;

			default:
				parent::__set($name, $value);
				break;
		}
	}

	public function __get($name) {
		switch($name) {
			case 'source':
				return $this->source;

			case 'testfile':
				return $this->testfile;

			default:
				return parent::__get($name);
		}
	}



	/**
	 * Present the question to the user
	 * @param string $sessionName The name of the session variable for the QuizSession object
	 * @param $preview TRUE if staff preview mode
	 * @returns string HTML for the quiz question
	 */
	public function present(\User $user, $sessionName, $preview=false) {
		$html = parent::present($user, $sessionName, $preview);

		$course = $this->quiz->get_assignment()->get_course();
		$libroot = $course->get_libroot();

		/*
		 * The question
		 */
		$html .= $this->text;

		$assignTag = $this->quiz->get_assignment()->get_tag();
		$quizTag = $this->quiz->get_tag();
		$filesystem = new \FileSystem\FileSystem($course);
		$data = $filesystem->read_text($user, $assignTag, $quizTag, $this->file);
		$text = $data !== null ? addcslashes($data['data'], "\\'\0..\37!@\177..\377") : '';

		$html .= <<<HTML
<script>
var remote = new RemoteExec.Main("#remote-exec"); remote.run();
remote.text('$text');
</script>
HTML;


		/*
		 * Either answer preview or answer submission form
		 */
		if($preview) {
			$html .= "<hr />";

/*			$html .= <<<END
<form id="question" action="" method="post" class="remote-exec">
<input type="hidden" name="answer" id="answer">
<input type="hidden" name="circuit" id="circuit">
<p><button id="re-save">Save</button> Saves the program to the server</p>
<p><button id="re-test">Test</button> Saves and sends program for testing</p>
</form>
<script>
question = new Quiz.QuestionRemoteExec('$sessionName', '$assignTag', '$quizTag', '$this->file');
present_post = question.present_post;
</script>
END; */

			// Comment preview
			if($this->comment !== null) {
				$html .= "<p>Comment:</p>";
				$html .= $this->comment;
			}
		} else {
			$html .= <<<END
<form id="question" action="" method="post" class="remote-exec">
<input type="hidden" name="answer" id="answer">
<input type="hidden" name="circuit" id="circuit">
<p><button id="re-save">Save</button> Saves the program to the server</p>
<p><button id="re-test">Test</button> Saves and sends program for testing</p>
<p><button id="re-submit">Submit</button> <span id="message" class="smallred">&nbsp;</span></p>
</form>
<script>
question = new Quiz.QuestionRemoteExec('$sessionName', '$assignTag', '$quizTag', '$this->file');
present_post = question.present_post;
</script>
END;
		}

		if($preview && $this->answer !== null) {
			$html .= \Toggle::begin("Problem answer (staff only)", "p");
			$html .= $this->answer;
			$html .= \Toggle::end();
		}

		return $html;
	}



	/** @brief Handle a submit of the question answer from the POST page
	 * @returns HTML for the question */
	public function submit($post) {
		$answer = trim(htmlentities($post['answer']));
		$success = strip_tags($post['success']);

		$html = $this->text;
		$good = $success === "yes";

		$this->correct = $good ? $this->get_points() : 0;
		$this->studentanswer = $answer;

		// Did they get it right?
		if($good) {
			$html .= "<hr><p>Your solution was correct!</p>";
		} else {
			$html .= "<hr><p>Your solution was incorrect!</p>";

			if($this->comment != null) {
				$html .= "<div class=\"centerbox primary\">$this->comment</div>";
			}
		}

		$this->rightanswer = "";
		return $html;
	}

	public function get_sshexec() {
		return $this->sshexec;
	}

	private $sshexec;
	private $source = null;
	private $testfile = null;
	private $answer = null;
}