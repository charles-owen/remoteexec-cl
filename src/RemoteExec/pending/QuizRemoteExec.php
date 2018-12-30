<?php
/**
 * @file
 * Quiz with remote execution of compilations and testing
 */

namespace Quiz;

/**
 * Quiz with remote execution of compilations and testing
 *
 * For this type of quiz a window is opened that students
 * can use to edit files, which are then sent to a remote
 * system for compilation and testing.
 */
class QuizRemoteExec extends Quiz {
	/** Constructor
	 * @param Assignment $assignment Assignment this quiz is for
	 * @param $tag A tag unique to this quiz in this assignment
	 */
	public function __construct(\Assignments\Assignment $assignment, $tag, $points) {
		parent::__construct($assignment, $tag, $points);
	}

	/**
	 * Factory function to create a view appropriate for this quiz
	 * @param \User $user User we are creating the view for
	 * @param $session $_SESSION array
	 * @return QuizView object
	 */
	public function create_view(\User $user, &$session) {
		$course = $this->get_assignment()->get_course();
		return new QuizRemoteExecView($course, $user, $this, $session);
	}
}