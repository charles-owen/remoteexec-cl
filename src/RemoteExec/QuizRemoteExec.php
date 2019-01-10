<?php
/**
 * @file
 * Quiz with remote execution of compilations and testing
 */

namespace CL\RemoteExec;

use \CL\Quiz\Quiz;
use \CL\Quiz\QuizView;
use \CL\Site\Site;

/**
 * Quiz with remote execution of compilations and testing
 *
 * For this type of quiz a window is opened that students
 * can use to edit files, which are then sent to a remote
 * system for compilation and testing.
 */
class QuizRemoteExec extends Quiz {

	/**
	 * Factory function to create a view appropriate for this quiz
	 * @param Site $site the Site object
	 * @return QuizView object
	 */
	public function createView(Site $site) {
		return new QuizRemoteExecView($site, $this);
	}
}