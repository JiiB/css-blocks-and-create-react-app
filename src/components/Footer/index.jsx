import React from 'react'
import objstr from 'obj-str'

import styles from './Footer.block.css'

const footerStyles = objstr({
	[styles]: true,
	[styles.bar()]: true,
	[styles.footer()]: true,
})

const Footer = () => (
	<footer className={footerStyles}>
		<div className={styles.icon}>1</div>
		<div className={styles.icon}>2</div>
		<div className={styles.icon}>3</div>
	</footer>
)

export default Footer
