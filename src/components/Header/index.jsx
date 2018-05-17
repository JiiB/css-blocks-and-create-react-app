import React from 'react'

import styles from './Header.block.css'

const Header = () => (
	<header className={styles}>
		<div className={styles.icon}>Back</div>
		<div className={styles.icon}>Login</div>
	</header>
)

export default Header
