<?php
/**
 * @file
 * Auxiliary view to support the playground
 */

namespace CL\RemoteExec;

use CL\Site\Site;
use CL\Site\ViewAux;
use CL\Site\View;
use CL\Users\User;
use CL\Course\Member;
use CL\FileSystem\FileSystem;
use CL\Playground\PlaygroundViewAux;

/**
 * Auxiliary view to support the playground
 *
 * @cond
 * @property boolean save
 * @endcond
 */
class RemoteExecViewAux extends PlaygroundViewAux {
	/**
	 * RemoteExecViewAux constructor.
	 */
	public function __construct() {
		parent::__construct();


	}

	/**
	 * Called when this auxiliary view is installed in a view
	 * @param View $view View we are installing into
	 */
	public function install(View $view) {
		parent::install($view);

		$view->addJS('remoteexec');
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


			default:
				parent::__set($property, $value);
				break;
		}
	}


}