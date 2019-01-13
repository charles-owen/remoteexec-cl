<?php
/**
 * @file
 * View class to present a view of remote execution quizzes
 */

namespace CL\RemoteExec;

use \CL\Quiz\QuizView;

/**
 * View class to present a view of remote execution quizzes
 */
class QuizRemoteExecView extends QuizView {
	/**
	 * Present content that goes after the quiz. This is overridden in custom
	 * views when extra content such as Cirsim belongs at the bottom of the page.
	 * @return string HTML
	 */
	public function presentAfter() {
		return <<<HTML
<p class="cl-single-space">&nbsp;</p></div><div id="cl-quiz-after"></div><div class="content"><p class="cl-single-space">&nbsp;</p>
HTML;
	}
}