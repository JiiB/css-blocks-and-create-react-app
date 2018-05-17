import React from 'react'
import objstr from 'obj-str'

import styles from './Header.block.css'

const headerStyles = objstr({
	[styles]: true,
	[styles.bar()]: true,
	[styles.header()]: true,
})

const Header = () => (
	<header className={headerStyles}>
		<div className={styles.icon}>Back</div>
		<div className={styles.icon}>Login</div>
	</header>
)

export default Header
